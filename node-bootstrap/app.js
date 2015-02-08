var express = require('express.io');                    //Express and Socket.io integration
var mysql   = require('mysql');   //Javascript mySql Connector
var exec    = require('child_process').exec,child;      //Execute shell command
var tty     = require('tty.js');                        //Terminal access from web-client

var interval = 10000; //enter the time between sensor queries here (in milliseconds)

//////////////////////////////////////////////////////////
//Establishing connection to Station database (local DB)    
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

///////////////////////////////////////////////////////////
//Creating the terminal server
function startTerminal(){
    var appTTY = tty.createServer({
        shell: 'bash',
        users:{
            root: 'poutine'
        },
        port:8089
    });
    //Wait for user and password
    appTTY.get('/root',function(req,res,next){
        res.send('poutine');
    });
    appTTY.listen();
}



////////////////////////////////////////////////////////////
//Starting web-client server
app = express();
app.use(express.static(__dirname + '/public'));
app.use(app.router);
app.http().io();
app.listen(8088);

// Setup the ready route, and emit talk event.
app.io.route('ready', function(req) {
    console.log('User Connected');
})
// Send the client html.
app.get('/', function(req, res) {
    res.sendfile(__dirname + '/index.html')
})
app.get('/index.html', function(req, res) {
    res.sendfile(__dirname + '/index.html')
})
app.get('/ui.html', function(req, res) {
    res.sendfile(__dirname + '/ui.html')
})
app.get('/chart.html', function(req, res) {
    res.sendfile(__dirname + '/chart.html')
})
//The 404 Route (ALWAYS Keep this as the last route)
app.get('*', function(req, res){
   res.sendfile(__dirname + '/404.html')
})

//////////////////////////////////////////////////////////////
// Manage any Socket.io Event

//On connection to the client send the most recent data from the DB
//Send  
app.io.on('connection',function(socket){
        connection.query('SELECT date AS DateReading, water_temp AS TempWater, water_ph AS PhWater, water_do AS DoWater, water_conduc AS ConducWater, case_temp AS TempCase, case_humidity as HumCase FROM `sensorData` ORDER BY date DESC LIMIT 10;',
        function(err, rows, fields){
            if (err) throw err;      
            socket.emit('lastTemp', {'value': rows[0].TempWater});
            socket.emit('lastPh',   {'value': rows[0].PhWater});
            socket.emit('lastDo',   {'value': rows[0].DoWater});
            socket.emit('lastCondu',{'value': rows[0].ConducWater});
            socket.emit('lastCaseT',{'value': rows[0].TempCase});
            socket.emit('lastCaseH',{'value': rows[0].HumCase});
            sendTempFromDB(10,socket);
        });
});

//Receive update Command
app.io.on('connection',function(socket){
    socket.on('updateTemp',function(){
        //// Execute Temperature Sensor driver
        child = exec('/var/lib/cloud9/src/test_src/MySqlConnector/main',
            function (error, stdout, stderr) {
                var randomnumber=(Math.random()*41.1)
                socket.emit('lastTemp',{'value':randomnumber});
        });
    });
});

//receive start terminal
app.io.on('connection',function(socket){
    socket.on('startTerminal',function(){
            startTerminal();
            socket.emit('terminalStarted');
    });
});

//Send from database Functiions
function sendTempFromDB(rowCount,socket){
   connection.query('SELECT date AS DateReading, water_temp AS TempWater FROM `sensorData` ORDER BY date DESC LIMIT 10;',
        function(err, rows, fields){
            if(err) throw err;
                //send temperature reading out to connected clients
                socket.emit('tempData', {'array': rows});
        });
}