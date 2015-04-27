var theString = "NAME;PH_001;NODQ;Calibrated at this quantity of points :2"
var first = theString.split(":")[1];

var theSecondeOne = "NAME;PH_001;NODQ;Calibrated at this quantity of points :2"
var seconde = theSecondeOne.split(":")[1];

console.log("First :" + first + " and second :" + seconde)

if(seconde > first){
    console.log("Second is higher than first");
}
else if(first > seconde){
    console.log("First is higher than second");
}
else{
    console.log("It did not work again");
}

