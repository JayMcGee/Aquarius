#include "DHT_22.h"
#include <iostream>

using namespace std;

int main()
{
    float humidite = 0;
    float temperature = 0;
    
    DHT dht(0, 26);
    
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