var mysql = require('mysql');

module.exports = {

    readConfig: function(connection, callBackToApp) {
        console.log("Selecting database")
        connection.query('USE `station_aquarius`;')

        console.log("Querying")
        var query = connection.query('SELECT config_id AS ID, config_key_name AS Name, config_key_value AS Value, config_key_description AS Description FROM `t_Config`;', callBackToApp)

        return query
    },

    readConfigAndEmit: function(connection, socket) {
        console.log("Selecting database")
        connection.query('USE `station_aquarius`;')

        console.log("Querying")
        var query = connection.query('SELECT config_id AS ID, config_key_name AS Name, config_key_value AS Value, config_key_description AS Description FROM `t_Config`;', function(err, rows, fields) {
            if (err) {
                throw err;
                console.log("Could not read config table")
            }
            socket.emit('ReceiveConfig', {
                'row': rows
            })
        })

        return query
    },

    setConfig: function(connection, name, value, callBackToApp) {
        console.log("Selecting database")
        connection.query('USE `station_aquarius`;')

        console.log("Querying")
        sql = 'UPDATE `t_Config` SET `config_key_value` = "' + value + '" WHERE `config_key_name` = "' + name + '";';
        console.log(sql)
        return connection.query(sql, callBackToApp)
    },


    setData: function(connection, value, unit, isSent, callBackToApp) {
        console.log("Selecting database")
        connection.query('USE `station_aquarius`;')

        var date = new Date().toISOString().slice(0, 19).replace('T', ' '); //Converts JS Date format to MySql Format

        console.log("Inserting")
        sql = 'INSERT INTO `t_Data` ( data_value, data_t_virtual, data_date, data_is_sent ) VALUES ("' + value + '", "' + unit + '", "' + date + '", "' + isSent + '");'
        console.log(sql)
        return connection.query(sql, callBackToApp)
    },

    getSensors: function(connection, callBackToApp) {
        console.log("Selecting database")
        connection.query('USE `station_aquarius`;')

        sql = 'SELECT 	t_VirtualSensor.virtual_id AS VirtualID, ' + 't_Types.types_name AS TypeName, ' + 't_Types.types_driver AS Driver, ' + 't_PhysicalSensor.physical_address AS PhysicalAddress, ' + 't_PhysicalSensor.physical_name AS UnitName, ' + 't_PhysicalSensor.cloudia_unit_id AS CloudiaUnitID, ' + 't_VirtualSensor.cloudia_id AS CloudiaSensorID, ' + 't_VirtualSensor.virtual_measure_unit AS MeasureUnit, ' + 't_VirtualSensor.virtual_driver_pos AS Position ' + 'FROM `t_VirtualSensor`, `t_Types`, `t_PhysicalSensor` ' + 'WHERE t_PhysicalSensor.physical_t_type = t_Types.types_id ' + 'and t_VirtualSensor.virtual_t_physical = t_PhysicalSensor.physical_id ' + 'ORDER BY t_PhysicalSensor.cloudia_unit_id, t_VirtualSensor.cloudia_id;'
        console.log(sql)
        return connection.query(sql, callBackToApp)
    },

    getDataForSensorsNotSent: function(connection, callBackToApp) {
        console.log("Selecting database")
        connection.query('USE `station_aquarius`;')

        sql = 'SELECT t_Data.data_value AS ReadValue, '+
        't_Data.data_date AS ReadDate, '+
        't_VirtualSensor.cloudia_id AS CloudiaSubUnitID, '+
        't_PhysicalSensor.cloudia_unit_id AS CloudiaUnitID, '+
        't_PhysicalSensor.physical_name AS PhysicalName, '+
        't_VirtualSensor.virtual_measure_unit AS UnitType '+
        'FROM t_Data, t_VirtualSensor, t_PhysicalSensor '+
        'WHERE t_Data.data_t_virtual = t_VirtualSensor.virtual_id '+
        'and t_VirtualSensor.virtual_t_physical = t_PhysicalSensor.physical_id '+
        'and t_Data.data_is_sent = 0 '+
        'ORDER BY t_PhysicalSensor.cloudia_unit_id, t_Data.data_date, t_VirtualSensor.cloudia_id;'
        console.log(sql)
        return connection.query(sql, callBackToApp)
    }
};