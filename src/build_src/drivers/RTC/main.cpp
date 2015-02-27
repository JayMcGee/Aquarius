#include "../../commun.h"
#include <iostream>
#include "../../../include/blacklib/BlackLib.h"
#include "../../../include/blacklib/BlackI2C.h"

#define RTC_ADD 0x68

#define RTC_ALARM_SEC_REG 0x07
#define RTC_ALARM_MIN_REG 0x08
#define RTC_ALARM_HOUR_REG 0x09
#define RTC_ALARM_DAY_REG 0x0A

#define RTC_ALARM_DATA_MASK 0x0F

#define RTC_ALARM_FLAG_REG 0x0F
#define RTC_ALARM_FLAG_POS 0

using namespace std;
using namespace BlackLib;

BlackI2C * i2c_;

bool writeRTCMemory(int powerCtl_Addr, int powerCtlReg);
int readRTCMemory(int registerAddr);

bool getBit(int registerAddr, int mask);

int main(int argc, char * argv[])
{
	if(argc < 3)
    {
        cout << aquarius::Atlas_I2C::output_missingArguments() << endl;
        return 1;
    }
    string deviceLocation;
    deviceLocation.assign(argv[1]);
    
    vector<string> deviceLocationSplitted{aquarius::splitArguments(deviceLocation, ':')};
    
    if(deviceLocationSplitted.size() < 2)
    {
        cout << "Not enough I2C location information, must be [bus:address]" << endl;  
        return 1;
    }
    
    BlackLib::i2cName bus;
    
    int bus_number = atoi(deviceLocationSplitted[0].c_str());
    
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
    
    int address = atoi(deviceLocationSplitted[1].c_str());
    
    if(address > 255 && address <= 0)
    {
        cout << "I2C address must be smaller than 255, and higher or equal to 0" << endl;  
        return 1;
    }
	
	i2c_ = new BlackI2C(bus, address);
	
	string command;
    command.assign(argv[2]);    
    vector<string> commandSplitted{aquarius::splitArguments(command, ':')};
	string firstCommand = commandSplitted[0];
	
	if(firstCommand.compare("SetDate"))
	{
		
	}
	else if(firstCommand.compare("GetDate"))
	{
		
	}
	else if(firstCommand.compare("SetAlarm"))
	{
		if(commandSplitted.size() > 2)
		{
			string type, value;
			type = commandSplitted[1];
			value = commandSplitted[2];
			
			int valueToWrite = stoi(value);
			
			bool result;
			if(type.compare("min") == 0)
			{
				result = writeRTCMemory(RTC_ALARM_SEC_REG, valueToWrite);
			}
			else if(type.compare("sec") == 0)
			{
				result = writeRTCMemory(RTC_ALARM_MIN_REG, valueToWrite);
			}
			else if(type.command("hr") == 0)
			{
				result = writeRTCMemory(RTC_ALARM_HOUR_REG, valueToWrite);
			}
			else				
			{
				aquarius::outputError("RTC", BAD_PARAMS);
				return 1;
			}
		}
		else
		{
			aquarius::outputError("RTC", NOT_ENOUGH_PARAMS);
			return 1;
		}
	}
	else if(firstCommand.compare("GetAlarm"))
	{
		
	}
	else if(firstCommand.compare("ResetAlarm"))
	{		
		bool isAlarmEnabled = getBit(RTC_ALARM_FLAG_REG, RTC_ALARM_FLAG_POS);
		if(!isAlarmEnabled)
		{
			cout << "Alarm is currently at false" << endl;
		}
		else
		{
			int cpt = 0;
			do{
				cout << "trying to set as false" << endl;
				writeBit(RTC_ALARM_FLAG_REG, RTC_ALARM_FLAG_POS, false);
				isAlarmEnabled = getBit(RTC_ALARM_FLAG_REG, RTC_ALARM_FLAG_POS);
				cpt++;				
			}while (isAlarmEnabled && cpt < 5);
			cout << "Alarm is now : " << isAlarmEnabled << endl;
		}
	}
	else if(firstCommand.compare("GetAlarm"))
	{
		bool isAlarmEnabled = readRTCMemory(RTC_ALARM_FLAG_REG, RTC_ALARM_FLAG_POS);
		cout << "Alarm is : " << isAlarmEnabled << endl;
	}
	
	return 1;
}

bool writeRTCMemory(int powerCtl_Addr, int powerCtlReg)
{
	return i2c_->writeByte((u_int8_t)powerCtl_Addr, (u_int8_t)powerCtlReg);
}

int readRTCMemory(int registerAddr)
{
	return (int)i2c_->readByte((u_int8_t)registerAddr);
}

bool getBit(int registerAddr, int mask)
{
	return ((readRTCMemory(registerAddr) >> mask) & 0x01);
}

bool writeBit(int registerAddr, int mask, bool bit)
{
	int data = readRTCMemory(registerAddr);	
	data = data | ((int)bit << mask);	
	return writeRTCMemory(registerAddr, data);
}