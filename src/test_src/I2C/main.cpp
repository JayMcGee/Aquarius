// Filename: myUartProject.cpp
// Author:   Yiğit Yüce - ygtyce@gmail.com

#include <iostream>
#include <unistd.h>
#include <string.h>
#include "../BlackLib/BlackLib.h"
#include "../BlackLib/BlackI2C.h"

#define ADDRESS_CON 0x64
#define ADDRESS_PH 0x63
#define ADDRESS_DO 0x61

#define BEAGLE_ADDRESS 0x53

using namespace BlackLib;
using namespace std;

void getStatus(BlackI2C * i2c, int address, string commandTo,  int delay);

int main(int argc, char * argv[])
{    
    int delay = 3;
    int address = 0x64;
    string command = "STATUS";
    
    if(argc > 1)
    {
        address = atoi(argv[1]);
    }
    if(argc > 2)
    {
        command.assign(argv[2]);
    }
    if(argc > 3)
    {
        delay = atoi(argv[3]);
    }
    
//cout << address << ";" << command << ";" << delay << endl;
    
    BlackI2C  myI2c(BlackLib::I2C_1, ADDRESS_CON);
    
    myI2c.open( BlackLib::ReadWrite | BlackLib::NonBlock);
    
    
    cout << "Retour de conductivité : " << endl;
    getStatus(&myI2c, ADDRESS_CON, command, delay);
    cout << "Retour de pH : " << endl;
	getStatus(&myI2c, ADDRESS_PH, command, delay);
	cout << "Retour de DO : " << endl;
	getStatus(&myI2c, ADDRESS_DO, command, delay);
    
    return 0;
}

void getStatus(BlackI2C * i2c, int address, string commandTo, int delay)
{
    uint8_t buffer[32] = {0x00};
    //uint8_t sendBuffer[6] = { 'S', 'T', 'A', 'T', 'U', 'S'};
    //uint8_t sendBuffer[1] = { 'I'};
    //uint8_t sendBuffer[3] = {'K', ',', '?'};
    //uint8_t sendBuffer[3] = {'K', ',', '?'};
    //uint8_t sendBuffer[5] = {'C', 'A', 'L', ',', '?'};
    
    i2c->setDeviceAddress(address);
    
    i2c->writeLine((uint8_t*)commandTo.c_str(),commandTo.size());
    
    usleep(delay * 100000);
    
    if(i2c->readLine(buffer, sizeof(buffer)))
    {
        for(int i = 0; i < 32; i++)
        {
            cout << (char)buffer[i]<< " " ;
            
        }
        cout << endl;
    }
    else
    {
        cout << "Erreur de communication I2C" << endl;
    }
}