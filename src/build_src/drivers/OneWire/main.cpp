
#define DEVICE "28-000006052315"

#include "OneWireDevice.h"
#include <stdint.h>
#include <stdlib.h>

#define NOM_TEMPORAIRE "ds18b_0001"
#define DATA_Q "1"
#define DATA_1_NAME "TEMPERATURE"

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
    
    OneWireDevice ow(deviceID);
    
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
                cout << "Current temperature : " << temp << endl;
                sprintf(output, "%s:%s:%s:%s:%s:%f", "NOM", NOM_TEMPORAIRE, "DATQ", DATA_Q, DATA_1_NAME, temp);
                cout << "Current temperature : " << temp << endl;
                returned = 0;
            }
            else
                sprintf(output, "%s:%s:%s:%s", "NOM", NOM_TEMPORAIRE, "DATQ", "OW_NO_DATA");
                //cout << "Could not retrieve latest temperature" << endl;
        }
        else
            sprintf(output, "%s:%s:%s:%s", "NOM", NOM_TEMPORAIRE, "DATQ", "OW_NO_RESPONSE");
            //cout << "Could not update temperature" << endl;
    }
    else 
    {   
        sprintf(output, "%s:%s:%s:%s", "NOM", NOM_TEMPORAIRE, "DATQ", "OW_NO_DEVICE");
        //cout << "Device path is not valid" << endl;
    }
    
    cout << output << endl;
    
    return returned;
}