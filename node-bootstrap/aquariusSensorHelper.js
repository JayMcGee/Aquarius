var mysql = require('mysql');

module.exports = {
    
    readConfig : function( connection , callBackToApp ){
        console.log("Selecting database")
        connection.query('USE `station_aquarius`;')
        
        console.log("Querying")
        connection.query('SELECT config_id AS ID, config_key_name AS Name, config_key_value AS Value FROM `t_Config`;', callBackToApp)
    },
    
    setConfig : function( connection , name , value , callBackToApp){
        console.log("Selecting database")
        connection.query('USE `station_aquarius`;')
        
        console.log("Querying")
        sql = 'UPDATE `t_Config` SET `config_key_value` = ' + value + ' WHERE `config_key_name` = "' + name + '";';
        console.log(sql)
        connection.query(sql, callBackToApp)
    },


    setData : function( connection, value, unit, isSent,  callBackToApp){
        console.log("Selecting database")
        connection.query('USE `station_aquarius`;')

        var date = new Date().toISOString().slice(0, 19).replace('T', ' '); //Converts JS Date format to MySql Format

        console.log("Inserting")
        sql = 'INSERT INTO `t_Data` ( data_value, data_t_unit, data_date, data_is_sent ) VALUES ("' + value + '", "' + unit + '", "' + date + '", "' + isSent + '");'
        console.log(sql)
        connection.query(sql, callBackToApp)
    },
/*
    SELECT 
    t_SensorsUnit.unit_id AS UnitID,
    types_name AS TypeName,  
    t_Types.types_driver AS Driver,
    t_SensorsUnit.unit_address AS UnitAddress, 
    t_SensorsUnit.unit_name AS UnitName, 
    t_SensorsUnit.cloudia_unit_id AS CloudiaID, 
    t_Sensor.cloudia_sensor_id AS CloudiaSensorID,
    t_Sensor.sensor_measure_unit AS MeasureUnit,
    t_Sensor.sensor_driver_pos AS Position
FROM `t_SensorsUnit`, `t_Types`, `t_Sensor`
WHERE unit_t_type = types_id and sensor_t_unit = unit_id
ORDER BY t_SensorsUnit.cloudia_unit_id, t_Sensor.cloudia_sensor_id;*/

    getSensors : function(connection, callBackToApp){
        console.log("Selecting database")
        connection.query('USE `station_aquarius`;')

        sql = 'SELECT t_Sensor.sensor_id AS UnitID, types_name AS TypeName, t_Types.types_driver AS Driver, t_SensorsUnit.unit_address AS UnitAddress, ' + 
                't_SensorsUnit.unit_name AS UnitName, t_SensorsUnit.cloudia_unit_id AS CloudiaID, t_Sensor.cloudia_sensor_id AS CloudiaSensorID, ' + 
                't_Sensor.sensor_measure_unit AS MeasureUnit, t_Sensor.sensor_driver_pos AS Position ' +
            'FROM `t_SensorsUnit`, `t_Types`, `t_Sensor` ' +
            'WHERE unit_t_type = types_id and sensor_t_unit = unit_id ' +
            'ORDER BY t_SensorsUnit.cloudia_unit_id, t_Sensor.cloudia_sensor_id;'
        console.log(sql)
        connection.query(sql, callBackToApp)
    }
};