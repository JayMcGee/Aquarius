
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

var express = require('express.io');                    //Express and Socket.io integration
var mysql   = require('mysql');                         //Javascript mySql Connector
//TODO Wait what ?
var exec    = require('child_process').exec,child,pHc,DOc,Kc,OWc,DHTc;      //Execute shell command                     //Terminal access from web-client
//Still used ?
var schedule= require('node-schedule');                 //In application schedule creator

var sh      = require('execSync');                      //Permits the execution of external applications synchronously

var databaseHelper = require('./aquariusSensorHelper')  //External file that helps the connection and querying to the database

//TODO Is necessary ?
var interval = 10000; //enter the time between sensor queries here (in milliseconds)


//Execution path for the RTC driver and Switches
var rtcExecPath = "python /var/lib/cloud9/Aquarius/exec/driverRTC.py"
var modeSwitchExec = "python /var/lib/cloud9/Aquarius/exec/get_gpio_sw1.py"
//Still not used
var _2SwitchExec = "python /var/lib/cloud9/Aquarius/exec/get_gpio_sw2.py"
var _3SwitchExec = "python /var/lib/cloud9/Aquarius/exec/get_gpio_sw3.py"
var _4SwitchExec = "python /var/lib/cloud9/Aquarius/exec/get_gpio_sw4.py"

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

//////////////////////////////////////////////////////////
//Establishing connection to Station database (local DB)    
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'snoopy'
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
    console.log('Connected as id ' + connection.threadId);
    drawSeparator()

    //Calls configuration read from databasehelper, callsback to assignConfigurationValues
    databaseHelper.readConfig(connection, assignConfigurationValues);
}); 

/**
*   Main logic function Upon arriving in this function, all configuration values have been assigned 
*/
function main(){

    drawSeparator()
    //Reset RTC so it does not retrigger or stay at low logic
    console.log("Resetting RTC")
    sh.exec(rtcExecPath + " disablealarm")
    //Get date from the RTC and set it to system date
    console.log("Getting date from RTC")
    sh.exec(rtcExecPath + " getdate")
    
    //Get current system date from output of date command
    var strCurrentSysDate = sh.exec("date").stdout
    //And get a date object from it
    var currentSysDate = Date.parse(strCurrentSysDate)
    //Get a date object from last known date from configuration
    var lastDate = Date.parse(CONFIG_Last_Date)
    
    console.log("Current date : " + strCurrentSysDate)
    console.log("Last date : " + CONFIG_Last_Date)
    
    //If last known date is behind current system date, set last known to current and imply its correct
    if(lastDate < currentSysDate){
        console.log("Last date is being updated to now : " + strCurrentSysDate)
        databaseHelper.setConfig(connection, 'LAST_KNOWN_DATE', strCurrentSysDate, configurationSetCallBack)
        
    }
    //If last known date is after current system date, set current system and rtc date to last known
    else if (lastDate >= currentSysDate){
        console.log("Last date is in the future ? Setting date to last known, please update me")
        var execSetCurrentSysDate = sh.exec('date -s "' + CONFIG_Last_Date + '"')
        var rtcSetDate = sh.exec(rtcExecPath + " setdate")
    }
    
    drawSeparator()
    console.log()
    drawSeparator()    

    //If current mode is HIGH, enter auto mode. Read all sensors, set RTC to wake up and shutdown
    if( CONFIG_Operation_Mode == 1 ) 
    {        
        console.log("Auto mode")
        console.log("Reading new sensor values")
        drawSeparator()
        console.log()
        //Reads all sensors in the data base
        readAllSensorsInDataBase(getSensorReadingCallback)        

        var date = new Date()

        //Creates a date with added minutes from the interval configuration
        drawSeparator()
        console.log("Date without added interval : " + date.toISOString().slice(0, 19).replace('T', ' '))
        date.setMinutes(date.getMinutes() + parseInt(CONFIG_Interval))
        console.log("New date with added interval : " + date.toISOString().slice(0, 19).replace('T', ' '))
        drawSeparator()

        //Setup the alarm on the RTC
        console.log("Setting up rtc to wake up at : " + date.getMinutes())
        var rtcSetAlarm = sh.exec(rtcExecPath + " setalarm -m " + date.getMinutes())
        drawSeparator()
        var rtcSetAlarm = sh.exec(rtcExecPath + " enablealarm")
        drawSeparator()
        
        //Execute a shutdown
        var shutdown = sh.exec("shutdown -h now")
    }
    else
    {
        console.log("Manual mode")    
        readAllSensorsInDataBase(getSensorReadingCallback)
        console.log("Waiting")
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
function assignConfigurationValues(err, rows, fields)
{
    if (err) {
        throw err;
        console.log("Could not read config table")
    }
    console.log("Assigning config data")

    //For each row returned, get value and key name, and use name to assign to good var
    for (index = 0; index < rows.length; ++index){
        currentName = rows[index].Name
        currentValue = rows[index].Value
        
        console.log("Data : "  + currentName + " value : " + currentValue)
        if(currentName == "STATION_ID"){
            console.log("Assigned station id")
            CONFIG_Station_ID = currentValue
        }
        else if(currentName == "READ_INTERVAL"){
            console.log("Assigned read interval")
            CONFIG_Interval = currentValue
        }
        else if(currentName == "SEND_ADDRESS"){
            console.log("Assigned send address")
            CONFIG_Cloudia_Address = currentValue
        }
        else if(currentName == "LAST_KNOWN_DATE"){
            console.log("Assigned last known date")
            CONFIG_Last_Date = currentValue
        }
        else if(currentName == "NUMBER_RETRYS"){
            console.log("Assigned retry attempts")
            CONFIG_Number_Retries = currentValue
        }
    }

    //Get current mode of operation
    var currentMode = sh.exec(modeSwitchExec).stdout
    console.log("Switch is  : " + currentMode)

    if(currentMode == "HIGH"){
        CONFIG_Operation_Mode = 1
        console.log("Operation mode is  : AUTO")
    }
    else {
        CONFIG_Operation_Mode = 0
        console.log("Operation mode is  : MANUAL")
    }

    main()
}



/**
 * 
 */
function configurationSetCallBack(err, result){
    console.log("Configuration result : " + result)
}

/**
*
*/
function t_Data_insertCallBack(err, result){
    console.log("Insert result : " + result)
}

/**
*   @brief Callback to getting all sensors from database. It will read all sensors returned and save into the database all
*   measures taken
*   @param err
*   @param rows
*   @param fields
*/
function getSensorReadingCallback(err, rows, fields){
    if (err) {
        throw err;
        console.log("Could not read sensors table")
    }
    console.log("Reading and adding data")

    alreadyDone = []

    for (index = 0; index < rows.length; ++index) {
        var Driver = rows[index].Driver
        var Address = rows[index].UnitAddress
        var UnitName = rows[index].UnitName
        var CloudiaID = rows[index].CloudiaID

        if(alreadyDone.indexOf(CloudiaID) == -1)
        {
            console.log("Reading : " + UnitName)
            alreadyDone[alreadyDone.length] = CloudiaID
            
            var result = sh.exec(Driver + " " + Address + " R")
            /////////////////////////////////////
            console.log(Driver + " " + Address + " R")
            /////////////////////////////////////
            var splittedStdOutput = result.stdout.split(';')
            
            
            console.log("Executed : " + splittedStdOutput)

            for(i = 0; i < rows.length; ++i){
                if(rows[i].CloudiaID == CloudiaID){

                    if(splittedStdOutput.length > rows[i].Position)
                    {
                        var value = splittedStdOutput[rows[i].Position]
                        console.log("Inserting into database value : " + value + rows[i].MeasureUnit)
                        databaseHelper.setData(connection, value, rows[i].UnitID, 0,  t_Data_insertCallBack)
                    }
                    else
                    {
                        console.log("Missing data")
                    }
                }
            }    
        }
    }
    
    finishedReadingSensors()
}



/**
*   @brief Function that read
*/
function readAllSensorsInDataBase(callback)
{
    databaseHelper.getSensors(connection, callback)
}

/**
*
*/
function sendConfigToWeb(err, rows, fields){
    if (err) {
        throw err;
        console.log("Could not read config table")
    }
    socket.emit('ReceiveConfig', {'row' : rows})
}

/**
*
*/
function drawSeparator(){
    console.log("///////////////////////////////////////////")
}

function finishedReadingSensors()
{
    if( CONFIG_Operation_Mode == 1 ) 
    {
        var date = new Date()

        //Creates a date with added minutes from the interval configuration
        drawSeparator()
        console.log("Date without added interval : " + date.toISOString().slice(0, 19).replace('T', ' '))
        date.setMinutes(date.getMinutes() + parseInt(CONFIG_Interval))
        console.log("New date with added interval : " + date.toISOString().slice(0, 19).replace('T', ' '))
        drawSeparator()

        //Setup the alarm on the RTC
        console.log("Setting up rtc to wake up at : " + date.getMinutes())
        var rtcSetAlarm = sh.exec(rtcExecPath + " setalarm -m " + date.getMinutes())
        drawSeparator()
        var rtcSetAlarm = sh.exec(rtcExecPath + " enablealarm")
        drawSeparator()
        
        //Execute a shutdown
        var shutdown = sh.exec("shutdown -h now")
    }
    else
    {
        console.log("Reading sensor finished")
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
    console.log('User Connected');
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
app.get('*', function(req, res){
   res.sendfile(__dirname + '/404.html')
})
//////////////////////////////////////////////////////////////
// Manage any Socket.io Event

//On connection to the client send the most recent data from the DB
//Send  
app.io.on('connection',function(socket){
    socket.on('RequestConfig',function(){
        console.log("Requested configuration")
        databaseHelper.readConfigAndEmit(connection, socket)
        
    })
    socket.on('UpdateConfig', function(data){
        console.log("Requested an update to configuration")
        databaseHelper.setConfig(connection, data.Name, data.Value, configurationSetCallBack)
    })
    socket.on('RequestNewMeasure', function(data){
        console.log("Requested a new measure on XX sensor")

    })
})

//Receive update Command
app.io.on('connection',function(socket){
    socket.on('configInterval',function(data){
       var interval = data.interval;
       console.log("Interval = " + interval)
    });
    socket.on('updateTemp',function(){
        var randomnumber=(Math.random()*41.1)
        socket.emit('lastTemp',{'value':randomnumber});
    });
    socket.on('updatePh',function(){
        var randomnumber=(Math.random()*13.99)
        socket.emit('lastPh',{'value':randomnumber});
    });
    socket.on('updateDo',function(){
        var randomnumber=(Math.random()*12.99)
        socket.emit('lastDo',{'value':randomnumber});
    });
    socket.on('updateCond',function(){
        var randomnumber=(Math.random()*20000)
        socket.emit('lastCond',{'value':randomnumber});
    });
    socket.on('updateStationTemp',function(){
        var randomnumber=(Math.random()*41.1)
        socket.emit('lastStationTemp',{'value':randomnumber});
    });
    socket.on('updateStationHum',function(){
        var randomnumber=(Math.random()*100)
        socket.emit('lastStationHum',{'value':randomnumber});
    });
});

//Send from database Functions
function sendTempFromDB(rowCount,socket){
   
    console.log("DEPRECATED")

    connection.query('SELECT date AS DateReading, water_temp AS TempWater FROM `sensorData` ORDER BY date DESC LIMIT 10;',
        function(err, rows, fields){
            if(err) throw err;
                //send temperature reading out to connected clients
                socket.emit('tempData', {'array': rows});
        });
}