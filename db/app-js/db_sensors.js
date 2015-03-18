
var mysql   = require('mysql');   //Javascript mySql Connector


module.exports = {
	getSensorReadings : function( connection , output , unit_id,  callback ){
		console.log("In get getSensorReadings")
	   	connection.query('', function(err, rows, fields) {
	                    	if (err) throw err;

		                    callback(connection, rows, output)
	                  	});
	}
};