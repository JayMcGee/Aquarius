//Include necessary node packages
var io = require('/var/www/node_modules/socket.io').listen(3001);
var mysql      = require('/var/www/node_modules/mysql');
var exec = require('child_process').exec,
    child;
    
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'poutine'
});

connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }

  console.log('connected as id ' + connection.threadId);
  
  connection.query('USE `aquariusStation`');
}); 

var interval = 4000; //enter the time between sensor queries here (in milliseconds)
 
    //when a client connects
io.sockets.on('connection', function (socket) {
    
    //connection.query('SELECT date AS DateReading FROM `sensorData` ORDER BY date)
    
//initiate interval timer
    setInterval(function () {
        console.log('Dans la boucle');
        
        
        child = exec('/var/lib/cloud9/src/test_src/MySqlConnector/main',
            function (error, stdout, stderr) {
                console.log('stdout: ' + stdout);
                console.log('stderr: ' + stderr);
                if (error !== null) {
                  console.log('exec error: ' + error);
                }
        });
        
        connection.query('SELECT date AS DateReading, water_temp AS TempWater FROM `sensorData` ORDER BY date DESC LIMIT 10;',
                    function(err, rows, fields){
                        
        if (err) throw err;      
        console.log(rows[0].TempWater);
        
        socket.emit('clear');
        
        rows.forEach(function(row)
        {
            socket.emit('temps', {'date': row.DateReading, 'value': row.TempWater});
        });
        //send temperature reading out to connected clients
        
    })}, interval);
    
    
});