
#define DEVICE "28-000006052315"

#include "OneWireDevice.h"
#include <stdint.h>

using namespace std;


int main(int argc, char * argv[])
{
    int returned = 0;
    string deviceID = DEVICE;
    
    if(argc > 1)
    {
        deviceID.assign(argv[1]);
    }
    
    cout << "Preparing to read in one wire device file at ID : " << deviceID <<  endl;
    
    OneWireDevice ow(deviceID);
    
    cout << "Device created succesfully" << endl;
    
    float temp;
    
    cout << "Path validation..." << endl;
    if(ow.isValidPath())
    {
        cout << "Device path is valid" << endl;
        if(ow.updateTemperature())
        {
            cout << "Temperature updated " << endl;
            if(ow.getLastTemperature(&temp))
            {
                cout << "Current temperature : " << temp << endl;
                returned = 1;
            }
            else
                cout << "Could not retrieve latest temperature" << endl;
        }
        else
            cout << "Could not update temperature" << endl;
    }
    else 
    {
        cout << "Device path is not valid" << endl;
    }
    
    return returned;
}