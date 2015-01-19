#include "OneWireDevice.h"

bool exists_test(string name) {
    ifstream f(name);
    if (f.good()) {
        f.close();
        return true;
    } else {
        f.close();
        return false;
    }   
}

OneWireDevice::OneWireDevice()
{
    // Create file path with a default deviceID
    filePath_ = createFilePath("28-000006052315");
    
    //If the file path exists
    if(exists_test(filePath_))
        hasValidPath_ = true;
    else
        hasValidPath_ = false;
        
    hasUpdated_ = false;
    lastTemperature_ = 0.0f;
}

OneWireDevice::OneWireDevice(string deviceID)
{
    //Create file path with the included deviceID
    filePath_ = createFilePath(deviceID);
    if(exists_test(filePath_))
        hasValidPath_ = true;
    else
        hasValidPath_ = false;
        
    hasUpdated_ = false;
    lastTemperature_ = 0.0f;
}

OneWireDevice::~OneWireDevice()
{
    
}

string OneWireDevice::createFilePath(string deviceID)
{
    return FILE_PATH + deviceID + END_PATH;
}
    
bool OneWireDevice::updateTemperature()
{
    if(hasValidPath_)
    {
        //input file stream to read in the device file
        ifstream onewireFin(filePath_);
    
        string data = "";
        
        string temp = "";
        
        //Read all the lines in the file
        while(onewireFin.good())
        {
            onewireFin >> temp;
            
            data += temp;
        }
        
        temp = data;
        
        size_t found = temp.find_last_of('=');
        
        //If the data includes a '=', substring and cast to float, divided by 1000 to get Celsius
        if(found != string::npos)
        {
            data = temp.substr(found + 1);
            
            lastTemperature_ = stof(data) / 1000;
            
            return(hasUpdated_ = true);
        }
        else
        {
            return (hasUpdated_ = false);
        }
    }
    return false;
}

bool OneWireDevice::isValidPath()
{
    return (hasValidPath_ = exists_test(filePath_));
}
        
bool OneWireDevice::getLastTemperature(float * temperature)
{
    if(hasUpdated_)
    {
        *temperature = lastTemperature_;
    }
    return hasUpdated_;
}