#include "DHT_22.h"

#define DHT_SENSOR 22

DHT::DHT()
{
    gpioBase_ = 1;
    gpioNumber_ = 13;
    
    lastTemperature_ = 255;
    lastHumidity_ = 255;
    
    dataUpdated_ = false;
}

DHT::DHT(int base, int number)
{
    gpioBase_ = base;
    gpioNumber_ = number;
    
    lastTemperature_ = 255;
    lastHumidity_ = 255;
    
    dataUpdated_ = false;
}

DHT::~DHT()
{
    
}
    
int DHT::updateData()
{
    //Uses a reading from the Adafruit_DHT library
    int retour = bbb_dht_read(DHT_SENSOR, gpioBase_, gpioNumber_, 
                                    &lastHumidity_, &lastTemperature_);
    if(retour >= 0)
        dataUpdated_ = true;
    else
        dataUpdated_ = false;
        
    return retour;
}

bool DHT::getLatestTemperature(float * temperature)
{
    *temperature = lastTemperature_;
    return dataUpdated_;
}

bool DHT::getLatestHumidity(float * humidity)
{
    *humidity = lastHumidity_;
    return dataUpdated_;    
}

