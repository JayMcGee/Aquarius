/**
 * @file   main.cpp
 * @author Jean-Philippe Fournier
 * @date   Febuary 13 2015
 * @brief  main driver executable for the One wire maxim Ds18b20 device
 * @modified April 10 2015
 * @brief Added error management, to deal with 85 degrees C
 */
 
 //Temporary ID for easy recall of the value, DEV only
#define DEVICE "28-000006052315"

#include "../../commun.h"
#include "OneWireDevice.h"
#include <string>
#include <iostream>

//TO BE VERIFIED 
#include <unistd.h>
#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>

//TO BE REMOVED, TEMPORARY Until name given by command line arguments
#define NOM_TEMPORAIRE "ds18b_0001"

using namespace std;

/**
 * @brief Output the missing arguments phrase for help
 * @return A string that explains the minimum args for the driver to work
 */
string OW_output_missingArguments();

int main(int argc, char * argv[])
{ 
    //floating points to contain read temperature
    float temp;
	//Check for missing arguments, if missing, skip execution and let caller know
    if(argc < OW_MIN_ARGS)
    {
        cout << OW_output_missingArguments() << endl;
        return 1;
    }
	
	//Extract device location from arguments
    string deviceID;
    deviceID.assign(argv[OW_ARG_LOCATION_POS]);
    
	//Create the One Wire device object
    aquarius::OneWireDevice ow(deviceID);
    
    //Path validation...
    if(ow.isValidPath())
    {
        //Device path is valid
        if(ow.updateTemperature())
        {
            //Temperature updated
            if(ow.getLastTemperature(&temp))
            {
                if(temp == 85.0f)
                {
                    aquarius::outputError(NOM_TEMPORAIRE, OW_DEVICE_NOT_READY);
                    return 1;
                }
                else
                {
                    //Create an output stream with read data
                    float datas[OW_DATA_QTY] = { temp };
                    aquarius::outputReadData(NOM_TEMPORAIRE, OW_DATA_QTY, ow.dataName, datas);
                    return 0;
                }
				
            }
            else
                aquarius::outputError(NOM_TEMPORAIRE, "OW_NO_DATA");
        }
        else
            aquarius::outputError(NOM_TEMPORAIRE, "OW_NO_RESPONSE");
    }
    else  
        aquarius::outputError(NOM_TEMPORAIRE, "OW_NO_DEVICE");
        
    return 1;
}

string OW_output_missingArguments()
{
	return "Missing arguments, could not execute \n\r [Executable] [DeviceLocation] ex: ./driverName 28-000006052315";
}
