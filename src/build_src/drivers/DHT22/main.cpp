/**
 * @file   main.cpp
 * @author Jean-Philippe Fournier
 * @date   Febuary 13 2015
 * @brief  Main driver executable file. Driver that asks for input on the location of the DHT22 device on the GPIOs
 */
#include "../../commun.h"
#include "dht22Device.h"
#include <string>
#include <iostream>

//Temporary naming of the device, until the device is given by command line arguments
//TO BE REMOVED
#define NOM_TEMPORAIRE "dht22_0001"

using namespace std;
/**
 * @brief Output the missing arguments phrase for help
 * @return A string that explains the minimum args for the driver to work
 */
string DHT_output_missingArguments();

int main(int argc, char ** argv)
{
	//floating points to contain read temperature an humidity
    float humidity = 0;
    float temperature = 0;
    
	//Check for missing arguments, if missing, skip execution and let caller know
    if(argc < DHT_MIN_ARGS)
    {
        cout << DHT_output_missingArguments() << endl;
        return 1;
    }
    
	//String to contain de the device location arguments
    string deviceLocation;
    deviceLocation.assign(argv[DHT_ARG_LOCATION_POS]);
    
	//Split the arguments with : as delimiter
    vector<string> v{aquarius::splitArguments(deviceLocation, ':')};
    
	//Get both parameters to build DHT device object
    int high = atoi((v[0].c_str())), 
		low = atoi((v[1].c_str()));
    
	//Build DHT device object with both parameters
    aquarius::DHT dht(high, low);
    
	//Init a return value for the reading function    
    int retour = dht.updateData();
    
	//If returned data was good, and the device responded with data
    if(dht.getLatestTemperature(&temperature) && dht.getLatestHumidity(&humidity) && retour >= 0)
    {
		//Create an output stream with both read datas
        float datas[DHT_DATA_QTY] = { temperature, humidity };
        aquarius::outputReadData(NOM_TEMPORAIRE, DHT_DATA_QTY, dht.dataName, datas);
        return 0;
    }
	//If returned data was a timeout error
    else if(retour == DHT_ERROR_TIMEOUT)
    {
        aquarius::outputError(NOM_TEMPORAIRE, "DHT_ERROR_TIMEOUT");
    } 
	//If returned data was a checksum error
    else if(retour == DHT_ERROR_CHECKSUM)
    {
        aquarius::outputError(NOM_TEMPORAIRE, "DHT_ERROR_CHECKSUM");
    }
	//In other cases that are not good
    else
    {
        aquarius::outputError(NOM_TEMPORAIRE, "DHT_UNKNOWN_ERROR");
    }    
    return 1;
}

string DHT_output_missingArguments()
{
	return "Missing arguments, could not execute \n\r [Executable] [DeviceLocation] ex: ./driverName 1:14";
}

