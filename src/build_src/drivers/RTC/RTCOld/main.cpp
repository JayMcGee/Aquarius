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

bool readBit(int registerAddr, int mask);
bool writeBit(int registerAddr, int mask, bool bit);

int main(int argc, char * argv[])
{
	if(argc < 3)
    {
        cout << "Not enough args" << endl;
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
	
	if(firstCommand.compare("SetDate") == 0)
	{
		
	}
	else if(firstCommand.compare("GetDate") == 0)
	{
		
	}
	else if(firstCommand.compare("SetAlarm") == 0)
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
			else if(type.compare("hr") == 0)
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
	else if(firstCommand.compare("GetAlarm") == 0)
	{
		
	}
	else if(firstCommand.compare("ResetAlarm") == 0)
	{		
		bool isAlarmEnabled = readBit(RTC_ALARM_FLAG_REG, RTC_ALARM_FLAG_POS);
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
				isAlarmEnabled = readBit(RTC_ALARM_FLAG_REG, RTC_ALARM_FLAG_POS);
				cpt++;				
			}while (isAlarmEnabled && cpt < 5);
			cout << "Alarm is now : " << isAlarmEnabled << endl;
		}
	}
	else if(firstCommand.compare("GetAlarm") == 0)
	{
		bool isAlarmEnabled = readRTCMemory(RTC_ALARM_FLAG_REG);
		cout << "Alarm is : " << isAlarmEnabled << endl;
	}
	else if(firstCommand.compare("TestSet") == 0)
	{
		cout << "Set" << endl;
		writeBit(0x0E, 0, 1);
	}
	else if(firstCommand.compare("TestReset") == 0)
	{
		cout << "Reset" << endl;
		writeBit(0x0E, 0, 0);
	}
	else if(firstCommand.compare("GetByte") == 0)
	{
		if(commandSplitted.size() > 1)
			cout << "Byte is at : " << readRTCMemory(atoi(commandSplitted[1].c_str())) << endl;
		else
			cout << "Not enough args " << endl;
	}
	else if(firstCommand.compare("GetBit") == 0)
	{
		if(commandSplitted.size() > 2)
			cout << "Bit is at : " << readBit(atoi(commandSplitted[1].c_str()),atoi(commandSplitted[2].c_str())) << endl;
		else
			cout << "Not enough args " << endl;
		
	}
	else
	{
		cout << "No command " << endl;
	}
	return 1;
}

bool writeRTCMemory(int addr, int reg)
{
	return i2c_->writeByte((u_int8_t)addr, (u_int8_t)reg);
}

int readRTCMemory(int registerAddr)
{
	return (int)i2c_->readByte((u_int8_t)registerAddr);
}

bool readBit(int registerAddr, int mask)
{
	return ((readRTCMemory(registerAddr) >> mask) & 0x01);
}

bool writeBit(int registerAddr, int mask, bool bit)
{
	int data = readRTCMemory(registerAddr);	
	cout << "Before modification : " << data << endl;
	if(bit)
	{
		int temp = 0;
		temp |= (1 << mask);
		data |= temp;
	}
	else
	{
		int temp = 0xFF;
		temp |= (0 << mask);
		data &= temp;
	}
	cout << "After modification : " << data << endl;
	return writeRTCMemory(registerAddr, data);
}