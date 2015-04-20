
/**
 * @file   app.js
 * @author Jean-Pascal McGee et Jean-Philippe Fournier
 * @date   6 Feb 2015
 * @brief  Application file to run on the NodeJs server. This service application will
 *          create the main server for the aquarius station. Its goals are :
 *          - Create a connection to the mysql database
 *          - Get all of the configuration parameters from the db
 *          - Get the state of the station (auto mode or manual)
 *          - (Maybe other switch modes)
 *          - Get or set date on the RTC or BBB if one is backwards 
 *          - If mode is automatic, read all sensors, set new alarm on rtc (following current configuration) and reboot
 *          - If mode is manual, read sensors and wait for connections          
 *
 * @version 1.0 : Première version with limited functionnality
 * @version 2.0 : March 18, 2015 Added looping and restarting functionnality
 * Environnement: Linux Debian
 *
 * Hardware:
 *      Board Aquarius
 *      BeagleBone Black (Rev.C recommended)
 */

var express = require('express.io'); //Express and Socket.io integration
var mysql = require('mysql'); //Javascript mySql Connector
//TODO Wait what ?
var exec = require('child_process').exec;
var schedule = require('node-schedule'); //In application schedule creator
var fs = require('fs');
var sh = require('execSync'); //Permits the execution of external applications synchronously

var pubnub = require("pubnub")({
    ssl           : true,  // <- enable TLS Tunneling over TCP 
    publish_key   : "pub-c-abfe0a2b-859f-4c0a-a513-03568a39e142",
    subscribe_key : "sub-c-9e6a1140-d4a9-11e4-8323-02ee2ddab7fe"
});

pubnub.subscribe({
    channel  : "my_channel",
    callback : function(message) {
        console.log( " > ", message );
    }
});
 


var databaseHelper = require('./aquariusSensorHelper') //External file that helps the connection and querying to the database

//Execution path for the RTC driver and Switches and Watchdog feeder
var rtcExecPath = "python /var/lib/cloud9/Aquarius/exec/driverRTC.py"
var modeSwitchExec = "python /var/lib/cloud9/Aquarius/exec/get_gpio_sw1.py"

//Still not used
var _2SwitchExec = "python /var/lib/cloud9/Aquarius/exec/get_gpio_sw2.py"
var _3SwitchExec = "python /var/lib/cloud9/Aquarius/exec/get_gpio_sw3.py"
var _4SwitchExec = "python /var/lib/cloud9/Aquarius/exec/get_gpio_sw4.py"

var test_val = 1;

var fileWatch = null

//Config vars
//This one is used to store the StationID used to id it in ClouDIA 
var CONFIG_Station_ID = null;
//Used for the address where data will be sent
var CONFIG_Cloudia_Address = null;
//Last known date by the station
var CONFIG_Last_Date = null;
//Interval to add toTC alarm for an adequate time of reboot
var CONFIG_Interval = null;
//Number of measure retries to attempt
var CONFIG_Number_Retries = null;
//Indicates which mode is active (manual or auto)
var CONFIG_Operation_Mode = null;
//Log file directory
var CONFIG_Log_File_Directory = null;
//How much should I talk ?
var CONFIG_Verbose_Level = 4;
//Cloudia Sensor Unit 
var CONFIG_Sensor_unit = null;
//Temperature compensation device address
var CONFIG_Temperature_Compensation = null;

var Sensors_Count = null
var Sensors_Done = null

//////////////////////////////////////////////////////////
//Establishing connection to Station database (local DB)    
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'snoopy'
});

/**
 * Creates connection to database
 */
connection.connect(function(err){
    /**
     *   @brief Async function called upon creation of the connection
     */
    if (err) {
        console.error('Error connecting: ' + err.stack);
        return;
    }

    drawSeparator()
    log('Connected as id ' + connection.threadId, 2);
    drawSeparator()

    //Calls configuration read from databasehelper, callsback to assignConfigurationValues
    databaseHelper.init(connection)
    databaseHelper.readConfig(connection, assignConfigurationValues);
});

/**
 *   Main logic function Upon arriving in this function, all configuration values have been assigned
 */
function main(){

    CONFIG_Log_File_Directory = '/var/lib/cloud9/Aquarius/'

    drawSeparator()
    //Reset RTC so it does not retrigger or stay at low logic
    log("Resetting RTC", 3)
    sh.exec(rtcExecPath + " disablealarm")
    //Get date from the RTC and set it to system date
    log("Getting date from RTC", 3)
    sh.exec(rtcExecPath + " getdate")

    //Get current system date from output of date command
    var strCurrentSysDate = sh.exec("date").stdout
    //And get a date object from it
    var currentSysDate = Date.parse(strCurrentSysDate)
    //Get a date object from last known date from configuration
    var lastDate = Date.parse(CONFIG_Last_Date)

    log("Current date : " + strCurrentSysDate, 2)
    log("Last date : " + CONFIG_Last_Date, 2)

    //If last known date is behind current system date, set last known to current and imply its correct
    if (lastDate < currentSysDate) {
        log("Last date is being updated to now : " + strCurrentSysDate, 2)
        databaseHelper.setConfig(connection, 'LAST_KNOWN_DATE', strCurrentSysDate, configurationSetCallBack)

    }
    //If last known date is after current system date, set current system and rtc date to last known
    else if (lastDate >= currentSysDate) {
        log("Last date is in the future ? Setting date to last known, please update me", 1)
        var execSetCurrentSysDate = sh.exec('date -s "' + CONFIG_Last_Date + '"')
        var rtcSetDate = sh.exec(rtcExecPath + " setdate")
    }

    drawSeparator()
    console.log()
    drawSeparator()

    //If current mode is HIGH, enter auto mode. Read all sensors, set RTC to wake up and shutdown
    if (CONFIG_Operation_Mode == 1) { //AUTO 
        fileWatch = watchdog()
        fs.writeSync(fileWatch, "\n")
        exec('python /var/lib/cloud9/Aquarius/exec/set_gpio_del.py', function(){})
        
        writeToWatchDog(fileWatch)
        log("Auto mode", 2)
        log("Reading new sensor values", 2)
        drawSeparator()
        writeToWatchDog(fileWatch)
        //Reads all sensors in the data base
        readAllSensorsInDataBase(getSensorReadingCallback)
    }
    else {  //MANUAL
        exec('python /var/lib/cloud9/Aquarius/exec/set_gpio_del_on.py', function(){})
        log("Manual mode", 2)
        readAllSensorsInDataBase(getSensorReadingCallback)
        log("Waiting", 2)
        
        drawSeparator()

    }
}

/**
 *  @brief Callback from selecting all config values in the database
 *  @param err Errors relative to fetching the data
 *  @param rows All rows returned from the database
 *  @param fields
 *  Calls main at the end to continue execution of the station
 */
function assignConfigurationValues(err, rows, fields){
    if (err){
        throw err;
        log("Could not read config table", 1)
    }
    log("Assigning config data", 2)

    //For each row returned, get value and key name, and use name to assign to good var
    for (index = 0; index < rows.length; ++index){
        currentName = rows[index].Name
        currentValue = rows[index].Value

        log("Data : " + currentName + " value : " + currentValue, 3)
        if (currentName == "STATION_ID") {
            log("Assigned station id", 3)
            CONFIG_Station_ID = currentValue
        }
        else if (currentName == "READ_INTERVAL") {
            log("Assigned read interval", 3)
            CONFIG_Interval = currentValue
        }
        else if (currentName == "SEND_ADDRESS") {
            log("Assigned send address", 3)
            CONFIG_Cloudia_Address = currentValue
        }
        else if (currentName == "LAST_KNOWN_DATE") {
            log("Assigned last known date", 3)
            CONFIG_Last_Date = currentValue
        }
        else if (currentName == "NUMBER_RETRIES") {
            log("Assigned retry attempts", 3)
            CONFIG_Number_Retries = currentValue
        }
        else if (currentName == "DEBUG_LEVEL") {
            log("Assigned debug level", 3)
            CONFIG_Verbose_Level = currentValue
        }
        else if ( currentName == "SENSOR_UNIT"){
            log("Assigned SensorUnit ID", 3)
            CONFIG_Sensor_unit = currentValue
        }
        else if ( currentName == "OW_DRIVER_WATER_COMP"){
            log("Assigned temperature compensation", 3)
            CONFIG_Temperature_Compensation = currentValue
        }
    }

    //Get current mode of operation
    var currentMode = sh.exec(modeSwitchExec).stdout
    log("Switch is  : " + currentMode, 2)

    if (currentMode.indexOf("HIGH") > -1) {
        CONFIG_Operation_Mode = 1
        log("Operation mode is  : AUTO", 2)
    }
    else {
        CONFIG_Operation_Mode = 0
        log("Operation mode is  : MANUAL", 2)
    }
    //setInterval( main() , (60000*5) );
   main()
}



/**
 * 
 */
function configurationSetCallBack(err, result) {
    log("Configuration result : " + result, 2)
}

/**
 *
 */
function t_Data_insertCallBack(err, result) {
    log("Insert result : " + result, 3)
    writeToWatchDog(fileWatch)
    Sensors_Done++
    if (Sensors_Count <= Sensors_Done) {
        finishedReadingSensors()
    }
}

/**
 *   @brief Callback to getting all sensors from database. It will read all sensors returned and save into the database all
 *   measures taken
 *   @param err
 *   @param rows
 *   @param fields
 */
function getSensorReadingCallback(err, rows, fields) {
    if (err) {
        throw err;
        log("Could not read sensors table", 1)
    }
    log("Reading and adding data"   , 2)
    writeToWatchDog(fileWatch)
    alreadyDone = []

    Sensors_Count = rows.length
    Sensors_Done = 0

    for (index = 0; index < rows.length; ++index) {
        writeToWatchDog(fileWatch)
        var Driver = rows[index].Driver
        var Address = rows[index].PhysicalAddress
        var UnitName = rows[index].UnitName
        var CloudiaUnitID = rows[index].CloudiaUnitID

        if (alreadyDone.indexOf(CloudiaUnitID) == -1) {
            log("Reading : " + UnitName, 2)
            alreadyDone[alreadyDone.length] = CloudiaUnitID

            
            /////////////////////////////////////
            
            /////////////////////////////////////
            var tryCount = 0
            var splittedStdOutput
            var result
            do{
                if (CONFIG_Temperature_Compensation !== null)
                {
                    result = sh.exec(Driver + " " + Address + " R:-t:" + CONFIG_Temperature_Compensation)
                    log(Driver + " " + Address + " R:-t:" + CONFIG_Temperature_Compensation, 3)
                }
                else
                {
                    result = sh.exec(Driver + " " + Address + " R")
                    log(Driver + " " + Address + " R", 3)
                }
                
                tryCount++
                log("Try counts :" + tryCount, 2)
                //console.log("Test result : " + (result.stdout.indexOf("ERROR") > -1))
                //console.log("Test 2 result : " + (CONFIG_Number_Retries))
            }while(result.stdout.indexOf("ERROR") > -1 && tryCount <= parseInt(CONFIG_Number_Retries));

            splittedStdOutput = result.stdout.split(';')  
            log("Executed : " + splittedStdOutput, 2)

            for (i = 0; i < rows.length; ++i) {
                writeToWatchDog(fileWatch)
                if (rows[i].CloudiaUnitID == CloudiaUnitID) {

                    if (splittedStdOutput.length > rows[i].Position) {
                        var value = splittedStdOutput[rows[i].Position]
                        log("Inserting into database value : " + value + " " + rows[i].MeasureUnit, 2)
                        databaseHelper.setData(connection, value, rows[i].VirtualID, 0, t_Data_insertCallBack)
                    }
                    else {
                        log("Missing data : " + UnitName, 1)
                        Sensors_Done++
                        if (Sensors_Count <= Sensors_Done) {
                            finishedReadingSensors()
                        }
                    }
                }
            }
        }
    }
}



/**
 *   @brief Function that read
 */
function readAllSensorsInDataBase(callback) {
    writeToWatchDog(fileWatch)
    databaseHelper.getSensors(connection, callback)
}

function readDataFromSensorsNotSent(callback) {
    writeToWatchDog(fileWatch)
    databaseHelper.getDataForSensorsNotSent(connection, callback)
}

/**
 *
 */
function sendConfigToWeb(err, rows, fields) {
    if (err) {
        throw err;
        log("Could not read config table", 1)
    }
    socket.emit('ReceiveConfig', {
        'row': rows
    })
}

/**
 *
 */
function drawSeparator() {
    console.log("///////////////////////////////////////////")
}

function finishedReadingSensors() {
    writeToWatchDog(fileWatch)
    readDataFromSensorsNotSent(createJSONfromDatabase)
}

function createJSONfromDatabase(err, rows, fields) {
    if (err) {
        throw err;
        console.log("Could not get Sensors Info", 1)
    }
    else
    {
        writeToWatchDog(fileWatch)
        //var baseEvent = { 'sensorunitid' :  'data': [] }
        //JSON Formatter
        var t = new Date()
        var stationID = CONFIG_Station_ID
        
        var JSONsession = 
        {
    	    "stationmessage": 
        	{
            	"datetime": t.toISOString().slice(0, 19).replace('T', ' '),
            	"stationid": stationID,
            	"eventtype": "regularreading",
            	"event": []
        	}
        }
        
        var event = { 'sensorunit' : CONFIG_Sensor_unit, 'data': [] }
        var previousPhysicalID = null
        var PhysicalID;
        var ids = []
        for (var i = 0; i < rows.length; i++)
        {
            writeToWatchDog(fileWatch)
            // Get current SensorUnitID (Physical sensor)
            PhysicalID = rows[i].PhysicalID
            ids.push(rows[i].ID)
            log("JSON creation at : " + PhysicalID, 3)   
            // If the last sensorunitID is not the same as the current one
            
            var sensorsubunitid = rows[i].CloudiaSubUnitID
            var value =rows[i].ReadValue
            var measureunit = rows[i].UnitType
            var datetime = rows[i].ReadDate
            var physicalname = rows[i].PhysicalName
            
            
            //var JSON_sensorData = {'id': sensorsubunitid, 'physicalname': physicalname, 'measureunit' : measureunit, 'valuetytpe':"asis", 'value':value, 'datetime':datetime.toISOString().slice(0, 19).replace('T', ' ')}
            var JSON_sensorData = {'id': sensorsubunitid, 'physicalname': physicalname, 'measureunit' : measureunit, 'valuetype':"asis", 'value': value, 'datetime':datetime.toISOString().slice(0, 19).replace('T', ' ')}
            
            
            log("JSON Sensor Data : " + JSON_sensorData, 3)
            
            event.data.push(JSON_sensorData)
            
            previousPhysicalID = PhysicalID
        }
        
        JSONsession.stationmessage.event.push(event)
        log(JSON.stringify(JSONsession), 3)
        
        var message = JSON.stringify(JSONsession);
        //message = '{"stationmessage":{"datetime":"2015-04-15 11:59:23","stationid":"bra003","eventtype":"regularreading","event":[{"sensorunit":"su0008","data":[{"id":"01","datetime":"2015-04-15 11:55:15","valuetype":"asis","value":"8.65"}]}]}}'
        //JSONsession = JSON.parse(message)
        console.log (message)
        
        databaseHelper.sendPostFile(JSONsession, "https://dweet.io:443/dweet/for/", "Aquarius", Finalise)
        databaseHelper.sendPost(message, Finalise)
        /*var fs = require('fs');
fs.writeFile("/tmp/test", "Hey there!", function(err) {
    if(err) {
        return console.log(err);s
    }

    console.log("The file was saved!");
}); */
        writeToWatchDog(fileWatch)
        log("Count of ids : " + ids.length, 2)
        var idToSet = 0
        for(var s = 0; s < ids.length; s++)
        {
            databaseHelper.setDataAsSent(connection, ids[s], function(err, result){
                log("Set as sent : " + result, 2)
                idToSet++
                if(idToSet >= ids.length)
                {
                    Finalise()
                }
            })
        }
        /*
        pubnub.publish({ 
            channel   : 'Aquarius',
            message   : message,
            callback  : function(e) {
                writeToWatchDog(fileWatch)
                log( "SUCCESS!", 2 )
                log("COunt of ids : " + ids.length, 2)
                var idToSet = 0
                for(var s = 0; s < ids.length; s++)
                {
                    databaseHelper.setDataAsSent(connection, ids[s], function(err, result){
                        log("Set as sent : " + result, 2)
                        idToSet++
                        if(idToSet >= ids.length)
                        {
                            //Finalise()
                        }
                    })
                }
            },
            error     : function(e) {
                writeToWatchDog(fileWatch)
                log( "FAILED! RETRY PUBLISH!", 2 ); 
                // Finalise()
            }
        });
           */ 
    }
    
}


function idWasSet(err, result){
    
    log("Set as sent : " + result)
}

function Finalise()
 {
    if (CONFIG_Operation_Mode == 1) {
        
        
        var delay=(60000 * 5);//1 seconds
        setTimeout(function(){
            readAllSensorsInDataBase(getSensorReadingCallback)
        //your code to be executed after 1 seconds
        },delay); 
        
        
        /*
        var date = new Date()

        //Creates a date with added minutes from the interval configuration
        drawSeparator()
        log("Date without added interval : " + date.toISOString().slice(0, 19).replace('T', ' '), 2)
        date.setMinutes(date.getMinutes() + parseInt(CONFIG_Interval))
        log("New date with added interval : " + date.toISOString().slice(0, 19).replace('T', ' '), 2)
        drawSeparator()

        //Setup the alarm on the RTC
        log("Setting up rtc to wake up at : " + date.getMinutes(), 2)
        var rtcSetAlarm = sh.exec(rtcExecPath + " setalarm -m " + date.getMinutes())
        drawSeparator()
        var rtcSetAlarm = sh.exec(rtcExecPath + " enablealarm")
        drawSeparator()

        test_val = 0
        //Prepare Data for server ( Format to Json )
        //Execute a shutdown
        writeToWatchDog(fileWatch)
        
        setTimeout(function(){
            setInterval(function() {
                log("Shutting down now ", 0)
                var shutdown = sh.exec("shutdown -h now")
            }, 1000)
        }, 2000)
        */
        
    }
    else {
           //Prepare Data for server ( Format to Json )
        log("Reading sensor finished", 2)
    }
 }

function log(dataToAppend, level)
{
    dataToAppend =  "[" + new Date().toISOString() + "]: " + dataToAppend + "\r"
    //console.log(level + " <= " + CONFIG_Verbose_Level)
    if(level <= CONFIG_Verbose_Level){
        console.log(dataToAppend)
        fs.appendFileSync(CONFIG_Log_File_Directory + 'log.txt', dataToAppend)    
    }
}

function watchdog()
{
    return fs.openSync('/dev/watchdog', 'w')
}

function writeToWatchDog(fd){
    if(fd !== null)
    {
        fs.writeSync(fd, "\n")
        log("write to watchdog", 1)
    }
}
        


////////////////////////////////////////////////////////////
//Starting web-client server
app = express();
app.use(express.static(__dirname + '/public'));
app.use(app.router);
app.http().io();
app.listen(8088);

// Setup the ready route, and emit talk event.
app.io.route('ready', function(req) {
    log('User Connected');
})
// Send the client html.
app.get('/', function(req, res) {
    res.sendfile(__dirname + '/index.html')
})
app.get('/index.html', function(req, res) {
    res.sendfile(__dirname + '/index.html')
})
app.get('/form.html', function(req, res) {
    res.sendfile(__dirname + '/form.html')
})
app.get('/chart.html', function(req, res) {
    res.sendfile(__dirname + '/chart.html')
})
//The 404 Route (ALWAYS Keep this as the last route)
app.get('*', function(req, res) {
    res.sendfile(__dirname + '/404.html')
})
//////////////////////////////////////////////////////////////
// Manage any Socket.io Event

//On connection to the client send data required to generate interface
app.io.on('connection', function(socket) {
    socket.on('ready', function() {
        log("Requested sensors", 2)
        databaseHelper.getSensorsAndEmit(connection, socket)
    })
})

//On connection to the client send the most recent data from the DB
//Send  
app.io.on('connection', function(socket) {
    socket.on('RequestConfig', function() {
        log("Requested configuration", 2)
        databaseHelper.readConfigAndEmit(connection, socket)
    })
    socket.on('UpdateConfig', function(data) {
        log("Requested an update to configuration", 2)
        databaseHelper.setConfig(connection, data.Name, data.Value, configurationSetCallBack)
    })
    socket.on('RequestNewMeasure', function(data) {
        log("Requested a new measure on XX sensor", 2)

    })
})

//Receive update Command
app.io.on('connection', function(socket) {
    
    socket.on('configInterval', function(data) {
        var interval = data.interval;
        log("Interval = " + interval, 2)
    });
    
    
    socket.on('requestMeasure', function(ID) {
        var sensorId=ID.ID
        
        var sql = 'SELECT * FROM `t_PhysicalSensor`,`t_VirtualSensor`,`t_Types` WHERE physical_t_type = types_id and virtual_t_physical = physical_id and virtual_id ='+ sensorId
        connection.query(sql, function(err, rows, fields) {
            if (err) {
                throw err;
                log("Could not get sensor for update", 1)
            }
            var execPath = rows[0].types_driver
            var physAddress = rows[0].physical_address
            var dataPosition = rows[0].virtual_driver_pos
            var id = rows[0].virtual_id
            
            result = sh.exec(execPath + " " + physAddress + " R")
            
            console.log(result.stdout)
            
            if(result.stdout.indexOf("ERROR") > -1 )
            {
                var measuredValue = "Error"
            }
            else
            {
                var splittedStdOutput = result.stdout.split(';')
                var measuredValue = splittedStdOutput[dataPosition];
                
            }
            
            log("Page Web requested sensor : " + sensorId + "  Returning result : " + measuredValue ,1)
            socket.emit('updateSensor', {
                result: measuredValue,
                ID: sensorId
            })
        })
    });
});

//Send from database Functions
function sendTempFromDB(rowCount, socket) {

    log("DEPRECATED", 1)

    connection.query('SELECT date AS DateReading, water_temp AS TempWater FROM `sensorData` ORDER BY date DESC LIMIT 10;',

    function(err, rows, fields) {
        if (err) throw err;
        //send temperature reading out to connected clients
        socket.emit('tempData', {
            'array': rows
        });
    });
}


