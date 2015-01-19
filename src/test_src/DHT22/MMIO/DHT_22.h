
#ifndef DHT_22
#define DHT_22


#include "bbb_dht_read.h"

class DHT
{
    private:
        int gpioBase_,
            gpioNumber_;
        
        float lastTemperature_,
              lastHumidity_;
              
        bool dataUpdated_;
    
    public:
        
        DHT();
        DHT(int base, int number);
        ~DHT();
        
        int updateData();
        
        bool getLatestTemperature(float * temperature);
        bool getLatestHumidity(float * humidity);
};

#endif