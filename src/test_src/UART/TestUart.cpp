// Filename: myUartProject.cpp
// Author:   Yiğit Yüce - ygtyce@gmail.com

#include <iostream>
#include "../BlackLib/BlackLib.h"
#include "../BlackLib/BlackUART.h"

using namespace BlackLib;
using namespace std;

int main()
{
    BlackUART  myUart1(UART1,
                      Baud9600,
                      ParityNo,
                      StopOne,
                      Char8 );
                      
    BlackUART  myUart2(UART2,
                      Baud9600,
                      ParityNo,
                      StopOne,
                      Char8 );
                      
    BlackUART  myUart4(UART4,
                      Baud9600,
                      ParityNo,
                      StopOne,
                      Char8 );
                      
    BlackUART  myUart5(UART5,
                      Baud9600,
                      ParityNo,
                      StopOne,
                      Char8 );
                
    myUart1.open( ReadWrite | NonBlock);
    myUart2.open( ReadWrite | NonBlock);
    myUart4.open( ReadWrite | NonBlock);
    myUart5.open( ReadWrite | NonBlock);
    
    cout << endl;
    cout << "Device Path     : " << myUart1.getPortName() << endl; 
    cout << "Read Buf. Size  : " << myUart1.getReadBufferSize() <<endl;
    cout << "BaudRate In/Out : " << myUart1.getBaudRate(input) << "/"
                                      << myUart1.getBaudRate(output) <<std:: endl;
    cout << "Character Size  : " << myUart1.getCharacterSize() << endl;
    cout << "Stop Bit Size   : " << myUart1.getStopBits() << endl;
    cout << "Parity          : " << myUart1.getParity() <<endl << endl;
    
    cout << endl;
    cout << "Device Path     : " << myUart2.getPortName() << endl; 
    cout << "Read Buf. Size  : " << myUart2.getReadBufferSize() <<endl;
    cout << "BaudRate In/Out : " << myUart2.getBaudRate(input) << "/"
                                      << myUart2.getBaudRate(output) <<std:: endl;
    cout << "Character Size  : " << myUart2.getCharacterSize() << endl;
    cout << "Stop Bit Size   : " << myUart2.getStopBits() << endl;
    cout << "Parity          : " << myUart2.getParity() <<endl << endl;
    
    cout << endl;
    cout << "Device Path     : " << myUart4.getPortName() << endl; 
    cout << "Read Buf. Size  : " << myUart4.getReadBufferSize() <<endl;
    cout << "BaudRate In/Out : " << myUart4.getBaudRate(input) << "/"
                                      << myUart4.getBaudRate(output) <<std:: endl;
    cout << "Character Size  : " << myUart4.getCharacterSize() << endl;
    cout << "Stop Bit Size   : " << myUart4.getStopBits() << endl;
    cout << "Parity          : " << myUart4.getParity() <<endl << endl;
    
    cout << endl;
    cout << "Device Path     : " << myUart5.getPortName() << endl;
    cout << "Read Buf. Size  : " << myUart5.getReadBufferSize() << endl;
    cout << "BaudRate In/Out : " << myUart5.getBaudRate(input) << "/"
                                      << myUart5.getBaudRate(output) << endl;
    cout << "Character Size  : " << myUart5.getCharacterSize() << endl;
    cout << "Stop Bit Size   : " << myUart5.getStopBits() << endl;
    cout << "Parity          : " << myUart5.getParity() << endl << endl;

    std::string testMessage = "This is uart test message.";
    std::string testBeagle = "Hello, Yes This is Beaglebone";
    std::string testTransmission = "";
    
    cout << myUart1.write(testMessage) << endl;
    
    //while(myUart2.read)
    sleep(5);
    
    if((testTransmission = myUart2.read()).
            compare(BlackLib::UART_READ_FAILED) != 0)
    {
      cout << "Message recu : " << testTransmission << endl;
    
      myUart2.write(testBeagle);
    }    
    else
    {
      cout << "Message non recu" << endl;
     
    }
   //myUart >> testMessage;
  // cout << "Message recu :" << endl;
   //cout << testMessage << endl;

    return 0;
}