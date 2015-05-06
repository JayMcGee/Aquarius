
var databaseHelper = require('./aquariusSensorHelper') //External file that helps the connection and querying to the database

if(databaseHelper.StopSIM908()){
    console.log("SIM908 was closed down");
}
else{
    console.log("SIM908 is probably still on");
}

if(databaseHelper.StartSIM908()){
    console.log("SIM908 is on");
}
else{
    console.log("SIM908 is probably still off or not present");
}

databaseHelper.StartGPS();

databaseHelper.GetGPS();

var trys = 0;


setInterval(function(){
    trys ++ ;
    console.log(trys);
    databaseHelper.GetGPS();
}, 1000);