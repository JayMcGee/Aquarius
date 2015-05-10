#include "commun.h"
namespace aquarius
{
    /*
    *   @brief Function that gives out the current systeme date and time
    *   @return Gives back a date time formatted to the system constant DATE_TIME_OUTPUT
    */
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
	
    /**
     * @brief Output an error message
     * @details Outputs an error message for the given device and error name
     * 
     * @param deviceName Device name
     * @param errorName Error message or name
     */
	void outputError(string deviceName, string errorName)
    {
        cout << DEVICE_NAME_VAR << deviceName << DATA_OUTPUT_DELIMITER 
                << DATA_QUANTITY << DATA_OUTPUT_DELIMITER << errorName << endl;
    }
    
    /**
     * @brief Output read data in common aquarius format
     * @details Outputs data in the common aquarius format to be read by the main service
     * 
     * @param deviceName Device name
     * @param dataQty Number of values to output
     * @param dataNames Name of the values to output
     * @param datas Values to output
     */
    void outputReadData(string deviceName, int dataQty, const string dataNames[], const string datas[])
    {
        cout << DEVICE_NAME_VAR << DATA_OUTPUT_DELIMITER 
                << deviceName << DATA_OUTPUT_DELIMITER
                << DATA_QUANTITY << DATA_OUTPUT_DELIMITER 
                << dataQty;
        
        //For each data in datas and each name in dataNames, output the name and value
        for(int i = 0; i < dataQty; i++)
        {
            cout << DATA_OUTPUT_DELIMITER
                    << dataNames[i] << DATA_OUTPUT_DELIMITER 
                    << datas[i];
        }
        cout << endl;
    }
    
    /**
     * @brief Output a command result
     * @details Outputs a command execution result to be read by the main service
     * 
     * @param deviceName Device name
     * @param message Command message
     */
    void outputCommandResult(string deviceName, string message)
    {
        cout << DEVICE_NAME_VAR << DATA_OUTPUT_DELIMITER 
                << deviceName << DATA_OUTPUT_DELIMITER
                << NO_DATA_MESSAGE << DATA_OUTPUT_DELIMITER
                << message << endl;
    }
    
    /**
     * @brief Split read arguments
     * @details Splits read arguments from devices using a parameter to split
     * 
     * @param s Read string to split
     * @param c Character to split to
     * 
     * @return Vector containing each value that was separated by parameter c
     */
    const vector<string> splitArguments(const string& s, const char& c)
    {
    	string buff{""};
    	vector<string> v;
    	
        //For each n in s
    	for(auto n:s)
    	{
    		if(n != c) buff+=n; else
    		if(n == c && buff != "") { v.push_back(buff); buff = ""; }
    	}
    	if(buff != "") v.push_back(buff);
    	
    	return v;
    }
    
    /**
     * @brief Function that executes a command on the i2c, waiting the delay for an answer to be put in return
     * @param i2c           I2C object that will point to the good i2c bus
     * @param commandTo     Command to send to the device
     * @param delay         Delay before looking for an answer
     * @param returnData    Pointer to the returned data buffer
     * @return 
     */
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
