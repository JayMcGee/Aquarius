#include "bbb_dht_read.h"
#include <iostream>

using namespace std;

int main()
{
    int sensor = 22;
    float humidite = 0;
    float temperature = 0;
    
    int base = 1;
    int number = 12;
    
    int retour = 0;
    
    cout << "Démarrage du test de DHT22" << endl;
    cout << "Communication avec le DHT22 débutée" << endl;
    
    while(1)
    {
        retour = bbb_dht_read(sensor, base, number, &humidite, &temperature);
    
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
            
            cout << "Température : " << temperature << " et humidité : " << humidite << endl;
        }
        else
        {   
             cout << "Erreur no. : " << retour << endl;
        }
        sleep(2);
    }
    return 0;
}