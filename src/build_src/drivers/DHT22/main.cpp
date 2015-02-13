#include "../../commun.h"
#include "dht22Device.h"
#include <string>
#include <iostream>

#define NOM_TEMPORAIRE "dht22_0001"

using namespace std;

int main(int argc, char ** argv)
{
    float humidity = 0;
    float temperature = 0;
    
    string outputData;
    char * output;
    
    if(argc < 2)
    {
        cout << "Missing arguments, could not execute" << endl
             << "[Executable] [DeviceLocation] [Command]" << endl;
        return 1;
    }
    
    string deviceLocation;
    deviceLocation.assign(argv[1]);
    
    vector<string> v{aquarius::splitArguments(deviceLocation, ':')};
    
    int high = atoi((v[0].c_str())), low = atoi((v[1].c_str()));
    
    aquarius::DHT dht(high, low);
    
    int retour = -128;
    
    retour = dht.updateData();
    
    if(dht.getLatestTemperature(&temperature) && dht.getLatestHumidity(&humidity) && retour >= 0)
    {
        float datas[2] = { temperature, humidity };
        aquarius::outputReadData(NOM_TEMPORAIRE, DHT_DATA_QTY, dht.dataName, datas);
        return 0;
    }
    else if(retour == DHT_ERROR_TIMEOUT)
    {
        aquarius::outputError(NOM_TEMPORAIRE, "DHT_ERROR_TIMEOUT");
    } 
    else if(retour == DHT_ERROR_CHECKSUM)
    {
        aquarius::outputError(NOM_TEMPORAIRE, "DHT_ERROR_CHECKSUM");
    }
    else
    {
        aquarius::outputError(NOM_TEMPORAIRE, "DHT_UNKNOWN_ERROR");
    }
    
    return 1;
}
