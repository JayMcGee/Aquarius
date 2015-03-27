
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


var databaseHelper = require('./aquariusSensorHelper') //External file that helps the connection and querying to the database

//Execution path for the RTC driver and Switches and Watchdog feeder
var rtcExecPath = "python /var/lib/cloud9/Aquarius/exec/driverRTC.py"
var modeSwitchExec = "python /var/lib/cloud9/Aquarius/exec/get_gpio_sw1.py"
var watchdogFeeder = "python /var/lib/cloud9/Aquarius/exec/feeder.py"

//Still not used
var _2SwitchExec = "python /var/lib/cloud9/Aquarius/exec/get_gpio_sw2.py"
var _3SwitchExec = "python /var/lib/cloud9/Aquarius/exec/get_gpio_sw3.py"
var _4SwitchExec = "python /var/lib/cloud9/Aquarius/exec/get_gpio_sw4.py"

var test_val = 1;

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
//
var CONFIG_Verbose_Level = 4;

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
connection.connect(function(err) {
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
function main() {

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
    if (CONFIG_Operation_Mode == 1) {
        watchdog()
        log("Auto mode", 2)
        log("Reading new sensor values", 2)
        drawSeparator()
        console.log()
        
        //Reads all sensors in the data base
        readAllSensorsInDataBase(getSensorReadingCallback)
    }
    else {
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
function assignConfigurationValues(err, rows, fields) {
    if (err) {
        throw err;
        log("Could not read config table", 1)
    }
    log("Assigning config data", 2)

    //For each row returned, get value and key name, and use name to assign to good var
    for (index = 0; index < rows.length; ++index) {
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
        else if (currentName == "NUMBER_RETRYS") {
            log("Assigned retry attempts", 3)
            CONFIG_Number_Retries = currentValue
        }
        else if (currentName == "DEBUG_LEVEL") {
            log("Assigned debug level", 3)
            CONFIG_Verbose_Level = currentValue
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
    log("Reading and adding data", 2)

    alreadyDone = []

    Sensors_Count = rows.length
    Sensors_Done = 0

    for (index = 0; index < rows.length; ++index) {
        var Driver = rows[index].Driver
        var Address = rows[index].PhysicalAddress
        var UnitName = rows[index].UnitName
        var CloudiaUnitID = rows[index].CloudiaUnitID

        if (alreadyDone.indexOf(CloudiaUnitID) == -1) {
            log("Reading : " + UnitName, 2)
            alreadyDone[alreadyDone.length] = CloudiaUnitID

            var result = sh.exec(Driver + " " + Address + " R")
            /////////////////////////////////////
            log(Driver + " " + Address + " R", 2)
            /////////////////////////////////////
            var splittedStdOutput = result.stdout.split(';')


            log("Executed : " + splittedStdOutput, 3)

            for (i = 0; i < rows.length; ++i) {
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
    databaseHelper.getSensors(connection, callback)
}

function readDataFromSensorsNotSent(callback) {
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
    
    readDataFromSensorsNotSent(createJSONfromDatabase);
    
}

function createJSONfromDatabase(err, rows, fields) {
    if (err) {
        throw err;
        console.log("Could not get Sensors Info", 1)
    }
    else
    {
        //var baseEvent = { 'sensorunitid' :  'data': [] }
        //JSON Formatter
        var stationDateTime = new Date().toISOString()
        var stationID = CONFIG_Station_ID
        
        var JSONsession = 
        {
    	    "stationmessage": 
        	{
            	"datetime": stationDateTime,
            	"stationid": stationID,
            	"eventtype": "regularreading",
            	"event": []
        	}
        }
        
        var currentEvent = null
        var previousSensorUnitID = null
        var sensorUnitID;
        
        for (var i = 0; i < rows.length; i++)
        {
            // Get current SensorUnitID (Physical sensor)
            sensorUnitID = rows[i].CloudiaUnitID
            log("JSON creation at : " + sensorUnitID, 3)   
            // If the last sensorunitID is not the same as the current one
            if(previousSensorUnitID !==  sensorUnitID){
                // If it is not the first iteration
                if(previousSensorUnitID !== null)
                    JSONsession.stationmessage.event.push(currentEvent)
                //Create a new event for the physical ID
                currentEvent = { 'sensorunitid' : sensorUnitID, 'data': [] }
            }
            
            var sensorsubunitid = rows[i].CloudiaSubUnitID
            var value =rows[i].ReadValue
            var valuetype = rows[i].UnitType
            var datetime = rows[i].ReadDate
            
            var JSON_sensorData = {'id': sensorsubunitid, 'valuetytpe':"as is", 'value':value, 'datetime':datetime}
            
            log("JSON Sensor Data : " + JSON_sensorData, 3)
            
            currentEvent.data.push(JSON_sensorData)
            
            previousSensorUnitID = sensorUnitID
        }
        JSONsession.stationmessage.event.push(currentEvent)
        log(JSON.stringify(JSONsession), 3)
        
    }
    Finalise()
}

function Finalise()
 {
    if (CONFIG_Operation_Mode == 1) {


        var date = new Date()

        //Creates a date with added minutes from the interval configuration
        drawSeparator()
        log("Date without added interval : " + date.toISOString().slice(0, 19).replace('T', ' '), 2)
        date.setMinutes(date.getMinutes() + parseInt(CONFIG_Interval))
        log("New date with added interval : " + date.toISOString().slice(0, 19).replace('T', ' '), 2)
        drawSeparator()

        //Setup the alarm on the RTC
        log("Setting up rtc to wake up at : " + date.getMinutes(), 3)
        var rtcSetAlarm = sh.exec(rtcExecPath + " setalarm -m " + date.getMinutes())
        drawSeparator()
        var rtcSetAlarm = sh.exec(rtcExecPath + " enablealarm")
        drawSeparator()

        test_val = 0
        //Prepare Data for server ( Format to Json )
        //Execute a shutdown
        var shutdown = sh.exec("shutdown -h now")
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
    fs.open('/dev/watchdog', 'w', function(err, fd){
        if(err) throw err;
        setInterval(function() {
            if (test_val) {
                console.log("This is the file desc : " + fd)
                fs.writeSync(fd, "\n")
            }
            else log("Did not write to watchdoge", 1)       
         }, 1000)
    })
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
    socket.on('updateTemp', function() {
        var randomnumber = (Math.random() * 41.1)
        socket.emit('lastTemp', {
            'value': randomnumber
        });
    });
    socket.on('updatePh', function() {
        var randomnumber = (Math.random() * 13.99)
        socket.emit('lastPh', {
            'value': randomnumber
        });
    });
    socket.on('updateDo', function() {
        var randomnumber = (Math.random() * 12.99)
        socket.emit('lastDo', {
            'value': randomnumber
        });
    });
    socket.on('updateCond', function() {
        var randomnumber = (Math.random() * 20000)
        socket.emit('lastCond', {
            'value': randomnumber
        });
    });
    socket.on('updateStationTemp', function() {
        var randomnumber = (Math.random() * 41.1)
        socket.emit('lastStationTemp', {
            'value': randomnumber
        });
    });
    socket.on('updateStationHum', function() {
        var randomnumber = (Math.random() * 100)
        socket.emit('lastStationHum', {
            'value': randomnumber
        });
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


