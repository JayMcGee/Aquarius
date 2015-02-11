#include "dht22Device.h"
#include <string.h>
#include <iostream>
#include <unistd.h>
#include <stdlib.h>
#include <vector>

using namespace std;

//string stringify(int argc, char ** argv);
const vector<string> explode(const string& s, const char& c);

int main(int argc, char ** argv)
{
    float humidite = 0;
    float temperature = 0;
    
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
    
    cout << "Emplacement : " << deviceLocation << endl
         << "Commande : " << command << endl;
    
    vector<string> v{explode(deviceLocation, ':')};
    int high = atoi((v[0].c_str())), low = atoi((v[1].c_str()));
    DHT dht(high, low);
    
    
    int retour = 0;
    
    cout << "Démarrage du test de DHT22" << endl;
    cout << "Communication avec le DHT22 débutée" << endl;
    
    while(1)
    {
        retour = dht.updateData();
    
        if(retour == DHT_ERROR_TIMEOUT)
        {
            cout << "Erreur de timeout" << endl;
        }
        else if(retour == DHT_ERROR_CHECKSUM)
        {
            cout << "Erreur de checksum" << endl;
        }
        else if(retour >= 0)
        {   
            if(dht.getLatestTemperature(&temperature) && dht.getLatestHumidity(&humidite))
                cout << "Température : " << temperature << " et humidité : " << humidite << endl;
            else
                cout << "Data not updated" << endl;
        }
        else
        {   
             cout << "Erreur no. : " << retour << endl;
        }
        sleep(2);
    }
    
    return 0;
}
/*
std::string[] stringify(int argc, char ** argv)
{
    std::string args[argc];
    
	return args;
}*/

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