/**
 * @file   DHT_22.h
 * @author Jean-Philippe Fournier
 * @date   October 19 2014
 * @brief  Defintion of a MMIO operated DHT22 temperature and humidity sensor
 */

#ifndef DHT_22
#define DHT_22


#include "bbb_dht_read.h"


class DHT
{
    private:
        /** GPIO pin base and number **/
        int gpioBase_,
            gpioNumber_;
        
        /** Last measured temperature and humidity data **/
        float lastTemperature_,
              lastHumidity_;
              
        /** Indicates if the data has been updated a the last reading **/
        bool dataUpdated_;
    
    public:
        
        DHT();
        
        /***
         * @brief Constructor that asks for the pin base and number of the DHT22
         * @param base Pin base
         * @param number Pin number
         */
        DHT(int base, int number);
        ~DHT();
        
        /**
         * @brief Updates de DHT22 data
         * @return Returns the same errors as dht_read, like CHECKSUM_ERROR 
         */
        int updateData();
        
        /**
         * @brief Gets the latest updated temperature
         * @param temperature Pointer to the latest temperature
         * @return true if the latest good temperature was read at the last attempt
         */
        bool getLatestTemperature(float * temperature);
        
        /**
         * @brief Gets the latest updated humidity
         * @param humidity Pointer to the latest humidity
         * @return true if the lateste good humidity was read at the last attempt
         */
        bool getLatestHumidity(float * humidity);
};

#endif