var express = require('express.io');                    //Express and Socket.io integration
var mysql   = require('mysql');   //Javascript mySql Connector
var exec    = require('child_process').exec,child,pHc,DOc,Kc,OWc,DHTc;      //Execute shell command                     //Terminal access from web-client
var schedule= require('node-schedule');
var sh      = require('execSync');
var databaseHelper = require('./aquariusSensorHelper')

var interval = 10000; //enter the time between sensor queries here (in milliseconds)

StepsReadings = {
    Begin : 1,
    pH : 2,
    DO : 3,
    K : 4,
    DS18 : 5,
    DHT : 6,
    PutDB : 7,
    Done : 8,
    End : 9,
    DontDoShit : 10,
    ConfigNotRead : 11
}

var Step = StepsReadings.Begin;
//Config
var CONFIG_Station_ID = null;
var CONFIG_Cloudia_Address = null;
var CONFIG_Last_Date = null;
var CONFIG_Interval = null;
//Prepare Scheduler
var rule = new schedule.RecurrenceRule();
rule.second = [0,30];
//rule.minute = [0,30];
var date,newTemp,newPh,newDo,newCond,newStationTemp,newStationHum;


//////////////////////////////////////////////////////////
//Establishing connection to Station database (local DB)    
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'snoopy'
});

connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }

  console.log('connected as id ' + connection.threadId);
  
  connection.query('USE `aquariusStation`');
}); 



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
app.get('/form.html', function(req, res) {
    res.sendfile(__dirname + '/form.html')
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
    
    socket.on('configInterval',function(data){
       var interval = data.interval;
       console.log("Interval = " + interval)
    });
    
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
        Step = StepsReadings.Begin;
        
        console.log("Scheduled Event Started")
        date = new Date().toISOString().slice(0, 19).replace('T', ' '); //Converts JS Date format to MySql Format
        
        while( Step !== StepsReadings.End )
        {
            if ( Step == StepsReadings.Begin ) //Initial
            {
                console.log("Reading sensors")
                newTemp = null
                newPh = null
                newDo = null
                newCond = null
                newStationTemp = null
                newStationHum = null
                Step = StepsReadings.pH
            }
            else if( Step == StepsReadings.pH )
            {
                //////////////////////////////////////////////         PH READING          ///////////////////////////////////////////////////
                var resultPh = sh.exec("/var/lib/cloud9/Aquarius/src/build_src/exec/driverAtlasI2CPH 1:99 R")
                var splittedStdOutput = resultPh.stdout.split(';')
                var value = splittedStdOutput[5]
                newPh = value
                Step = StepsReadings.DO
            }
            else if ( Step == StepsReadings.DO )
            {
                 //////////////////////////////////////////////         DO READING          ///////////////////////////////////////////////////
                var resultDo = sh.exec("/var/lib/cloud9/Aquarius/src/build_src/exec/driverAtlasI2CDO 1:97 R")
                var splittedStdOutput = resultDo.stdout.split(';')
                var value = splittedStdOutput[7]
                newDo = value
                Step = StepsReadings.K
            }
            else if ( Step == StepsReadings.K )
            {
                //////////////////////////////////////////////       COND READING      ///////////////////////////////////////////////////
                var resultK = sh.exec("/var/lib/cloud9/Aquarius/src/build_src/exec/driverAtlasI2CK 1:100 R")
                var splittedStdOutput = resultK.stdout.split(';')
                var value = splittedStdOutput[5]
                newCond = value
                Step = StepsReadings.DS18
            }
            else if ( Step == StepsReadings.DS18 )
            {
                //////////////////////////////////////////////    TEMPERATURE READING    ///////////////////////////////////////////////////
                resultOW = sh.exec("/var/lib/cloud9/Aquarius/src/build_src/exec/driverOneWireExec 28-000006700658")
                var splittedStdOutput = resultOW.stdout.split(';')
                var value = splittedStdOutput[5]
                newTemp = value
                Step = StepsReadings.DHT
            }
            else if ( Step == StepsReadings.DHT )   
            {
                //////////////////////////////////////////////       INTERNAL READING      ///////////////////////////////////////////////////
                var resultDHT = sh.exec("/var/lib/cloud9/Aquarius/src/build_src/exec/driverDHT22Exec 1:14")
                var splittedStdOutput = resultDHT.stdout.split(';')
                var value1 = splittedStdOutput[5]
                var value2 = splittedStdOutput[7]
                newStationTemp = value1
                newStationHum = value2
                Step = StepsReadings.PutDB
            }
            else if( Step == StepsReadings.PutDB ) //Confirm Data
            {
                console.log("Reading Complete");
                console.log("Temp = " + newTemp);
                console.log("Ph = " + newPh);
                console.log("Do = " + newDo);
                console.log("Cond = " + newCond);
                console.log("S. Temp = " + newStationTemp);
                console.log("S. Hum = " + newStationHum);
                
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
                
                Step = StepsReadings.Done;
            }
            else if (Step == StepsReadings.Done) //Update DataBase
            {
                //if All child exec are executed withSucces
                //Insert Data in DataBase
                
                Step = StepsReadings.End;
            }
            else if (Step == StepsReadings.DontDoShit )
                console.log("Don't do shit")
            
        }
    }); 
    
function configurationReadCallback(err, rows, fields){
    if (err) {
        throw err;
        console.log("Could not read config table")
    }
    console.log("Assigning config data")

    for (index = 0; index < rows.length; ++index) {
        currentName = rows[index].Name
        currentValue = rows[index].Value
        
        console.log("Data : "  + currentName + " value : " + currentValue)
        if(currentName == "STATION_ID")
        {
            console.log("Assigned station id")
            CONFIG_Station_ID = currentValue
        }
        else if(currentName == "READ_INTERVAL")
        {
            console.log("Assigned read interval")
            CONFIG_Interval = currentValue
        }
        else if(currentName == "SEND_ADDRESS")
        {
            console.log("Assigned send address")
            CONFIG_Cloudia_Address = currentValue
        }
        else if(currentName == "LAST_KNOWN_DATE")
        {
            console.log("Assigned last known date")
            CONFIG_Last_Date = currentValue
        }
    }
}