var express = require('express.io');                    //Express and Socket.io integration
var mysql   = require('mysql');   //Javascript mySql Connector
var exec    = require('child_process').exec,child,pHc,DOc,Kc,OWc,DHTc;      //Execute shell command                     //Terminal access from web-client
var schedule= require('node-schedule');
var sh      = require('execSync');
var databaseHelper = require('./aquariusSensorHelper')

var interval = 10000; //enter the time between sensor queries here (in milliseconds)

var rtcExecPath = "python /var/lib/cloud9/Aquarius/exec/driverRTC.py"
var modeSwitchExec = "python /var/lib/cloud9/Aquarius/exec/get_gpio_sw1.py"

//Config
var CONFIG_Station_ID = null;
var CONFIG_Cloudia_Address = null;
var CONFIG_Last_Date = null;
var CONFIG_Interval = null;
var CONFIG_Number_Retrys = null;

//////////////////////////////////////////////////////////
//Establishing connection to Station database (local DB)    
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'snoopy'
});

connection.connect(function(err) {
    if (err) {
        console.error('Error connecting: ' + err.stack);
        return;
    }

    drawSeparator()
    console.log('Connected as id ' + connection.threadId);
    drawSeparator()
    databaseHelper.readConfig(connection, configurationReadCallback);
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
    socket.on('RequestConfig',function(){
        console.log("Requested configuration")
        databaseHelper.readConfigAndEmit(connection, socket)
        
    })
    socket.on('UpdateConfig', function(data){
        console.log("Requested an update to configuration")
        databaseHelper.setConfig(connection, data.Name, data.Value, configurationSetCallBack)
    })
})

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

//Send from database Functions
function sendTempFromDB(rowCount,socket){
   
    console.log("DEPRECATED")

    connection.query('SELECT date AS DateReading, water_temp AS TempWater FROM `sensorData` ORDER BY date DESC LIMIT 10;',
        function(err, rows, fields){
            if(err) throw err;
                //send temperature reading out to connected clients
                socket.emit('tempData', {'array': rows});
        });
}

/**
*
*/
function main(){
    
    var currentMode = sh.exec(modeSwitchExec)

    drawSeparator()
    console.log("Resetting RTC")
    var rtcReset = sh.exec(rtcExecPath + " disablealarm")
    console.log("Getting date from RTC")
    var rtcGetDate = sh.exec(rtcExecPath + " getdate")
    console.log(sh.exec("date").stdout)
    drawSeparator()
    console.log()

    drawSeparator()
    console.log("Reading mode : " + currentMode.stdout)
    if( currentMode.stdout.indexOf("HIGH") > -1)
    {
        console.log("Auto mode")

        console.log("Reading new sensor values")
        drawSeparator()
        console.log()

        readAllSensorsInDataBase()        

        var date = new Date()

        drawSeparator()
        console.log("Date without added interval : " + date.toISOString().slice(0, 19).replace('T', ' '))
        date.setMinutes(date.getMinutes() + parseInt(CONFIG_Interval))
        console.log("New date with added interval : " + date.toISOString().slice(0, 19).replace('T', ' '))
        drawSeparator()
        console.log("Setting up rtc to wake up at : " + date.getMinutes())
        var rtcSetAlarm = sh.exec(rtcExecPath + " setalarm -m " + date.getMinutes())
        drawSeparator()
        var rtcSetAlarm = sh.exec(rtcExecPath + " enablealarm")
        drawSeparator()
        
        var shutdown = sh.exec("shutdown -h now")
    }
    else
    {
        console.log("Manual mode")    
        readAllSensorsInDataBase()
        console.log("Waiting")
        drawSeparator()
    }
}
    
/**
*
*/
function configurationReadCallback(err, rows, fields){
    if (err) {
        console.log("Could not read config table")
        throw err;
    }
    main()
}

/**
*
*/
function assignConfigurationValues(err, rows, fields)
{
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
        else if(currentName == "NUMBER_RETRYS")
        {
            console.log("Assigned retry attempts")
            CONFIG_Number_Retrys = currentValue
        }
    }
}

/**
 * 
 */
function configurationSetCallBack(err, result){
    console.log("Configuration result : " + result)
}

/**
*
*/
function t_Data_insertCallBack(err, result){
    console.log("Insert result : " + result)
}

/**
*
*/
function getSensorReadingCallback(err, rows, fields){
    if (err) {
        throw err;
        console.log("Could not read sensors table")
    }
    console.log("Reading and adding data")

    alreadyDone = []

    for (index = 0; index < rows.length; ++index) {

        var Driver = rows[index].Driver
 

        var Address = rows[index].UnitAddress
        var UnitName = rows[index].UnitName
        var CloudiaID = rows[index].CloudiaID

        if(alreadyDone.indexOf(CloudiaID) == -1)
        {
            console.log("Reading : " + UnitName)
            alreadyDone[alreadyDone.length] = CloudiaID
            
            var result = sh.exec(Driver + " " + Address + " R")
            /////////////////////////////////////
            console.log(Driver + " " + Address + " R")
            /////////////////////////////////////
            var splittedStdOutput = result.stdout.split(';')
            
            
            console.log("Executed : " + splittedStdOutput)

            for(i = 0; i < rows.length; ++i){
                if(rows[i].CloudiaID == CloudiaID){

                    if(splittedStdOutput.length > rows[i].Position)
                    {
                        var value = splittedStdOutput[rows[i].Position]
                        console.log("Inserting into database value : " + value + rows[i].MeasureUnit)
                        databaseHelper.setData(connection, value, rows[i].UnitID, 0,  t_Data_insertCallBack)
                    }
                    else
                    {
                        console.log("Missing data")
                    }
                }
           }
        }
    }
}

/**
*
*/
function readAllSensorsInDataBase()
{
    databaseHelper.getSensors(connection, getSensorReadingCallback)
}

/**
*
*/
function sendConfigToWeb(err, rows, fields){
    if (err) {
        throw err;
        console.log("Could not read config table")
    }
    socket.emit('ReceiveConfig', {'row' : rows})
}

/**
*
*/
function drawSeparator(){
    console.log("///////////////////////////////////////////")
}

