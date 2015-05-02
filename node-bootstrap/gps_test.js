
var databaseHelper = require('./aquariusSensorHelper') //External file that helps the connection and querying to the database

if(databaseHelper.GPSOnBootCheckUp()){
    console.log("SIM908 was closed down");
}
else{
    console.log("SIM908 is probably still on");
}

if(databaseHelper.BootUpAndSetUpSIM908()){
    console.log("SIM908 is on");
}
else{
    console.log("SIM908 is probably still off or not present");
}

databaseHelper.StartGPS();

databaseHelper.GetGPS();