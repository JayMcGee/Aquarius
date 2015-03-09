var mysql   = require('mysql');   //Javascript mySql Connector

module.exports = {
  getSensors : function( connection , unit_id , callback ){
    console.log("In getSensors")
    connection.query('', function(err, rows, fields) {
                      if (err) throw err;

                      callback(connection, rows)
                  });
  }
};