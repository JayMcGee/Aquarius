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
    }
};