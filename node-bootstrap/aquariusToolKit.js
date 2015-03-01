
/**
 * @file   aquariusToolKit.js
 * @author Jean-Pascal McGee et Jean-Philippe Fournier
 * @date   6 Feb 2015
 * @brief  Function file, mainly for MySQL communications.         
 *
 * @version 1.0 : First version with database communication 
 * @version 2.0 : Added new functions reduce code in app.js
 *
 * Hardware:
 *      Board Aquarius
 *      BeagleBone Black (Rev.C recommended)
 */

var mysql = require('mysql');
var http = require('http');
var fs = require('fs');
var sh = require('execSync'); //Permits the execution of external applications synchronously
var requestModule = require('request')

var net = require('net');
var CONFIG_Verbose_Level = null;

/**
 * @brief Log data in console and log files
 * @details [long description]
 * 
 * @param dataToAppend data to log
 * @param level log level
 * 
 * @return null
 */
function log(dataToAppend, level)
{
    dataToAppend =  "[" + new Date().toISOString() + "]: " + dataToAppend + "\r"
    if(level <= CONFIG_Verbose_Level){
        console.log(dataToAppend)
        fs.appendFileSync('/var/lib/cloud9/Aquarius/' + 'logsql.txt', dataToAppend)    
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
    log("Assigning config data", 3)

    //For each row returned, get value and key name, and use name to assign to good var
    for (index = 0; index < rows.length; ++index) {
        currentName = rows[index].Name
        currentValue = rows[index].Value

        log("Data : " + currentName + " value : " + currentValue, 3)
        if (currentName == "DEBUG_LEVEL") {
            log("Assigned debug level", 3)
            CONFIG_Verbose_Level = currentValue
        }
    }
}

/**
 * @brief Read configuration table 
 * @details Reads the configuration table in the database
 * 
 * @param connection Connection to database
 * @param callBackToApp Callback to process received data
 * 
 * @return query information
 */
function readConfigurationTable(connection, callBackToApp) {
    log("Selecting database", 3)
    connection.query('USE `station_aquarius`;')

    log("Querying", 3)
    var query = connection.query('SELECT config_id AS ID, config_key_name AS Name, config_key_value AS Value, config_key_description AS Description FROM `t_Config`;', callBackToApp)

    return query
}

module.exports = {
    
    //Export function readConfigurationTable to module for external use
    readConfig : readConfigurationTable,
    
    /**
     * @brief Init module
     * @details Init aquarius toolkit module functions
     * 
     * @param connection 
     * 
     * @return null
     */
    init : function(connection)
    {
        readConfigurationTable(connection, assignConfigurationValues)
    },

    /**
     * @brief Read configuration and emit data to socket
     * @details Reads configuration parameters in t_Config table and emit to web socket
     * 
     * @param connection Connection to sql database
     * @param socket Socket to 
     * 
     * @return query information
     */
    readConfigAndEmit: function(connection, socket) {
        log("Selecting database", 3)
        connection.query('USE `station_aquarius`;')

        log("Querying", 3)
        var query = connection.query('SELECT config_id AS ID, config_key_name AS Name, config_key_value AS Value, config_key_description AS Description FROM `t_Config`;', function(err, rows, fields) {
            if (err) {
                throw err;
                log("Could not read config table", 1)
            }
            socket.emit('ReceiveConfig', {
                'row': rows
            })
        })

        return query
    },

    /**
     * @brief Set a configuration key to value
     * @details [long description]
     * 
     * @param connection Connection to SQL
     * @param name Name of the key to set
     * @param value Value to set
     * @param callBackToApp Callback function
     * @return Query information
     */
    setConfig: function(connection, name, value, callBackToApp) {
        log("Selecting database", 3)
        connection.query('USE `station_aquarius`;')

        log("Querying", 3)
        sql = 'UPDATE `t_Config` SET `config_key_value` = "' + value + '" WHERE `config_key_name` = "' + name + '";';
        log(sql, 3)
        return connection.query(sql, callBackToApp)
    },

    /**
     * @brief Set a new data in the database
     * @details 
     * 
     * @param connection SQL connection
     * @param value Value to add in database
     * @param unit Virtual sensor
     * @param isSent Set as sent or not
     * @param callBackToApp 
     * @return query information
     */
    setData: function(connection, value, unit, isSent, callBackToApp) {
        log("Selecting database", 3)
        connection.query('USE `station_aquarius`;')

        var date = new Date().toISOString().slice(0, 19).replace('T', ' '); //Converts JS Date format to MySql Format

        log("Inserting", 3)
        sql = 'INSERT INTO `t_Data` ( data_value, data_t_virtual, data_date, data_is_sent ) VALUES ("' + value + '", "' + unit + '", "' + date + '", "' + isSent + '");'
        log(sql, 3)
        return connection.query(sql, callBackToApp)
    },

    /**
     * @brief Get all sensors in the database
     * @details 
     * 
     * @param connection Connection to mysql
     * @param callBackToApp 
     * 
     * @return Query information
     */
    getSensors: function(connection, callBackToApp) {
        log("Selecting database", 3)
        connection.query('USE `station_aquarius`;')

        sql = 'SELECT t_VirtualSensor.virtual_id AS VirtualID, ' + 
                't_Types.types_name AS TypeName, ' + 
                't_Types.types_driver AS Driver, ' + 
                't_PhysicalSensor.physical_address AS PhysicalAddress, ' + 
                't_PhysicalSensor.physical_name AS UnitName, ' + 
                't_PhysicalSensor.physical_id AS PhysicalID, ' +
                't_VirtualSensor.cloudia_id AS CloudiaSensorID, ' + 
                't_VirtualSensor.virtual_measure_unit AS MeasureUnit, ' + 
                't_VirtualSensor.virtual_driver_pos AS Position, ' + 
                't_VirtualSensor.virtual_precision AS ValuePrecision ' + 
                'FROM `t_VirtualSensor`, `t_Types`, `t_PhysicalSensor` ' + 
                'WHERE t_PhysicalSensor.physical_t_type = t_Types.types_id ' + 
                'and t_VirtualSensor.virtual_t_physical = t_PhysicalSensor.physical_id ' +
                'and t_VirtualSensor.virtual_on = 1 ' +
                'ORDER BY t_VirtualSensor.cloudia_id;'
        log(sql, 3)
        return connection.query(sql, callBackToApp)
    },
    
    /**
     * @brief Get only one sensor   
     * @details 
     * 
     * @param connection Get a connection
     * @param physicalid The physical ID of the sensor wanted   
     * @param callBackToApp 
     * @return Query information
     */
    getASensor: function(connection,physicalId,callBackToApp){
        log("Selecting database", 3)
        connection.query('USE `station_aquarius`;')

        sql = 'SELECT t_VirtualSensor.virtual_id AS VirtualID, ' + 
                't_Types.types_name AS TypeName, ' + 
                't_Types.types_driver AS Driver, ' + 
                't_PhysicalSensor.physical_address AS PhysicalAddress, ' + 
                't_PhysicalSensor.physical_name AS UnitName, ' + 
                't_VirtualSensor.cloudia_id AS CloudiaSensorID, ' + 
                't_VirtualSensor.virtual_measure_unit AS MeasureUnit, ' + 
                't_VirtualSensor.virtual_driver_pos AS Position, ' + 
                't_VirtualSensor.virtual_precision AS ValuePrecision ' +
                'FROM `t_VirtualSensor`, `t_Types`, `t_PhysicalSensor` ' + 
                'WHERE t_PhysicalSensor.physical_id = ' + physicalId + ' ' + 
                'and t_PhysicalSensor.physical_t_type = t_Types.types_id ' +
                'and t_VirtualSensor.virtual_t_physical = t_PhysicalSensor.physical_id ' + 
                'ORDER BY t_VirtualSensor.cloudia_id, t_VirtualSensor.cloudia_id;'
        log(sql, 3)
        return connection.query(sql, callBackToApp)  
    },
    
    /**
     * @brief Get sensors and emit them to socket
     * @details 
     * 
     * @param connection MySQL connection
     * @param socket Socket to emit
     * @param callBackToApp
     * @return Query information
     */
    getSensorsAndEmit: function(connection,socket, callBackToApp) {
        log("Selecting database", 3)
        connection.query('USE `station_aquarius`;')

        sql = 'SELECT t_VirtualSensor.virtual_id AS VirtualID, ' + 
                't_Types.types_name AS TypeName, ' + 
                't_Types.types_driver AS Driver, ' + 
                't_PhysicalSensor.physical_address AS PhysicalAddress, ' + 
                't_PhysicalSensor.physical_name AS UnitName, ' + 
                't_VirtualSensor.cloudia_id AS CloudiaSensorID, ' + 
                't_VirtualSensor.virtual_measure_unit AS MeasureUnit, ' + 
                't_VirtualSensor.virtual_driver_pos AS Position, ' + 
                't_VirtualSensor.virtual_precision AS ValuePrecision, ' +
                't_VirtualSensor.virtual_min AS Min, ' +
                't_VirtualSensor.virtual_max AS Max, ' +
                't_VirtualSensor.virtual_color As Color ' + 
                'FROM `t_VirtualSensor`, `t_Types`, `t_PhysicalSensor` ' + 
                'WHERE t_PhysicalSensor.physical_t_type = t_Types.types_id ' + 
                'and t_VirtualSensor.virtual_t_physical = t_PhysicalSensor.physical_id ' +
                'and t_VirtualSensor.virtual_on = 1 ' + 
                'ORDER BY t_VirtualSensor.cloudia_id;'
        log(sql, 3)
        var query = connection.query(sql, function(err, rows, fields) {
            if (err) {
                throw err;
                log("Could not read sensors table", 1)
            }
            socket.emit('ReceiveSensors', {
                'row': rows
            })
        })

        return query
    },

    /**
     * @brief  Get data of the non sent sensor data
     * @details 
     * 
     * @param connection MySQL connection   
     * @param callBackToApp 
     * 
     * @return Query information
     */
    getDataForSensorsNotSent: function(connection, callBackToApp) {
        log("Selecting database", 3)
        connection.query('USE `station_aquarius`;')

        sql = 'SELECT t_Data.data_value AS ReadValue, ' +
        't_Data.idt_Data AS ID, ' +
        't_Data.data_date AS ReadDate, ' +
        't_VirtualSensor.cloudia_id AS CloudiaSubUnitID, ' +
        't_PhysicalSensor.physical_id AS PhysicalID, ' +
        't_PhysicalSensor.physical_name AS PhysicalName, ' +
        't_VirtualSensor.virtual_measure_unit AS UnitType ' +
        'FROM t_Data, t_VirtualSensor, t_PhysicalSensor ' +
        'WHERE t_Data.data_t_virtual = t_VirtualSensor.virtual_id ' +
        'and t_VirtualSensor.virtual_t_physical = t_PhysicalSensor.physical_id ' +
        'and t_Data.data_is_sent = 0 ' +
        'ORDER BY t_VirtualSensor.cloudia_id, t_Data.data_date, t_VirtualSensor.cloudia_id ' + 
        'LIMIT 40;'
        log(sql, 3)
        return connection.query(sql, callBackToApp)
    },
    
    /**
     * @brief Get coordinates
     * @details 
     * 
     * @param connection MySQL connection
     * @param qty Quantity of coordinates to get
     * @param callBackToApp 
     * @return null
     */
    getCoord:function(connection,qty,callBackToApp){
      connection.query('USE `station_aquarius`;')
            var sql = 'SELECT t_Data.data_value AS Value, ' + 
                    't_Data.data_t_virtual as ID, ' + 
                    't_Data.data_date as DateOf ' +
                    'FROM `t_Data`' + 
                    'WHERE t_Data.data_t_virtual = 12 ' + 
                    'or t_Data.data_t_virtual = 13 ' + 
                    'ORDER BY t_Data.idt_Data LIMIT '+ qty +';';
            connection.query(sql,callBackToApp);
    },
    

    /**
     * @brief Sets a data as sent in the database
     * @details Sets a data for ID as sent in the database  
     * 
     * @param connection MySQL connection   
     * @param id ID to set as sent
     * @param callback 
     * @return Query information
     */
    setDataAsSent : function (connection, id, callback){
        log("Selecting database", 3)   
        connection.query('USE `station_aquarius`;')
        
        sql = 'UPDATE `t_Data` SET `data_is_sent` = "' + 1 + '" WHERE `idt_Data` = "' + id + '";'
        log(sql, 3)
        return connection.query(sql, callback)
    },
    
    /**
     * @brief Send a post to a web page 
     * @details Send data as json to a web page through a post request
     * 
     * @param jsonInString JSON data in string
     * @param address Address to send data
     * @param callback
     * @param ids ID list to be set as sent after a successful post
     * @return null
     */
    sendPost : function ( jsonInString, address, callback, ids ){
        
        var fs = require('fs');
        
        fs.writeFile("/var/lib/cloud9/Aquarius/data.json", "data=" + jsonInString, function(err) {
            if(err) {
                return console.log(err);
            }
            log("The file was saved!", 4);
            
            var execution = sh.exec("curl --data @/var/lib/cloud9/Aquarius/data.json " + address).stdout
            
            console.log(execution)
            
            if(execution.indexOf("Successfully parsed JSON") > -1)
            {
                callback(ids)
            }
            else{
                callback(null);
            }
        });
    },
    
    /**
     * @brief Send a post to dweet
     * @details 
     * 
     * @param file JSON data
     * @param sendAddress sendAdress Unused, to be refactored
     * @param path Unused, to be refactored
     * @param callback 
     * @param ids ID list to be set as sent
     * @return null
     */    
    sendPostFile : function ( file , sendAddress , path , callback, ids){

        requestModule({
                url: "https://dweet.io:443/dweet/for/Aquarius",
                jar: true,
                method: "POST",
                followAllRedirects: true,
                timeout: 5000,
                strictSSL: true,
                json: file
            }, function (err, response, body) {
                if(!err)
                {
                    if (response.statusCode === 200) {
                        console.log(body)
                        callback(ids);
                    }
                    else {
                        console.log("response.statusCode: " + response.statusCode)
                        console.log("response.statusText: " + response.statusText)
                        callback(null);
                    }
                }
                else {
                    log("error: " + err)
                    callback(null);
                }
                
        });
    },
    
    /**
     * @brief Calibrate and atlas sensor 
     * @details Manages the calibration of an atlas sensor, checks if it is succesful
     * 
     * @param execPath The atlas driver path
     * @param address Address of the device
     * @param point Point of calibration    
     * @param value Value of calibration
     * @return Number of calibration points or -2 if error
     */
    calibrateAtlasSensor : function ( execPath , address , point , value ){
        var checkFirst;
        if(point === "mid"){
            checkFirst = 0;
        }
        else if(point === "clear"){
            checkFirst = -1;
        }
        else{
            checkFirst = sh.exec(execPath + " " + address + " Cal:?").stdout.split(":")[1];
        }
        
        var calibration;
        
        if(value == null){
            log(execPath + " " + address + " Cal:" + point, 0);
            calibration = sh.exec(execPath + " " + address + " Cal:" + point);
        }
        else{
            log(execPath + " " + address + " Cal:" + point + ":" + value, 0);
            calibration = sh.exec(execPath + " " + address + " Cal:" + point + ":" + value);    
        }
        
        if(calibration.stdout.indexOf("ERROR") > -1 ){
            log("Error on calibration", 2);
            return -2;
        }
        
        var checkSecond = sh.exec(execPath + " " + address + " Cal:?").stdout.split(":")[1];
        console.log("First : " + checkFirst + " and second : "+ checkSecond);
        
        if(checkSecond > checkFirst){
            return checkSecond;
        }
        else{
            return -2;
        }
    },
    
    /**
     * @brief Stops the SIM908 module 
     * @details Ensures the SIM908 is properly closed
     * @return true if closed down successfully
     */
    StopSIM908 : function (){
        var driver = "python /var/lib/cloud9/Aquarius/exec/driverSIM908.py ";
        var initDevice = sh.exec(driver + "initDevice");
        var tries = 0;
        var result = 1;
        var CheckOn = sh.exec(driver + "checkIfOn");
        var PowerState;
        
        //console.log("Checking current state : " +  CheckOn.stdout);
        
        if(CheckOn.stdout.indexOf("ON") > -1){
            //console.log("IS ON");
            result = 1;
        }
        else{
            //console.log("IS OFF");
            result = 0;
        }
        
        while(result == 1 && tries < 3){
            //console.log("Still On");
            PowerState = sh.exec(driver + "PowerOff");
            //console.log("Power Off called");
            CheckOn = sh.exec(driver + "checkIfOn");
            if(CheckOn.stdout.indexOf("ON") > -1){
                console.log("IS ON");
                result = 1;
            }
            else{
                console.log("IS OFF");
                result = 0;
            }
            tries++;
            //console.log(tries);
        }
        //console.log("Finally : " + tries + " result : " + result);
        if(tries > 2 && result == 1) return false;
        else return true;
        
    },
    
    /**
     * @brief Starts the SIM908
     * @details Ensures the SIM908 is powered on
     * @return true if the SIM908 is on
     */
    StartSIM908 : function(){
        var driver = "python /var/lib/cloud9/Aquarius/exec/driverSIM908.py ";
        var initDevice = sh.exec(driver + "initDevice");
        var tries = 0;
        var result = 0;
        var CheckOn = sh.exec(driver + "checkIfOn");
        var PowerState;
        
        //console.log("Checking current state : " +  CheckOn.stdout);
        
        if(CheckOn.stdout.indexOf("ON") > -1){
            //console.log("IS ON");
            result = 1;
        }
        else{
            //console.log("IS OFF");
            result = 0;
        }
        
        while(result == 0 && tries < 5){
            //console.log("Still Off");
            PowerState = sh.exec(driver + "PowerOn");
            //console.log("Power On called");
            CheckOn = sh.exec(driver + "checkIfOn");
            if(CheckOn.stdout.indexOf("ON") > -1){
                console.log("IS ON");
                result = 1;
            }
            else{
                console.log("IS OFF");
                result = 0;
            }
            tries++;
            //console.log(tries);
        }
        //console.log("Finally : " + tries + " result : " + result);
        if(tries > 4 && result == 0) return false;
        else return true;
    },
    
    /**
     * @brief Start the GPS module
     * @details 
     * @return 
     */ 
    StartGPS : function(){
        var driver = "python /var/lib/cloud9/Aquarius/exec/driverSIM908.py ";
        
        var result = sh.exec(driver + "StartGPS");
        
        var result2 = sh.exec(driver + "ResetGPS");
    },
    
    /**
     * @brief Get the GPS coordinates
     * @details 
     * @return 
     */
    GetGPS : function(){
        var driver = "python /var/lib/cloud9/Aquarius/exec/driverSIM908.py ";
        
        var result = sh.exec(driver + "R");
        
        console.log(result.stdout);
    },

    /**
     * @brief Stops the GPS
     * @details 
     * @return 
     */
    StopGPS : function(){
        var driver = "python /var/lib/cloud9/Aquarius/exec/driverSIM908.py ";
        
        var result = sh.exec(driver + "StopGPS");
        
        console.log(result.stdout);        
    },

    ExportDatabase : function(connection, callback){
        /*var query = "SELECT order_id,product_name,qty"
                    "FROM orders"
                    "INTO OUTFILE '/tmp/orders.csv'"
                    "FIELDS TERMINATED BY ','"
                    "ENCLOSED BY '\"'"
                    "LINES TERMINATED BY '\n';\";"
*/

        log("Selecting database", 3);
        connection.query('USE `station_aquarius`;');
        
        sql = 'SELECT t_Data.data_value AS ReadValue, ' +
            't_Data.idt_Data AS ID, ' +
            't_Data.data_date AS ReadDate, ' +
            't_VirtualSensor.cloudia_id AS CloudiaSubUnitID, ' +
            't_PhysicalSensor.physical_id AS PhysicalID, ' +
            't_PhysicalSensor.physical_name AS PhysicalName, ' +
            't_VirtualSensor.virtual_measure_unit AS UnitType ' +
            'FROM t_Data, t_VirtualSensor, t_PhysicalSensor ' +
            'WHERE t_Data.data_t_virtual = t_VirtualSensor.virtual_id ' +
            'and t_VirtualSensor.virtual_t_physical = t_PhysicalSensor.physical_id ' +
            'ORDER BY t_VirtualSensor.cloudia_id, t_Data.data_date, t_VirtualSensor.cloudia_id ' + 
            'INTO OUTFILE \'/tmp/export.csv\' ' + 
            'FIELDS TERMINATED BY \',\' ' + 
            'ENCLOSED BY \'\"\' ' + 
            'LINES TERMINATED BY \';\';';
        log(sql, 3);
        return connection.query(sql, callback);
    }
};


