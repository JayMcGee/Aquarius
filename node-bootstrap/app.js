var express = require('express.io');                    //Express and Socket.io integration
var mysql   = require('mysql');   //Javascript mySql Connector
var exec    = require('child_process').exec,child;      //Execute shell command
var tty     = require('tty.js');                        //Terminal access from web-client
var schedule= require('node-schedule');

var interval = 10000; //enter the time between sensor queries here (in milliseconds)

//Prepare Scheduler
var rule = new schedule.RecurrenceRule();
//ule.second = [0,10,20,30,40,50];
rule.minute = [0,30];
var date,newTemp,newPh,newDo,newCond,newStationTemp,newStationHum;


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
        var randomnumber=(Math.random()*41.1)
        socket.emit('lastTemp',{'value':randomnumber});
    });
    socket.on('updatePh',function(){
        var randomnumber=(Math.random()*13.99)
        socket.emit('lastPh',{'value':randomnumber});
    });
    socket.on('updateDo',function(){
        var randomnumber=(Math.random()*12.99)
        socket.emit('lastDo',{'value':randomnumber});
    });
    socket.on('updateCond',function(){
        var randomnumber=(Math.random()*20000)
        socket.emit('lastCond',{'value':randomnumber});
    });
    socket.on('updateStationTemp',function(){
        var randomnumber=(Math.random()*41.1)
        socket.emit('lastStationTemp',{'value':randomnumber});
    });
    socket.on('updateStationHum',function(){
        var randomnumber=(Math.random()*100)
        socket.emit('lastStationHum',{'value':randomnumber});
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



//Scheduler
var getData = schedule.scheduleJob(rule,function()
    {
       var Step = 0;
        
        console.log("Scheduled Event Started")
        date = new Date().toISOString().slice(0, 19).replace('T', ' '); //Converts JS Date format to MySql Format
        
        while(Step !== 4)
        {
            if ( Step == 0 ) //Read Sensors
            {
                var allExecsEnded = false;
                //All sensor are Read ( Asynchronously)
                //Get Temperature data
                console.log("Reading sensors");
                //////////////////////////////////////////////    TEMPERATURE READING    ///////////////////////////////////////////////////
                child = exec("/var/lib/cloud9/Aquarius/src/build_src/exec/driverOneWireExec 28-000006052315" , function(error,stdout,stderr)
                {
                    var splittedStdOutput = stdout.split(';');
                    var value = splittedStdOutput[5];
                    if(error !== null)
                    {
                        console.log('Exec error' + error);
                    }
                    else
                    {
                        newTemp = value;
                    }
                });
                
                //////////////////////////////////////////////         PH READING          ///////////////////////////////////////////////////
                child = exec("/var/lib/cloud9/Aquarius/src/build_src/exec/driverAtlasI2CPH 1:99 R" , function(error,stdout,stderr)
                {
                    var splittedStdOutput = stdout.split(';');
                    var value = splittedStdOutput[5];
                    newPh = value;
                });
                
                //////////////////////////////////////////////         DO READING          ///////////////////////////////////////////////////
                child = exec("/var/lib/cloud9/Aquarius/src/build_src/exec/driverAtlasI2CDO 1:97 R" , function(error,stdout,stderr)
                {
                    var splittedStdOutput = stdout.split(';');
                    var value = splittedStdOutput[7];
                    console.log(stdout + " : " + value);
                    newDo = value;
                });
                
                //////////////////////////////////////////////       COND READING      ///////////////////////////////////////////////////
                child = exec("/var/lib/cloud9/Aquarius/src/build_src/exec/driverAtlasI2CK 1:100 R" , function(error,stdout,stderr)
                {
                    var splittedStdOutput = stdout.split(';');
                    var value = splittedStdOutput[5];
                    console.log(stdout + " : " + value);
                    newCond = value;
                });
                
                //////////////////////////////////////////////       INTERNAL READING      ///////////////////////////////////////////////////
                child = exec("/var/lib/cloud9/Aquarius/src/build_src/exec/driverDHT22Exec 1:14" , function(error,stdout,stderr)
                {
                    var splittedStdOutput = stdout.split(';');
                    var value1 = splittedStdOutput[5];
                    var value2 = splittedStdOutput[7];
                    if(error !== null)
                    {
                        console.log('Exec error' + error);
                    }
                    else
                    {
                        newStationTemp = value1;
                        newStationHum = value2;
                    }
                });

                console.log("Reading Complete");
                console.log("Temp = " + newTemp);
                console.log("Ph = " + newPh);
                console.log("Do = " + newDo);
                console.log("Cond = " + newCond);
                console.log("S. Temp = " + newStationTemp);
                console.log("S. Hum = " + newStationHum);
                //Next Step
                Step = 1;
            }
            else if( Step ==1) //Confirm Data
            {
                Step = 2;
            }
            else if (Step == 2) //Update DataBase
            {
                //if All child exec are executed withSucces
                //Insert Data in DataBase
                connection.query('USE `aquariusStation`');
                var post = {date:date,water_temp:newTemp,water_conduc:newCond, water_do:newDo, water_ph:newPh, case_temp:newStationTemp, case_humidity:newStationHum}
                var query = connection.query('INSERT INTO sensorData SET ?' ,post, function(error,result){
                    console.log(query.sql);
                    if(error !== null)
                    {
                        console.log('Query error' + error);
                        success = false;
                    }
                    console.log("Scheduled Event Ended")
                });
                Step = 4;
            }
        }
    }); 
    
