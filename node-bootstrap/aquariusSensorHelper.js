var mysql = require('mysql');
var db_types = require('./db_types')

module.exports = {
	readAllSensorsToDB : function( connection ){
	    console.log("In readAllSensors")
	   	db_types.getSensors(connection , type_ID , iterateSensors)
  	},

  	iterateSensors : function ( connection , sensors ){
  		console.log("In iterateSensorsToDB")
  		db_types.getDriverPaths( connection , sensors , iterateSensorsToDB )
  	},

  	iterateSensorsToDB : function ( connection , sensors , types ){

  		var path
  		for( var i in sensors ){
  			for ( var x in types ){
  				if(i.unit_t_type == x.types_id)
  				{
  					path = x.types_driver
  				}
  			}

  			stdout = execSync(path + " "  + sensors.unit_address + " R")
  			db_types.getSensorReadings(connection, stdout, sensors.units_id, iterateUnitsToDB)

  		}


  	},

  	iterateUnitsToDB : function( connection , units , output ){
  		for(var i in units){
  			//Extract data and put in db
  		}
  	}

};