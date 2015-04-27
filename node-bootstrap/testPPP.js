
var sh = require('execSync'); //Permits the execution of external applications synchronously

//sh.exec("pon fona");

var result = sh.exec("ifconfig | grep ppp0");

if(result.stdout.indexOf("ppp0") > -1){
    console.log("It works");
}
else{
    console.log("It does not");
}