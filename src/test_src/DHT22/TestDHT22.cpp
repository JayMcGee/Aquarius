// Filename: myUartProject.cpp
// Author:   Yiğit Yüce - ygtyce@gmail.com

#include <iostream>
#include "../BlackLib/BlackLib.h"
#include "dht22.h"

using namespace BlackLib;
using namespace std;

int main()
{
    DHT22 capteur(BlackGPIO(BlackLib::GPIO_35, BlackLib::bothDirection , BlackLib::FastMode));
    
    
    cout << "Capteur crée, prêt a tester" << endl;
    sleep(2);
    
    while(1)
    {
        
        if(capteur.readDHT22() == 0)
        {
        
        
            cout << "Température : " << capteur.getLatestTemperature() << endl;
            cout << "Humidité : " << capteur.getLatestHumidity() << endl;
            
           
        }
        else
        {
            cout << "Trouble de communication";
            
        }
        sleep(2);
    }
    
    
    
    return 0;
}