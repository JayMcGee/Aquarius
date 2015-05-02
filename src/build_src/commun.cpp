#include "commun.h"
namespace aquarius
{
	const string currentDateTime() 
	{
		time_t     now = time(0);
		struct tm  tstruct;
		char       buf[80];
		tstruct = *localtime(&now);
		// Visit http://en.cppreference.com/w/cpp/chrono/c/strftime
		// for more information about date/time format
		strftime(buf, sizeof(buf), DATE_TIME_OUTPUT, &tstruct);

		return buf;
	}	 
	
	void outputError(string deviceName, string errorName)
    {
        cout << DEVICE_NAME_VAR << deviceName << DATA_OUTPUT_DELIMITER 
                << DATA_QUANTITY << DATA_OUTPUT_DELIMITER << errorName << endl;
    }
    
    void outputReadData(string deviceName, int dataQty, const string dataNames[], const string datas[])
    {
        cout << DEVICE_NAME_VAR << DATA_OUTPUT_DELIMITER 
                << deviceName << DATA_OUTPUT_DELIMITER
                << DATA_QUANTITY << DATA_OUTPUT_DELIMITER 
                << dataQty;
        
        for(int i = 0; i < dataQty; i++)
        {
            cout << DATA_OUTPUT_DELIMITER
                    << dataNames[i] << DATA_OUTPUT_DELIMITER 
                    << datas[i];
        }
        cout << endl;
    }
    
    void outputCommandResult(string deviceName, string message)
    {
        cout << DEVICE_NAME_VAR << DATA_OUTPUT_DELIMITER 
                << deviceName << DATA_OUTPUT_DELIMITER
                << NO_DATA_MESSAGE << DATA_OUTPUT_DELIMITER
                << message << endl;
    }
    
    
    const vector<string> splitArguments(const string& s, const char& c)
    {
    	string buff{""};
    	vector<string> v;
    	
    	for(auto n:s)
    	{
    		if(n != c) buff+=n; else
    		if(n == c && buff != "") { v.push_back(buff); buff = ""; }
    	}
    	if(buff != "") v.push_back(buff);
    	
    	return v;
    }
    
    int i2cCommand(BlackI2C * i2c, string commandTo, int delay, string * returnData)
    {
        uint8_t buffer[32] = {0x00};
        
        i2c->writeLine((uint8_t*)commandTo.c_str(),commandTo.size());
        
        usleep(delay * 100000);
        
        if(i2c->readLine(buffer, sizeof(buffer)))
        {
            returnData->assign((char*)buffer);
    		return (int)buffer[0];
        }
        else
        {
            (*returnData) = I2C_COMMS_ERROR;
        }
    	return 0;
    }
    
    
}
