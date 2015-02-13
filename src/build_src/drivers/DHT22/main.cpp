#include "dht22Device.h"
#include <string.h>
#include <iostream>
#include <unistd.h>
#include <stdlib.h>
#include <stdio.h>
#include <vector>

#define NOM_TEMPORAIRE "dht22_0001"
#define DATA_Q "2"
#define DATA_1_NAME "TEMPERATURE"
#define DATA_2_NAME "HUMIDITY"

using namespace std;

//string stringify(int argc, char ** argv);
const vector<string> explode(const string& s, const char& c);

int main(int argc, char ** argv)
{
    float humidite = 0;
    float temperature = 0;
    
    string outputData;
    char * output;
    
    if(argc < 3)
    {
        cout << "Missing arguments, could not execute" << endl
             << "[Executable] [DeviceLocation] [Command]" << endl;
        return 1;
    }
    
    string deviceLocation;
    deviceLocation.assign(argv[1]);
    
    string command;
    command.assign(argv[2]);
    
    vector<string> v{explode(deviceLocation, ':')};
    
    int high = atoi((v[0].c_str())), low = atoi((v[1].c_str()));
    
    DHT dht(high, low);
    
    int retour = -128;
    
    retour = dht.updateData();
    
    if(dht.getLatestTemperature(&temperature) && dht.getLatestHumidity(&humidite) && retour >= 0)
    {
        sprintf(output, "%s:%s:%s:%s:%s:%f:%s:%f", "NOM", NOM_TEMPORAIRE, "DATQ", DATA_Q, DATA_1_NAME,temperature, DATA_2_NAME,humidite);
    }
    else if(retour == DHT_ERROR_TIMEOUT)
    {
        sprintf(output, "%s:%s:%s:%s", "NOM", NOM_TEMPORAIRE, "DATQ", "DHT_ERROR_TIMEOUT");
    } 
    else if(retour == DHT_ERROR_CHECKSUM)
    {
        sprintf(output, "%s:%s:%s:%s", "NOM", NOM_TEMPORAIRE, "DATQ", "DHT_ERROR_CHECKSUM");
    }
    else
    {
        sprintf(output, "%s:%s:%s:%s", "NOM", NOM_TEMPORAIRE, "DATQ", "DHT_UNKNOWN_ERROR");
    }
    
    cout << output << endl;
    
    return 0;
}

const vector<string> explode(const string& s, const char& c)
{
	string buff{""};
	vector<string> v;
	
	for(auto n:s)
	{
		if(n != c) buff+=n; else
		if(n == c && buff != "") { v.push_back(buff); buff = ""; }
	}
	if(buff != "") v.push_back(buff);
	
	return v;
}