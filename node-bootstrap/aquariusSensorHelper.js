var mysql = require('mysql');
var fs = require('fs');

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

        sql = 'SELECT 	t_VirtualSensor.virtual_id AS VirtualID, ' + 't_Types.types_name AS TypeName, ' + 't_Types.types_driver AS Driver, ' + 't_PhysicalSensor.physical_address AS PhysicalAddress, ' + 't_PhysicalSensor.physical_name AS UnitName, ' + 't_PhysicalSensor.cloudia_unit_id AS CloudiaUnitID, ' + 't_VirtualSensor.cloudia_id AS CloudiaSensorID, ' + 't_VirtualSensor.virtual_measure_unit AS MeasureUnit, ' + 't_VirtualSensor.virtual_driver_pos AS Position ' + 'FROM `t_VirtualSensor`, `t_Types`, `t_PhysicalSensor` ' + 'WHERE t_PhysicalSensor.physical_t_type = t_Types.types_id ' + 'and t_VirtualSensor.virtual_t_physical = t_PhysicalSensor.physical_id ' + 'ORDER BY t_PhysicalSensor.cloudia_unit_id, t_VirtualSensor.cloudia_id;'
        log(sql, 3)
        return connection.query(sql, callBackToApp)
    },

    getDataForSensorsNotSent: function(connection, callBackToApp) {
        log("Selecting database", 3)
        connection.query('USE `station_aquarius`;')

        sql = 'SELECT t_Data.data_value AS ReadValue, ' +
        't_Data.idt_Data AS ID, ' +
        't_Data.data_date AS ReadDate, ' +
        't_VirtualSensor.cloudia_id AS CloudiaSubUnitID, ' +
        't_PhysicalSensor.cloudia_unit_id AS CloudiaUnitID, ' +
        't_PhysicalSensor.physical_name AS PhysicalName, ' +
        't_VirtualSensor.virtual_measure_unit AS UnitType ' +
        'FROM t_Data, t_VirtualSensor, t_PhysicalSensor ' +
        'WHERE t_Data.data_t_virtual = t_VirtualSensor.virtual_id ' +
        'and t_VirtualSensor.virtual_t_physical = t_PhysicalSensor.physical_id ' +
        'and t_Data.data_is_sent = 0 ' +
        'ORDER BY t_PhysicalSensor.cloudia_unit_id, t_Data.data_date, t_VirtualSensor.cloudia_id;'
        log(sql, 3)
        return connection.query(sql, callBackToApp)
    }
    
    
};


