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
 * @version 3.0 : May 12, 2015 First completely functional milestone
 *
 * Hardware:
 *      Board Aquarius
 *      BeagleBone Black (Rev.C recommended)
 */

var express = require('express.io'); //Express and Socket.io integration
var mysql = require('mysql'); //Javascript mySql Connector
var exec = require('child_process').exec;
var fs = require('fs');         //File system manipluation for the watchdog
var sh = require('execSync'); //Permits the execution of external applications synchronously
var http = require('http');

var aquariusTools = require('./aquariusToolKit') //External file that helps the connection and querying to the database

//Execution path for the RTC driver and Switches and Watchdog feeder
var rtcExecPath = "python /var/lib/cloud9/Aquarius/exec/driverRTC.py";
var modeSwitchExec = "python /var/lib/cloud9/Aquarius/exec/get_gpio_sw1.py";

//Path to execute LED flashing or keep open
var flashLED = 'python /var/lib/cloud9/Aquarius/exec/flash_led.py';
var keepLED = 'python /var/lib/cloud9/Aquarius/exec/open_led.py'

//Still not used
var _2SwitchExec = "python /var/lib/cloud9/Aquarius/exec/get_gpio_sw2.py";
var _3SwitchExec = "python /var/lib/cloud9/Aquarius/exec/get_gpio_sw3.py";
var _4SwitchExec = "python /var/lib/cloud9/Aquarius/exec/get_gpio_sw4.py";

var oneWireScript = "ls /sys/devices/w1_bus_master1 | grep 28-"

//Var to keep up with the watchdog file
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

var CONFIG_dont_reboot = 1;

var CONFIG_APN = null;

//Vars used to count data sent to ClouDIA
var DataSent_Count = 0;
//Number of sensors
var Sensors_Count = null
//Number of sensors that have been read
var Sensors_Done = null

var led_Process = null;

/**
* @brief Establishing connection object to Station database (local DB)   
*        with parameters
*/
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'snoopy'
});


 /**
  * @brief Create a connection to the database
  * @details Creates a connection to the database. In the callback function
  *          error checking is done and a call to read configuration values is done
  * 
  * @param  callback function that occurs after the creation of the connection
  * @return null
  */
connection.connect(function(err){
    /**
     *   @brief Async function called upon creation of the connection
     */
    if (err) {
        console.error('Error connecting: ' + err.stack);
        return;
    }

    drawSeparator();
    log('Connected as id ' + connection.threadId, 2);
    drawSeparator();

    //Calls configuration read from aquariusTools, callsback to assignConfigurationValues
    aquariusTools.init(connection);
    aquariusTools.readConfig(connection, assignConfigurationValues);
});

 /**
  * @brief Selects the main logic of the service
  * @details Main logic function Upon arriving in this function, all configuration values have been assigned
  * @details Will select the sequence of operation with CONFIG data
  * @return null
  */
function autoMode(){      
    led_Process = exec(flashLED, function(){});
    //If current mode is to shutdown at the end of sensor reading
    if(CONFIG_dont_reboot == 0){
        fileWatch = watchdog();
        fs.writeSync(fileWatch, "\n");
    }
    
    sh.exec("sh /var/lib/cloud9/Aquarius/exec/close_usr_led.sh");
    
    writeToWatchDog(fileWatch);
    log("Auto mode", 2);
    log("Reading new sensor values", 2);
    drawSeparator();
    writeToWatchDog(fileWatch);
    //Reads all sensors in the data base
    readAllSensorsInDataBase(getSensorReadingCallback);
}

/**
 * @brief Updates dates on all devices in the system
 * @details Using the current operation mode, the system update the RTC, system date and database last known date
 * @return null
 */
function updateDates(){
    
    drawSeparator();
    
    if(CONFIG_dont_reboot == 0){
        //Get current system date
        var strCurrentSysDate = sh.exec("date").stdout;
        var currentSysDate = Date.parse(strCurrentSysDate);
        
        //Get date from the RTC and set it to system date
        log("Getting date from RTC", 3)
        sh.exec(rtcExecPath + " getdate")
    
        //Get current system date from output of date command
        var strCurrentRtcDate = sh.exec("date").stdout
        //And get a date object from it
        var currentRtcDate = Date.parse(strCurrentRtcDate)
        
        //Get a date object from last known date from configuration
        var lastDate = Date.parse(CONFIG_Last_Date)
    
        log("Current Rtc date : " + strCurrentRtcDate, 2);
        log("Current Sys date : " + strCurrentSysDate, 2);
        log("Last known date : " + CONFIG_Last_Date, 2);
        
        if(currentSysDate >= lastDate && currentSysDate >= currentRtcDate){
            //Current system date is more up to date
            log("System date is more up to date", 2);
            setDatesOnDevices(strCurrentSysDate);
        }
        if(lastDate >= currentSysDate && lastDate >= currentRtcDate){
            //Current database date is more up to date"
            log("Last database date is more up to date", 2);
            setDatesOnDevices(CONFIG_Last_Date);
        }
        if(currentRtcDate >= currentSysDate && currentRtcDate >= lastDate){
            //Current RTC date is more up to date
            log("RTC date is more up to date", 2);
            setDatesOnDevices(strCurrentRtcDate);
        }
    }
    if(CONFIG_dont_reboot == 1){
        //Get current system date
        var strCurrentSysDate = sh.exec("date").stdout;
        var currentSysDate = Date.parse(strCurrentSysDate);
        
        //Get a date object from last known date from configuration
        var lastDate = Date.parse(CONFIG_Last_Date);
    
        log("Current Sys date : " + strCurrentSysDate, 2);
        log("Last known date : " + CONFIG_Last_Date, 2);
        
        if(currentSysDate >= lastDate){
            //Current system date is more up to date
            log("System date is more up to date", 2);
            setDatesOnDevices(strCurrentSysDate);
        }
        if(lastDate >= currentSysDate){
            //Current database date is more up to date"
            log("Last database date is more up to date", 2);
            setDatesOnDevices(CONFIG_Last_Date);
        }
    }
    drawSeparator();
}

/**
 * @brief Updates device time
 * @details Executes scripts to update device times
 * 
 * @param  Date to set on devices
 * @return null
 */
function setDatesOnDevices(dateToUse){
        
    var execSetCurrentSysDate = sh.exec('date -s "' + dateToUse + '"');
    if(CONFIG_dont_reboot == 0)
        var rtcSetDate = sh.exec(rtcExecPath + " setdate");
    aquariusTools.setConfig(connection, 'LAST_KNOWN_DATE', dateToUse, configurationSetCallBack);
    
}

/**
 *  @brief Callback from selecting all config values in the database
 *  @param err Errors relative to fetching the data
 *  @param rows All rows returned from the database
 *  @param fields All fileds returned from the query
 *  Calls autoMode at the end to continue execution of the station
 */
function assignConfigurationValues(err, rows, fields){
    if (err){
        throw err;
        log("Could not read config table", 1)
    }
    log("Assigning config data", 2)

    CONFIG_Log_File_Directory = '/var/lib/cloud9/Aquarius/';

    //For each row returned, get value and key name, and use name to assign to good var
    for (index = 0; index < rows.length; ++index){
        currentName = rows[index].Name;
        currentValue = rows[index].Value;

        log("Data : " + currentName + " value : " + currentValue, 3)
        if (currentName == "STATION_ID") {
            log("Assigned station id", 3);
            CONFIG_Station_ID = currentValue;
        }
        else if (currentName == "READ_INTERVAL") {
            log("Assigned read interval", 3);
            CONFIG_Interval = currentValue;
        }
        else if (currentName == "SEND_ADDRESS") {
            log("Assigned send address", 3);
            CONFIG_Cloudia_Address = currentValue;
        }
        else if (currentName == "LAST_KNOWN_DATE") {
            log("Assigned last known date", 3);
            CONFIG_Last_Date = currentValue;
        }
        else if (currentName == "NUMBER_RETRIES") {
            log("Assigned retry attempts", 3);
            CONFIG_Number_Retries = currentValue;
        }
        else if (currentName == "DEBUG_LEVEL") {
            log("Assigned debug level", 3);
            CONFIG_Verbose_Level = currentValue;
        }
        else if ( currentName == "SENSOR_UNIT"){
            log("Assigned SensorUnit ID", 3);
            CONFIG_Sensor_unit = currentValue;
        }
        else if ( currentName == "OW_DRIVER_WATER_COMP"){
            log("Assigned temperature compensation", 3);
            CONFIG_Temperature_Compensation = currentValue;
        }
        else if ( currentName == "PPP_APN"){
            log("Assigned PPP carrier setting", 3);
            CONFIG_APN = currentValue
        }
    }
    
    //Reset RTC so it does not retrigger or stay at low logic
    log("Resetting RTC", 3)
    sh.exec(rtcExecPath + " disablealarm")

    //Get current mode of operation
    var currentMode = sh.exec(modeSwitchExec).stdout;
    log("Switch is  : " + currentMode, 2);

    //Set current operation mode with switch state
    if (currentMode.indexOf("HIGH") > -1) {
        CONFIG_Operation_Mode = 1;
        log("Operation mode is  : AUTO", 2);
    }
    else {
        CONFIG_Operation_Mode = 0;
        log("Operation mode is  : MANUAL", 2);
    }
    
    updateDates();

    aquariusTools.SetDS18B20Address(connection, sh.exec(oneWireScript).stdout, function(err, results){
        //Select what mode to go in
        if(CONFIG_dont_reboot && CONFIG_Operation_Mode){
            log("Auto mode with no reboot", 2);
            
            if(CONFIG_Interval !== null){
                autoMode();
                setInterval( autoMode , 60000 * CONFIG_Interval );
            }
            else{
                autoMode();
                setInterval( autoMode , 300000 );
            }
        }
        else{
            exec(keepLED, function(){});
            completeOperations();
        }

    });  
}

/**
 * @brief Callback for configuration setting
 * @details Prints a configuration setting result to the log file
 * 
 * @param err Error code
 * @param result Result of configuration
 * 
 * @return Null
 */
function configurationSetCallBack(err, result) {
    log("Configuration result : " + result, 2)
}

/**
 * @brief Callback for data insertion
 * @details Prints a data insertion result to the log file then increments
 *          the number of sensor data inserted in the database
 *          and if the number matches or is higher than the number
 *          of sensors to do, calls finished reading sensors
 * 
 * @param err Error code
 * @param result Result of insertion
 * 
 * @return Null
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
    log("Reading and adding data", 2)
    writeToWatchDog(fileWatch)
    alreadyDone = []

    Sensors_Count = rows.length
    Sensors_Done = 0
    
    var temperatureCompensation = null;
    
    
    for (index = 0; index < rows.length; ++index) {
       
        writeToWatchDog(fileWatch)
        var Driver = rows[index].Driver
        var Address = rows[index].PhysicalAddress
        var UnitName = rows[index].UnitName
        var PhysicalID = rows[index].PhysicalID

        if (alreadyDone.indexOf(PhysicalID) == -1) {
            log("Reading : " + UnitName, 2)
            alreadyDone[alreadyDone.length] = PhysicalID
            /***
            * Start init of exceptions
            ****/            
            if(Driver.indexOf("SIM908") > -1){
                //stopPPPD()
                aquariusTools.StartSIM908();
                aquariusTools.StartGPS();
            }
            /****
            * Stop init of exceptions
            *****/
            var tryCount = 0;
            var splittedStdOutput;
            var result;
            var execution;
            //Try executing the sensor drivers to read
            do{
                //If temperature compensation is set, read sensor with temperature compensation
                if (temperatureCompensation !== null && Driver.indexOf("AtlasI2C") > -1){
                    execution= Driver + " " + Address + " R:-t:" + temperatureCompensation;
                }
                else{
                    execution = Driver + " " + Address + " R";                
                }
                //Execute the driver
                result = sh.exec(execution);                
                log(execution, 3);
                //Increment the try count
                tryCount++;
                log("Try counts :" + tryCount, 2);
            }while(result.stdout.indexOf("ERROR") > -1 && tryCount <= parseInt(CONFIG_Number_Retries));

            splittedStdOutput = result.stdout.split(';');
            log("Executed : " + splittedStdOutput, 2);
    
            /***
            * Start after execution exceptions
            ****/ 
            
            //Sleep the atlas device
            if(Driver.indexOf("AtlasI2C") > -1){
                sh.exec(Driver + " " + Address + " Sleep");
            }
            //Set temperature compensation 
            if(Driver.indexOf("OneWire") > -1 && splittedStdOutput.length > 5){
                temperatureCompensation = splittedStdOutput[5].trim();
            }
            //Stop SIM908 device
            if(Driver.indexOf("SIM908") > -1){
                aquariusTools.StopSIM908();
            }           
            /****
            * Stop after execution exceptions
            *****/

            //For each virtual sensor
            for (i = 0; i < rows.length; ++i) {
                writeToWatchDog(fileWatch)
                
                //If the physical_id of the virtual_driver is the same as the current physical_id
                if (rows[i].PhysicalID == PhysicalID) {
                    
                    //Check if the seached data is at its position
                    if (splittedStdOutput.length > rows[i].Position) {                      
                        var value;
                        //If the precision is not set as 0, round to precision
                        if(rows[i].ValuePrecision == 0){
                            value = splittedStdOutput[rows[i].Position];
                        }
                        else{
                            value = splittedStdOutput[rows[i].Position];
                            value = roundToX(Number(value), rows[i].ValuePrecision);
                            
                        }
                        log("Inserting into database value : " + value + " " + rows[i].MeasureUnit, 2);
                        //Set data in the database
                        aquariusTools.setData(connection, value, rows[i].VirtualID, 0, t_Data_insertCallBack);  
                    }
                    //If data is not present in the frame from the driver, set as a missing data
                    else {
                        log("Missing data : " + UnitName, 1)
                        Sensors_Done++
                        //If all sensor are finished, call finishedReadingSensors 
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
 * @brief Round a number to x precision
 * @details Rounds a number to a precision of X decimals
 * 
 * @param num Number to round   
 * @param x Precision to round the number   
 * @return the number rounded
 */
function roundToX(num, x) {
    console.log("Number to  round : " + num + " at x : " + x)
    return +(Math.round(num + "e+" + x)  + "e-" + x);
}


/**
 *   @brief Function that will call get sensors with the callback
 *   given in parameter
 *   @param callback Function to callback after getting all sensors
 */
function readAllSensorsInDataBase(callback) {
    writeToWatchDog(fileWatch)
    aquariusTools.getSensors(connection, callback)
}

/**
 * @brief Function that gets all sensor data not sent
 * @details Calls a query to get all sensor data not sent to the servers
 * 
 * @param  callback Callback function once finished
 * @return null
 */
function readDataFromSensorsNotSent(callback) {
    writeToWatchDog(fileWatch)
    aquariusTools.getDataForSensorsNotSent(connection, callback)
}

/**
 * @brief Send configuration retrieved from the station
 * @details Sends to a socket the configuration 
 * 
 * @param err error var
 * @param rows rows returned from the query
 * @param fields fields in the query
 * @return null
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
 * @brief Draws a separator in the interface
 * @details [long description]
 * @return [description]
 */
function drawSeparator() {
    console.log("///////////////////////////////////////////")
}


/**
 * @brief Called when sensors are finished being read
 */
function finishedReadingSensors() {
    writeToWatchDog(fileWatch)   
    readDataFromSensorsNotSent(createJSONfromDatabase)
}

/**
 * @brief Create JSON from query
 * @details Creates a JSON structured file and sends it to Dweet and ClouDIA
 * 
 * @param err
 * @param rows Rows from the query
 * @param fields Fields in the query
 */
function createJSONfromDatabase(err, rows, fields) {
    if (err) {
        throw err;
        console.log("Could not get Sensors Info", 1)
    }
    else
    {
        writeToWatchDog(fileWatch)
        //JSON Formatter
        var t = new Date()
        var stationID = CONFIG_Station_ID
        
        //Create the base JSON message
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
        
        //Base event in which each sensor unit will be put
        var event = { 'sensorunit' : CONFIG_Sensor_unit, 'data': [] }
        var PhysicalID;
        var ids = []
        for (var i = 0; i < rows.length; i++)
        {
            writeToWatchDog(fileWatch);
            // Get current SensorUnitID (Physical sensor)
            PhysicalID = rows[i].PhysicalID;
            ids.push(rows[i].ID);
            log("JSON creation at : " + PhysicalID, 3);
            // If the last sensorunitID is not the same as the current one
            
            //Assign all vars
            var sensorsubunitid = rows[i].CloudiaSubUnitID;
            var value =rows[i].ReadValue;
            var measureunit = rows[i].UnitType;
            var datetime = rows[i].ReadDate;
            var physicalname = rows[i].PhysicalName;         
            
            //Put data in an object
            var JSON_sensorData = {'id': sensorsubunitid, 'physicalname': physicalname, 'measureunit' : measureunit, 'valuetype':"asis", 'value': value, 'datetime':datetime.toISOString().slice(0, 19).replace('T', ' ')};
            log("JSON Sensor Data : " + JSON_sensorData, 3)
            
            //Push the data object into the event.data array
            event.data.push(JSON_sensorData);
        }
        //Puts the event in the station message
        JSONsession.stationmessage.event.push(event);
        var message = JSON.stringify(JSONsession);
        log(message, 3);        
        
        //For test purposes, JSON known to work
        //message = '{"stationmessage":{"datetime":"2015-04-15 11:59:23","stationid":"bra003","eventtype":"regularreading","event":[{"sensorunit":"su0008","data":[{"id":"01","datetime":"2015-04-15 11:55:15","valuetype":"asis","value":"8.65"}]}]}}'
        //JSONsession = JSON.parse(message)
        
        //Check if eth0 internet is available
        if(sh.exec("ip addr | grep eth0").stdout.indexOf("DOWN") == -1){
            log("Ethernet is available, sending data",2);
            
            aquariusTools.sendPostFile(JSONsession, "https://dweet.io:443/dweet/for/", "Aquarius", setIDsAsSent, ids);
            aquariusTools.sendPost(message, CONFIG_Cloudia_Address, setIDsAsSent, ids);
        }
        //Else try PPP connection through SIM908
        /*
        else if(CONFIG_APN !== null){
            log("Trying PPP connection setup", 2);
            aquariusTools.StartSIM908();
            exec(CONFIG_APN, function (error, stdout, stderr) {});
        
            setTimeout(function(){
                var testPPP = sh.exec("ifconfig | grep ppp0");
                
                if(testPPP.stdout.indexOf("ppp") > -1){
                    log("PPP connection successful", 2);
                    
                    aquariusTools.sendPostFile(JSONsession, "https://dweet.io:443/dweet/for/", "Aquarius", setIDsAsSent, ids);
                    aquariusTools.sendPost(message, CONFIG_Cloudia_Address, setIDsAsSent, ids);
                }
                else{
                    log("Could not create ppp connection", 2);
                    stopPPPD();
                    aquariusTools.StopSIM908();
                    completeOperations();
                }
            }, 10000);
        }
        */
        else if(CONFIG_APN !== null){
            log("Creating connection with SIM908", 2)   
            aquariusTools.StopSIM908();
            aquariusTools.StartSIM908();
            aquariusTools.SendPostSerial(CONFIG_Cloudia_Address, CONFIG_APN, "/var/lib/cloud9/Aquarius/data.json", message, setIDsAsSent, ids);
        }
        else
        {
            log("Could not create connection", 2);
            completeOperations();
        }
    }
}

/**
 * @brief Sets the furnished IDs as sent in  the database
 * @details With the furnished IDs, set them all as sent in the database
 * 
 * @param  List of Ids to be set as sent in the database
 * @return null
 */
function setIDsAsSent(ids){
    writeToWatchDog(fileWatch);
    if(ids !== null){
        log("Count of ids : " + ids.length, 2);
        var idToSet = 0;
        for(var s = 0; s < ids.length; s++)
        {
            writeToWatchDog(fileWatch)
            aquariusTools.setDataAsSent(connection, ids[s], function(err, result){
                log("Set as sent : " + result, 2);
                idToSet++;
                if(idToSet >= ids.length)
                {
                    countDataSent();
                }
            });
        }
    }
    else{
        countDataSent();
    }
}

/**
 * @brief Count data set as sent, to complete operation after finishing
 * @details [long description]
 * @return [description]
 */
function countDataSent(){
    log("Data count for dweet or cloudia", 1);
    DataSent_Count = DataSent_Count + 1;
    log("Data sent count == " + DataSent_Count, 1);
    if(DataSent_Count > 1){
        DataSent_Count = 0;
        completeOperations();
    }
}

/**
 * @brief Callback function for setting as set
 * @details 
 * 
 * @param err Error code if error occured
 * @param result Result of the SQL operation
 * 
 * @return null
 */
function idWasSet(err, result){
    
    log("Set as sent : " + result)
}

/**
 * @brief Completes operations of the station, called at the end of an operation mode
 * @details Update dates. If mode is manual, start GPS and start express server. If in automatic mode,
 *          set the alarm and close down. If in auto but no reboot mode, simply log that
 *          he station is waiting for next execution
 * 
 * @return null
 */
function completeOperations()
 {
    
    updateDates();
    if (CONFIG_Operation_Mode == 1 && CONFIG_dont_reboot == 0) {
        //stopPPPD();
        
        var date = new Date()
        aquariusTools.StopSIM908();
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

        //Prepare Data for server ( Format to Json )
        //Execute a shutdown
        writeToWatchDog(fileWatch)
        
        setTimeout(function(){
            setInterval(function() {
                log("Shutting down now ", 0)
                var shutdown = sh.exec("shutdown -h now")
            }, 1000);
        }, 2000);
    }
    else if(CONFIG_Operation_Mode == 1 && CONFIG_dont_reboot == 1){
        log("Waiting for next execution", 2);
        //stopPPPD();
        aquariusTools.StopSIM908();
        if(led_Process !== null)
            led_Process.kill();
    }
    else if(CONFIG_Operation_Mode == 0){
        log("Manual mode", 2);            
        drawSeparator();
        //Prepare Data for server ( Format to Json )
        log("Starting server and GPS for manual operation", 2);
        aquariusTools.StartSIM908();
        aquariusTools.StartGPS();
        startServer();
    }
 }

/**
 * @brief Log to file and stdout
 * @details Outputs to file and stdout the data passed. Function is
 *          called with a level of log, and only logging with a level lower than the current config
 *          value will be outputted
 * 
 * @param dataToAppend Data to output in log
 * @param level Logging level
 * 
 * @return null
 */
function log(dataToAppend, level)
{    
    if(level <= CONFIG_Verbose_Level){
        dataToAppend =  "[" + new Date().toISOString() + "]: " + dataToAppend + "\r";
        console.log(dataToAppend);
        fs.appendFileSync(CONFIG_Log_File_Directory + 'log.txt', dataToAppend);    
    }
}

/**
 * @brief Stops PPPD execution
 * @details Stops PPPD to permit other drivers to operate the SIM908 on the serial line
 * 
 * @return True if PPPD is closed succesfully
 */
function stopPPPD(){
    var getPID = sh.exec("pidof pppd");
    log("Length of stdout : " + getPID.stdout.length + " data : " + getPID.stdout + " :");
    if(getPID.stdout.length > 0){
        sh.exec("kill " + getPID.stdout);
        var getPID2 = sh.exec("pidof pppd");
        if(getPID2.stdout.length > 0){
            return true;
        }
        else{
            return false
        }
    }
    return true;
}

/**
 * @brief Initialize the watchdog file
 * @details Initialize a file descriptor to the watchdog device
 * @return null
 */
function watchdog(){
    return fs.openSync('/dev/watchdog', 'w');
}

/**
 * @brief Writes to watchdog file
 * @details Write to the watchdog file. If the file is initialized, it will 
 *          write to the file and keep the system alive. 
 * 
 * @param fd File descriptor
 * @return null
 */
function writeToWatchDog(fd){
    if(fd !== null && CONFIG_dont_reboot == 0){
        fs.writeSync(fd, "\n");
        log("write to watchdog", 1);
    }
}

/**
 * @brief Function that starts the express server for the user web page
 * @details 
 * @return null
 */
function startServer(){
    log("STARTING WEB SERVER", 2);
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
    });
    // Send the client html.
    app.get('/', function(req, res) {
        res.sendfile(__dirname + '/index.html');
    });
    app.get('/index.html', function(req, res) {
        res.sendfile(__dirname + '/index.html');
    });
    app.get('/form.html', function(req, res) {
        res.sendfile(__dirname + '/form.html');
    });
    app.get('/chart.html', function(req, res) {
        res.sendfile(__dirname + '/chart.html');
    });
    app.all('/export.csv', function(req, res){
        res.download(__dirname + '/export.csv');
    });
    //The 404 Route (ALWAYS Keep this as the last route)
    app.get('*', function(req, res) {
        res.sendfile(__dirname + '/404.html');
    });
    //////////////////////////////////////////////////////////////
    // Manage any Socket.io Event
    
    //On connection to the client send data required to generate interface
    app.io.on('connection', function(socket) {
        socket.on('ready', function() {
            log("Requested sensors", 2)
            aquariusTools.getSensorsAndEmit(connection, socket)
        });
    });
    
    //On connection to the client send the most recent data from the DB
    //Send  
    app.io.on('connection', function(socket) {
        socket.on('RequestConfig', function() {
            log("Requested configuration", 2)
            aquariusTools.readConfigAndEmit(connection, socket)
        })
        socket.on('UpdateConfig', function(data) {
            log("Requested an update to configuration", 2)
            aquariusTools.setConfig(connection, data.Name, data.Value, configurationSetCallBack)
        })
        socket.on('RequestNewMeasure', function(data) {
            log("Requested a new measure on XX sensor", 2)
    
        })
    })
    
    //Receive update Command
    app.io.on('connection', function(socket) {
        
        //On the reception of the config interval
        socket.on('configInterval', function(data) {
            var interval = data.interval;
            log("Interval = " + interval, 2)
        });
        
        socket.on('requestInitData', function(Data) {
           var sensorId = Data.ID;
           aquariusTools.getDataForASensor(connection,sensorId,Data.QTY,function(err,rows,fields){
               if(err){
                    throw err;
                    log("Could not get sensor for init", 1);
               }
               else{
                    socket.emit('initData', {
                        ID : sensorId,
                        result: rows
                    });
               }
           })
        });
        //When the socket requests a measure with an ID
        socket.on('requestMeasure', function(ID) {
            var sensorId=ID.ID;
            
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
                
                log(result.stdout, 2)
                
                if(result.stdout.indexOf("ERROR") > -1 )
                {
                    var measuredValue = "Error"
                }
                else
                {
                    var splittedStdOutput = result.stdout.split(';')
                    var measuredValue = splittedStdOutput[dataPosition];
                    
                }
                
                log("Page Web requested sensor : " + sensorId + "  Returning result : " + measuredValue , 2);
                socket.emit('updateSensor', {
                    result: measuredValue,
                    ID: sensorId
                });
            })
        });
    });
    
    //Receive Calibrate command
    app.io.on('connection', function(socket) {
        socket.on('calibration', function(data) {
            log("Starting Calibration",1)
            aquariusTools.getASensor(connection,data.Id,function(err,rows,fields){
                //log(rows[0].Driver,1)
                var driverPath = rows[0].Driver;
                var address = rows[0].PhysicalAddress;
                var point = data.Point;
                var value = data.Value;
                var calibrationStatus;
                console.log("Driver : " + driverPath + " addredss : " + address + " point : " + point + " value : "+ value);
                calibrationStatus = aquariusTools.calibrateAtlasSensor(driverPath, address, point, value);
                
                if(calibrationStatus >= 0){
                    log("Calibration Successful",2);
                    
                    socket.emit('calibrationSuccess',{ sensorId : data.Id,
                                                   status : calibrationStatus
                    });
                } 
                else{
                    log("Calibration Failed",2);
                                   
                    socket.emit('calibrationFailure', { sensorId : data.Id,
                                                   status : calibrationStatus
                    });
                }
            }) 
        });
    });
    
    app.io.on('connection', function(socket)
    {
       socket.on('getGPSCoord',function(data){
           aquariusTools.getCoord(connection,data.Qty,function(err,rows,fields){
                var gpsData = [];
                var data = {lat:0,long:0,date:0};
                var i =0;
                
                for(i=0;i<rows.length - 1;i+=2){
                   data.lat = rows[i].Value;
                   data.long = rows[i+1].Value;
                   data.date = rows[i].DateOf;
                   
                   gpsData.push(data);
                }
                log(gpsData,1);
                socket.emit('receiveGPS',{Data:gpsData});
           })
           
       }) ;
    });
    
    //Receive Calibrate command
    app.io.on('connection', function(socket) {
        socket.on('shutdown', function() {
            var execPath="shutdown -h now";
            
            result = sh.exec(execPath)
            if(result.stdout.indexOf("ERROR") > -1 ){
                var answer = "Error";
                log(answer,1);
            }
            else{
            }
           
        });
        
        //On get the status of the mode switch
        socket.on('getSwitchStatus',function(){
            var currentMode = sh.exec(modeSwitchExec).stdout; //High auto; Low manual
            socket.emit('switchStatus',{mode:currentMode})
        });
        
        //When the service is requested to restart
        socket.on('restartService',function()
        {
           var service = sh.exec("systemctl restart aquarius.service").stdout; 
        });
        
        socket.on("exportDatabase", function(){
            var removeOldFile = sh.exec("rm /var/lib/cloud9/Aquarius/node-bootstrap/export.csv");
            aquariusTools.ExportDatabase(connection, function(err, rows, fields){
                var moveFile = sh.exec("mv /tmp/export.csv /var/lib/cloud9/Aquarius/node-bootstrap/");
                socket.emit("downloadNow");
            });
        });


        //On the system asking system information
        socket.on('sysInfo', function() {
            //Execute system querys with grep to get wanted information
            var execPathTemp="cat /sys/class/hwmon/hwmon0/device/temp1_input | sed 's/...$//'";
            var execPathIpUsb = "ifconfig usb0 | grep 'inet addr:' | cut -d: -f2 | awk '{ print $1}'";
            var execPathIpEth = "ifconfig eth0 | grep 'inet addr:' | cut -d: -f2 | awk '{ print $1}'";
            var execPathIpWlan = "ifconfig wlan0 | grep 'inet addr:' | cut -d: -f2 | awk '{ print $1}'";
            var execPathMem = "df | grep 'rootfs'"
            
            result = sh.exec(execPathTemp)
            if(result.stdout.indexOf("ERROR") > -1 ){
                var output = "Error";
                log(output,1);
            }
            else{
                var cpuTemp = result.stdout;
            }
            
            result = sh.exec(execPathIpUsb)
            if(result.stdout.indexOf("ERROR") > -1 ){
                var output = "Error";
                log(output,1);
            }
            else{
                var usbIp = result.stdout;
            }
            
            result = sh.exec(execPathIpEth)
            if(result.stdout.indexOf("ERROR") > -1 ){
                var output = "Error";
                log(output,1);
            }
            else{
                var ethIp = result.stdout;
            }
            
                    result = sh.exec(execPathIpWlan)
            if(result.stdout.indexOf("ERROR") > -1 ){
                var output = "Error";
                log(output,1);
            }
            else{
                var wlanIp = result.stdout;
            }
            
            result = sh.exec(execPathMem)
            if(result.stdout.indexOf("ERROR") > -1 ){
                var output = "Error";
                log(output,1);
            }
            else{
                var diskUsed = result.stdout;
            }
            
            //Emit system information
            socket.emit('sysInfoResult', {
                    Temp: cpuTemp,
                    UsbIp: usbIp,
                    EthIp: ethIp,
                    WlanIp: wlanIp,
                    Disk: diskUsed
                })
           
        });
    });
}


