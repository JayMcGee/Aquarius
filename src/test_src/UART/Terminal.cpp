
#include <iostream>
#include "../BlackLib/BlackLib.h"
#include "../BlackLib/BlackUART.h"
#include <string>

#include <sys/types.h>
#include <unistd.h>
#include <sys/wait.h>
#include <stdlib.h>
#include <pthread.h>
#include <signal.h>
#include <queue>
#include <stdexcept>      // std::invalid_argument

#define ERASE effacerTerminal()

using namespace std;
using namespace BlackLib;

queue<char> input,
       		output;

pthread_t threadReceive,
		  threadSend;
		  
bool hasReceived,
     hasToSend;
     
BlackUART * uart;
     
void effacerTerminal();
BlackUART * getConfiguratedPort(int uartNumber, int uartSpeed);

int main(int argc, char * argv[])
{
    string userInput;
    
    bool inputVerified = false;
    
    int selectedUART;
    int selectedBaudRate;
    
    ERASE;
    
    cout << "Terminal starting up...." << endl;
    
    while(inputVerified == false)
    {
        
        try
        {
            cout << "Please select which UART you want to use (1..4) : ";
             
                 
            cin >> userInput;
            
            selectedUART = stoi(userInput); 
            
            inputVerified = true;
        }
        catch (const std::invalid_argument& ia)
        {
            ERASE;
            
            cout << "Input a selection between 1 and 4" << endl;
        }
       
    }
    
    inputVerified = false;
    
    cout << "Your selection : " << selectedUART << endl;
    
    if(selectedUART < 5 && selectedUART > 0)
    {
        ERASE;
        
        cout << "Select baud rate :" << endl
             << "1) 9600 baud" << endl
             << "2) 38400 baud" << endl
             << "3) 115200 baud" << endl;
             
        cout << "Enter 1-3 : ";
        
        cin >> userInput;
        
        selectedBaudRate = stoi(userInput);
        
        cout << "Your selection : " << selectedBaudRate << endl;
        
        uart = getConfiguratedPort(selectedUART, selectedBaudRate);
    }

    return 1;
}

BlackUART * getConfiguratedPort(int uartNumber, int uartSpeed)
{
    uartName uartN;
    baudRate baudR;
    
    switch(uartNumber)
    {
        case 1:
            uartN = UART1;
            break;
        case 2:
            uartN = UART2;
            break;
        case 3:
            uartN = UART4;
            break;
        case 4:
            uartN = UART5;
            break;
    }
    
    switch(uartSpeed)
    {
        case 1:
            baudR = Baud9600;
            break;
        case 2:
            baudR = Baud38400;
            break;
        case 3:
            baudR = Baud115200;
            break;
    }
    
    BlackUART * myUart1 = new BlackUART(uartN, baudR, ParityNo, StopOne, Char8 );
                      
    return myUart1;                      
}


int receive()
{

	return 1;
}

int send()
{

	return 0;
}

void effacerTerminal()
{
    cout << "\033[2J\033[;H";
}