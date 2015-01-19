/**
 * @file   OneWireDevice.h
 * @author Jean-Philippe Fournier
 * @date   October 19 2014
 * @brief  Defintion of a device tree operated temperature one wire sensor
 */

#ifndef ONE_WIRE_H
#define ONE_WIRE_H

/** The final path to be used to access the device files is FILE_PATH + Device ID + END_PATH **/
#define FILE_PATH "/sys/devices/w1_bus_master1/"
#define END_PATH "/w1_slave"

#include "commun.h"

class OneWireDevice
{
    private:
        
        /** The device file path */
        string filePath_;
        /** The last temperature read in the device file */
        float lastTemperature_;
        /** Has the value been updated */
        bool hasUpdated_;
        /** Is the file path still valid */
        bool hasValidPath_;
        
        /**
         *  @brief  Automatically creates a file path
         *  @param  deviceID    the device ID to include in the final path
         *  @return the file path in string
         */
        string createFilePath(string deviceID);
        
    public:
    
        /**
         * @brief Default constructor, calling this will build the device object 
         *        with a default device ID
         */
        OneWireDevice();
        
        /**
         * @brief Constructor that asks for a string deviceID. This device ID is its
         *        driver ID int the /sys/devices/w1_bus_master1/ directory
         * @param deviceID The OneWire device ID
         */
        OneWireDevice(string deviceID);
        
        ~OneWireDevice();
        
        /**
         *  @brief  Updates the memory stored temperature by reading the device file 
         *  @return true if reading the file has succeeded
         */
        bool updateTemperature();
        
        /**
         *  @brief  Verify the current listed device path is still valid
         *  @return true if the path of the file is still valid
         */
        bool isValidPath();
        
        /**
         *  @brief  Get the latest temperature read on the device file
         *  @param temperature pointer in which the last read value will be put
         *  @return true if the pointer was updated with a valid, new value
         */
        bool getLastTemperature(float * temperature);
};

#endif
