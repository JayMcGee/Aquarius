
#define DEVICE "28-000006052315"

#include "../../commun.h"

#include "OneWireDevice.h"
#include <string>
#include <iostream>

#include <unistd.h>
#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>

#define NOM_TEMPORAIRE "ds18b_0001"

using namespace std;

int main(int argc, char * argv[])
{
    int returned = 1;
    string deviceID = DEVICE;
    char * output;
   
    if(argc < 2)
    {
        cout << "Missing arguments, could not execute" << endl
             << "[Executable] [DeviceLocation]" << endl;
        return returned;
    }
    
    deviceID.assign(argv[1]);
    
    aquarius::OneWireDevice ow(deviceID);
    
    float temp;
    
    //cout << "Path validation..." << endl;
    if(ow.isValidPath())
    {
        //cout << "Device path is valid" << endl;
        if(ow.updateTemperature())
        {
            //cout << "Temperature updated " << endl;
            if(ow.getLastTemperature(&temp))
            {
                float datas[1] = { temp };
                aquarius::outputReadData(NOM_TEMPORAIRE, OW_DATA_QTY, ow.dataName, datas);
                return 0;
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

