

var mysql   = require('mysql');   //Javascript mySql Connector

module.exports = {
  getDriverPaths : function( connection , sensors , callback ){
    console.log("In getDriverPath")
    var whereArgs;

    for(var i = 0; i < sensors.length; i++){
        whereArgs += " types_id = " + sensors[i].unit_t_type 
        if(i < sensors.length - 1){
          whereArgs += " or "
        }
    }

    connection.query('' + whereArgs, function(err, rows, fields) {
                      if (err) throw err;

                      callback(connection, sensors, rows)
                  });
  },

  getDriverAndTypeName : function( connection , type_ID , callback ){
    console.log("In getDriverAndTypeName")
  },

  getTypeName : function( connection , type_ID, callback ){
    console.log("In getTypeName")
  }
};
