#include "SIM.h"

SIM900::SIM900(BlackUART * port)
{
    port_ = (*port);
}

void SIM900::getState()
{
    cout << endl;
    cout << "Device Path     : " << port_.getPortName() << endl; 
    cout << "Read Buf. Size  : " << port_.getReadBufferSize() <<endl;
    cout << "BaudRate In/Out : " << port_.getBaudRate(input) << "/"
                                      << port_.getBaudRate(output) <<std:: endl;
    cout << "Character Size  : " << port_.getCharacterSize() << endl;
    cout << "Stop Bit Size   : " << port_.getStopBits() << endl;
    cout << "Parity          : " << port_.getParity() <<endl << endl;
 
}

SIM900::~SIM900()
{
}