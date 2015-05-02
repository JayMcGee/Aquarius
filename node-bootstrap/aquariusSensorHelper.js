var mysql = require('mysql');
var http = require('http');
var fs = require('fs');
var sh = require('execSync'); //Permits the execution of external applications synchronously
var requestModule = require('request')

var net = require('net');
var CONFIG_Verbose_Level = null;

function log(dataToAppend, level)
{
    dataToAppend =  "[" + new Date().toISOString() + "]: " + dataToAppend + "\r"
    if(level <= CONFIG_Verbose_Level){
        console.log("SQL : " + dataToAppend)
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

function readConfigurationTable(connection, callBackToApp) {
    log("Selecting database", 3)
    connection.query('USE `station_aquarius`;')

    log("Querying", 3)
    var query = connection.query('SELECT config_id AS ID, config_key_name AS Name, config_key_value AS Value, config_key_description AS Description FROM `t_Config`;', callBackToApp)

    return query
}

module.exports = {
    
    readConfig : readConfigurationTable,
    
    init : function(connection)
    {
        readConfigurationTable(connection, assignConfigurationValues)
    },

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

    setConfig: function(connection, name, value, callBackToApp) {
        log("Selecting database", 3)
        connection.query('USE `station_aquarius`;')

        log("Querying", 3)
        sql = 'UPDATE `t_Config` SET `config_key_value` = "' + value + '" WHERE `config_key_name` = "' + name + '";';
        log(sql, 3)
        return connection.query(sql, callBackToApp)
    },


    setData: function(connection, value, unit, isSent, callBackToApp) {
        log("Selecting database", 3)
        connection.query('USE `station_aquarius`;')

        var date = new Date().toISOString().slice(0, 19).replace('T', ' '); //Converts JS Date format to MySql Format

        log("Inserting", 3)
        sql = 'INSERT INTO `t_Data` ( data_value, data_t_virtual, data_date, data_is_sent ) VALUES ("' + value + '", "' + unit + '", "' + date + '", "' + isSent + '");'
        log(sql, 3)
        return connection.query(sql, callBackToApp)
    },

    getSensors: function(connection, callBackToApp) {
        log("Selecting database", 3)
        connection.query('USE `station_aquarius`;')

        sql = 'SELECT t_VirtualSensor.virtual_id AS VirtualID, ' + 
                't_Types.types_name AS TypeName, ' + 
                't_Types.types_driver AS Driver, ' + 
                't_PhysicalSensor.physical_address AS PhysicalAddress, ' + 
                't_PhysicalSensor.physical_name AS UnitName, ' + 
                't_PhysicalSensor.cloudia_unit_id AS CloudiaUnitID, ' + 
                't_VirtualSensor.cloudia_id AS CloudiaSensorID, ' + 
                't_VirtualSensor.virtual_measure_unit AS MeasureUnit, ' + 
                't_VirtualSensor.virtual_driver_pos AS Position ' + 
                'FROM `t_VirtualSensor`, `t_Types`, `t_PhysicalSensor` ' + 
                'WHERE t_PhysicalSensor.physical_t_type = t_Types.types_id ' + 
                'and t_VirtualSensor.virtual_t_physical = t_PhysicalSensor.physical_id ' + 
                'ORDER BY t_VirtualSensor.cloudia_id;'
        log(sql, 3)
        return connection.query(sql, callBackToApp)
    },
    
    getASensor: function(connection,physicalId,callBackToApp){
        log("Selecting database", 3)
        connection.query('USE `station_aquarius`;')

        sql = 'SELECT t_VirtualSensor.virtual_id AS VirtualID, ' + 
                't_Types.types_name AS TypeName, ' + 
                't_Types.types_driver AS Driver, ' + 
                't_PhysicalSensor.physical_address AS PhysicalAddress, ' + 
                't_PhysicalSensor.physical_name AS UnitName, ' + 
                't_PhysicalSensor.cloudia_unit_id AS CloudiaUnitID, ' + 
                't_VirtualSensor.cloudia_id AS CloudiaSensorID, ' + 
                't_VirtualSensor.virtual_measure_unit AS MeasureUnit, ' + 
                't_VirtualSensor.virtual_driver_pos AS Position ' + 
                'FROM `t_VirtualSensor`, `t_Types`, `t_PhysicalSensor` ' + 
                'WHERE t_PhysicalSensor.physical_id = ' + physicalId + ' ' + 
                'and t_PhysicalSensor.physical_t_type = t_Types.types_id ' +
                'and t_VirtualSensor.virtual_t_physical = t_PhysicalSensor.physical_id ' + 
                'ORDER BY t_PhysicalSensor.cloudia_unit_id, t_VirtualSensor.cloudia_id;'
        log(sql, 3)
        return connection.query(sql, callBackToApp)  
    },
    
    getSensorsAndEmit: function(connection,socket, callBackToApp) {
        log("Selecting database", 3)
        connection.query('USE `station_aquarius`;')

        sql = 'SELECT t_VirtualSensor.virtual_id AS VirtualID, ' + 
                't_Types.types_name AS TypeName, ' + 
                't_Types.types_driver AS Driver, ' + 
                't_PhysicalSensor.physical_address AS PhysicalAddress, ' + 
                't_PhysicalSensor.physical_name AS UnitName, ' + 
                't_PhysicalSensor.cloudia_unit_id AS CloudiaUnitID, ' + 
                't_VirtualSensor.cloudia_id AS CloudiaSensorID, ' + 
                't_VirtualSensor.virtual_measure_unit AS MeasureUnit, ' + 
                't_VirtualSensor.virtual_driver_pos AS Position, ' + 
                't_VirtualSensor.virtual_min AS Min, ' +
                't_VirtualSensor.virtual_max AS Max, ' +
                't_VirtualSensor.virtual_color As Color ' + 
                'FROM `t_VirtualSensor`, `t_Types`, `t_PhysicalSensor` ' + 
                'WHERE t_PhysicalSensor.physical_t_type = t_Types.types_id ' + 
                'and t_VirtualSensor.virtual_t_physical = t_PhysicalSensor.physical_id ' + 
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
        'ORDER BY t_PhysicalSensor.cloudia_unit_id, t_Data.data_date, t_VirtualSensor.cloudia_id ' + 
        'LIMIT 40;'
        log(sql, 3)
        return connection.query(sql, callBackToApp)
    },
    
    setDataAsSent : function (connection, id, callback){
        log("Selecting database", 3)   
        connection.query('USE `station_aquarius`;')
        
        sql = 'UPDATE `t_Data` SET `data_is_sent` = "' + 1 + '" WHERE `idt_Data` = "' + id + '";'
        log(sql, 3)
        return connection.query(sql, callback)
    },
    
    sendPost : function ( jsonInString, address, callback ){
        
        var fs = require('fs');
        
        fs.writeFile("/var/lib/cloud9/Aquarius/data.json", "data=" + jsonInString, function(err) {
            if(err) {
                return console.log(err);
            }
            log("The file was saved!", 4);
            
            var execution = sh.exec("curl --data @/var/lib/cloud9/Aquarius/data.json " + address).stdout
            
            console.log(execution)
            callback()
        });
    },
    
    sendPostFile : function ( file , sendAddress , path , callback){

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
                    }
                    else {
                        console.log("response.statusCode: " + response.statusCode)
                        console.log("response.statusText: " + response.statusText)
                    }
    		    }
    		    else {
                    log("error: " + err)
    		    }
    		    
		});
    },
    
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
    
    GPSOnBootCheckUp : function (){
        var driver = "python /var/lib/cloud9/Aquarius/exec/driverSIM908.py ";
        var initDevice = sh.exec(driver + "initDevice");
        var tries = 0;
        var result = 1;
        var CheckOn = sh.exec(driver + "checkIfOn");
        var PowerState;
        
        console.log("Checking current state : " +  CheckOn.stdout);
        
        if(CheckOn.stdout.indexOf("ON") > -1){
            console.log("IS ON");
            result = 1;
        }
        else{
            console.log("IS OFF");
            result = 0;
        }
        
        while(result == 1 && tries < 3){
            console.log("Still On");
            PowerState = sh.exec(driver + "PowerOff");
            console.log("Power Off called");
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
            console.log(tries);
        }
        console.log("Finally : " + tries + " result : " + result);
        if(tries > 2 && result == 1) return false;
        else return true;
        
    },
    
    BootUpAndSetUpSIM908 : function(){
        var driver = "python /var/lib/cloud9/Aquarius/exec/driverSIM908.py ";
        var initDevice = sh.exec(driver + "initDevice");
        var tries = 0;
        var result = 0;
        var CheckOn = sh.exec(driver + "checkIfOn");
        var PowerState;
        
        console.log("Checking current state : " +  CheckOn.stdout);
        
        if(CheckOn.stdout.indexOf("ON") > -1){
            console.log("IS ON");
            result = 1;
        }
        else{
            console.log("IS OFF");
            result = 0;
        }
        
        while(result == 0 && tries < 5){
            console.log("Still Off");
            PowerState = sh.exec(driver + "PowerOn");
            console.log("Power On called");
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
            console.log(tries);
        }
        console.log("Finally : " + tries + " result : " + result);
        if(tries > 4 && result == 0) return false;
        else return true;
    },
    
    StartGPS : function(){
        var driver = "python /var/lib/cloud9/Aquarius/exec/driverSIM908.py ";
        
        var result = sh.exec(driver + "StartGPS");
    },
    
    GetGPS : function(){
        var driver = "python /var/lib/cloud9/Aquarius/exec/driverSIM908.py ";
        
        var result = sh.exec(driver + "R");
        
        console.log(result.stdout);
    }
};


