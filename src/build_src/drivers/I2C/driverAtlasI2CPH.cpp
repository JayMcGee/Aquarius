#include "../../commun.h"
#include <iostream>
#include "../../../include/blacklib/BlackLib.h"
#include "../../../include/blacklib/BlackI2C.h"

#define I2C_COMMS_ERROR "I2C_COMMS_ERROR"

#define COMMAND_CALIB "Cal"
#define COMMAND_I "I"
#define COMMAND_L "L"
#define COMMAND_R "R"
#define COMMAND_SLEEP "Sleep"
#define COMMAND_STATUS "Status"
#define COMMAND_T "T"
#define COMMAND_X "X"

#define COMMAND_MID "mid"
#define COMMAND_HIGH "high"
#define COMMAND_LOW "low"
#define COMMAND_CLEAR "clear"

#define COMMAND_CALIB_DELAY 13
#define COMMAND_R_DELAY 10

using namespace BlackLib;
using namespace std;

void getStatus(BlackI2C * i2c, string commandTo, int delay, string * returnData);

int main(int argc, char * argv[])
{
    string returnString;
    
    if(argc < 3)
    {
        cout << "Missing arguments, could not execute" << endl
             << "[Executable] [bus:address] [command]" << endl;
        return 1;
    }
    string deviceLocation;
    deviceLocation.assign(argv[1]);
    
    vector<string> v{aquarius::splitArguments(deviceLocation, ':')};
    
    if(v.size() < 2)
    {
        cout << "Not enough I2C location information, must be [bus:address]" << endl;  
        return 1;
    }
    
    BlackLib::i2cName bus;
    
    int bus_number = atoi(v[0].c_str());
    
    if(bus_number == 0)
    {
        bus = BlackLib::I2C_0;
    }
    else if(bus_number == 1)
    {
        bus = BlackLib::I2C_1;
    }
    else
    {
        cout << "I2C bus can be 0 or 1" << endl;  
        return 1;
    }
    
    int address = atoi(v[1].c_str());
    
    if(address > 255 && address <= 0)
    {
        cout << "I2C address must be smaller than 255, and higher or equal to 0" << endl;  
        return 1;
    }
    
    BlackI2C myI2c(bus, address);
    myI2c.open( BlackLib::ReadWrite | BlackLib::NonBlock);
    
    string command;
    command.assign(argv[2]);
    
    vector<string> c{aquarius::splitArguments(command, ':')};
    
    if(c.size() > 1)
    {
        string finalCommand;
        if(c[0].compare(COMMAND_CALIB) == 0)
        {
            if(c.size() > 2 && (c[2].compare(COMMAND_MID) == 0 || c[2].compare(COMMAND_HIGH) == 0 || c[2].compare(COMMAND_LOW) == 0))
            {
                finalCommand = (string)c[0] + "," + c[1] + "," + c[2];
            }
            else
            {
                finalCommand = (string)c[0] + "," + c[1];
            }
            cout << "Final command : " << finalCommand << endl;
            getStatus(&myI2c, finalCommand, COMMAND_CALIB_DELAY, &returnString);
        }
    }
    //Dans le cas d'un reading
    else if(command.compare(COMMAND_R) == 0)
    {
        getStatus(&myI2c, command, COMMAND_R_DELAY, &returnString);
    }
    
    //Outputs designed for each commands
    if(returnString.compare(I2C_COMMS_ERROR) == 0)
    {
        aquarius::outputError("PH", I2C_COMMS_ERROR);
    }
    else if(c[0].compare(COMMAND_CALIB) == 0)
    {
        cout << "Command calibration executed" << returnString << endl;
        
    }
    else if(c[0].compare(COMMAND_R) == 0)
    {
        cout << "Command succesfully executed : " << returnString<< endl;
        string dataName[] = { "PH" };
        float datas[] = { 7.0 };
        aquarius::outputReadData("PH", 1, dataName, datas);
        return 0;
    }
    
    return 1;
}

void getStatus(BlackI2C * i2c, string commandTo, int delay, string * returnData)
{
    uint8_t buffer[32] = {0x00};
    //uint8_t sendBuffer[6] = { 'S', 'T', 'A', 'T', 'U', 'S'};
    //uint8_t sendBuffer[1] = { 'I'};
    //uint8_t sendBuffer[3] = {'K', ',', '?'};
    //uint8_t sendBuffer[3] = {'K', ',', '?'};
    //uint8_t sendBuffer[5] = {'C', 'A', 'L', ',', '?'};
    
    i2c->writeLine((uint8_t*)commandTo.c_str(),commandTo.size());
    
    usleep(delay * 100000);
    
    if(i2c->readLine(buffer, sizeof(buffer)))
    {
        returnData->assign((char*)buffer);
    }
    else
    {
        (*returnData) = I2C_COMMS_ERROR;
    }
}