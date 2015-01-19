/**
* 	File : bbb_one_wire.c
*	Creator : Jean-Philippe Fournier
*	Based upon : http://www.maximintegrated.com/en/app-notes/index.mvp/id/126
*				 and https://github.com/adafruit/Adafruit_Python_DHT
*	Description : Library used to read one wire devices on a BeagelBone Black using
*				  logic from MaximIntegrated and utilities by Adafruit
*	
*	Date : October 13, 2014
**/
#include "bbb_one_wire.h"

int 	A = 6,
	B = 64,
	C = 60,
	D = 10,
	E = 9,
	F = 55,
	G = 0,
	H = 480,
	I = 70,
	J = 410;
	
int gpioBase_;
int gpioNumber_;
gpio_t pin_;


/**
 * 
* @brief Pauses for exactly 'tick' number of ticks = 1us. Platform specific, in this
*		 case, for the BBB on Linux, implemented using bbb_mmio.h
* @param tick Number of ticks to wait
*/
void tickDelay(int tick)
{
	busy_wait_useconds(tick);
}

/**
*	@brief Reads temperature on a ds1820 temperature sensor
*	@param gpio_base The base number of the gpio pin used
*	@param gpio_number The number of the gpio pin used
*/
void bbb_one_wire_setup(int gpio_base, int gpio_number)
{
	gpioBase_ = gpio_base;
	gpioNumber_ = gpio_number;
	
	cout << "GPIO base : " << gpioBase_ << " and number : " << gpioNumber_ << endl;
	
	A = 6;
	B = 64;
	C = 60;
	D = 10;
	E = 9;
	F = 55;
	G = 0;
	H = 480;
	I = 70;
	J = 410;
	
	cout << "Getting GPIO pin for OneWire operation ... " << endl;
	
	if(bbb_mmio_get_gpio(gpioBase_, gpioNumber_, &pin_) == MMIO_SUCCESS)
	{
	        cout << "Pin configuration successful " << endl;  
	}
	else
	{
	        cout << "Pin configuration failed " << endl;
	}
	
}

/**
*	@brief Reads temperature on a ds1820 temperature sensor
*	@param temperature Pointer to the measured temperature
*	@return 0 if temperature read successfully
*/
int bbb_one_wire_DS1820_read(float* temperature, string* data)
{
        /*
        int get[10];
        char temp_lsb,temp_msb;
        int k;
        char temp_f,temp_c;
        
        OWTouchReset();
        
        OWWriteByte(0xCC); //Skip ROM
        OWWriteByte(0x44); // Start Conversion
        
        tickDelay(5);
        
        OWTouchReset();
        
        OWWriteByte(0xCC); // Skip ROM
        OWWriteByte(0xBE); // Read Scratch Pad
        
        for (k=0;k<9;k++)
        {
                get[k] = OWReadByte();
        }
        
        cout << "ScratchPAD DATA = " << get[8] << get[7] << get[6] << get[5] << get[4] << get[3] << get[2] << get[1] << get[0] << endl;
        
        temp_msb = get[1]; // Sign byte + lsbit
        temp_lsb = get[0]; // Temp data plus lsb
        
        if (temp_msb <= 0x80)
        {
                temp_lsb = (temp_lsb/2);
                
        } // shift to get whole degree
        temp_msb = temp_msb & 0x80; // mask all but the sign bit
        if (temp_msb >= 0x80) 
        {
                temp_lsb = (~temp_lsb)+1;
                
        } // twos complement
        if (temp_msb >= 0x80) 
        {
                temp_lsb = (temp_lsb/2);
                
        }// shift to get whole degree
        if (temp_msb >= 0x80) 
        {
                temp_lsb = ((-1)*temp_lsb);
                
        } // add sign bit
        //cout << "TempC= " << (int)temp_lsb << " degrees C" << endl;// print temp. C
        
        *temperature = (int)temp_lsb;
        
        return 1;
        */
        
	int i = 0;	
	int a = 1;
	unsigned short dataCRC16;
	
	OWTouchReset();
	
	OWWriteByte(SKIP_ROM);
	OWWriteByte(CONVERT_T);
	
	while(a)
	{
	     tickDelay(5);
	     if(OWReadBit())
	        a = 0;
	}
	
	OWTouchReset();
	OWWriteByte(SKIP_ROM);
	OWWriteByte(READ_SCRATCHPAD);
	*temperature = OWReadByte() + (OWReadByte() << 8);
	
	return 1;
	
	/*
	
	if(OWTouchReset())
	        return 0;
	        
	OWWriteByte(0xCC);
	
	OWWriteByte(0xA5);
	OWWriteByte((page << 5) & 0xFF);
	OWWriteByte(0);
	
	for(i = 0; i < 32; i++)
	        *data += OWReadByte() + "-";
	        
	OWWriteByte(0xFF);
	*/
//	return result;
}


//-----------------------------------------------------------------------------
// Generate a 1-Wire reset, return 1 if no presence detect was found,
// return 0 otherwise.
// (NOTE: Does not handle alarm presence from DS2404/DS1994)
//
int OWTouchReset(void)
{
        int result;
	bbb_mmio_set_output(pin_);
        tickDelay(G);
        bbb_mmio_set_low(pin_); // Drives DQ low
        tickDelay(H);
        bbb_mmio_set_high(pin_); // Releases the bus
        tickDelay(I);
	bbb_mmio_set_input(pin_);
        result = bbb_mmio_input(pin_) ^ 0x01; // Sample for presence pulse from slave
        tickDelay(J); // Complete the reset sequence recovery
        return result; // Return sample presence pulse result
}

//-----------------------------------------------------------------------------
// Send a 1-Wire write bit. Provide 10us recovery time.
//
void OWWriteBit(int bit)
{
	bbb_mmio_set_output(pin_);
        if (bit)
        {
                // Write '1' bit
                bbb_mmio_set_low(pin_); // Drives DQ low
                tickDelay(A);
                bbb_mmio_set_high(pin_); // Releases the bus
                tickDelay(B); // Complete the time slot and 10us recovery
        }
        else
        {
                // Write '0' bit
                bbb_mmio_set_low(pin_); // Drives DQ low
                tickDelay(C);
                bbb_mmio_set_high(pin_); // Releases the bus
                tickDelay(D);
        }
}

//-----------------------------------------------------------------------------
// Read a bit from the 1-Wire bus and return it. Provide 10us recovery time.
//
int OWReadBit(void)
{
        int result;
	bbb_mmio_set_output(pin_);
        bbb_mmio_set_low(pin_); // Drives DQ low
        tickDelay(A);
        bbb_mmio_set_high(pin_); // Releases the bus
        tickDelay(E);
	bbb_mmio_set_input(pin_);
        result = bbb_mmio_input(pin_) & 0x01; // Sample the bit value from the slave
        tickDelay(F); // Complete the time slot and 10us recovery

        return result;
}

//-----------------------------------------------------------------------------
// Write 1-Wire data byte
//
void OWWriteByte(int data)
{
        int loop;

        // Loop to write each bit in the byte, LS-bit first
        for (loop = 0; loop < 8; loop++)
        {
                OWWriteBit(data & 0x01);

                // shift the data byte for the next bit
                data >>= 1;
        }
}

//-----------------------------------------------------------------------------
// Read 1-Wire data byte and return it
//
int OWReadByte(void)
{
        int loop, result=0;

        for (loop = 0; loop < 8; loop++)
        {
                // shift the result to get it ready for the next bit
                result >>= 1;

                // if result is one, then set MS bit
                if (OWReadBit())
                        result |= 0x80;
        }
        return result;
}

//-----------------------------------------------------------------------------
// Write a 1-Wire data byte and return the sampled result.
//
int OWTouchByte(int data)
{
        int loop, result=0;

        for (loop = 0; loop < 8; loop++)
        {
                // shift the result to get it ready for the next bit
                result >>= 1;

                // If sending a '1' then read a bit else write a '0'
                if (data & 0x01)
                {
                        if (OWReadBit())
                                result |= 0x80;
                }
                else
                        OWWriteBit(0);

                // shift the data byte for the next bit
                data >>= 1;
        }
        return result;
}

//-----------------------------------------------------------------------------
// Write a block 1-Wire data bytes and return the sampled result in the same
// buffer.
//
void OWBlock(unsigned char *data, int data_len)
{
        int loop;

        for (loop = 0; loop < data_len; loop++)
        {
                data[loop] = OWTouchByte(data[loop]);
        }
}

//-----------------------------------------------------------------------------
// Set all devices on 1-Wire to overdrive speed. Return '1' if at least one
// overdrive capable device is detected.
//
int OWOverdriveSkip(unsigned char *data, int data_len)
{
        // set the speed to 'standard'

        // reset all devices
        if (OWTouchReset()) // Reset the 1-Wire bus
                return 0; // Return if no devices found

        // overdrive skip command
        OWWriteByte(0x3C);

        // set the speed to 'overdrive'

        // do a 1-Wire reset in 'overdrive' and return presence result
        return OWTouchReset();
}


//-----------------------------------------------------------------------------
// Read and return the page data and SHA-1 message authentication code (MAC)
// from a DS2432.
//
int ReadPageMAC(int page, unsigned char *page_data, unsigned char *mac)
{
        int i;
        unsigned short data_crc16, mac_crc16;

        // set the speed to 'standard'
        // select the device
        if (OWTouchReset()) // Reset the 1-Wire bus
                return 0; // Return if no devices found

        OWWriteByte(0xCC); // Send Skip ROM command to select single device

        // read the page
        OWWriteByte(0xA5); // Read Authentication command
        OWWriteByte((page << 5) & 0xFF); // TA1
        OWWriteByte(0); // TA2 (always zero for DS2432)

        // read the page data
        for (i = 0; i < 32; i++)
                page_data[i] = OWReadByte();
        OWWriteByte(0xFF);

        // read the CRC16 of command, address, and data
        data_crc16 = OWReadByte();
        data_crc16 |= (OWReadByte() << 8);

        // delay 2ms for the device MAC computation
        // read the MAC
        for (i = 0; i < 20; i++)
                mac[i] = OWReadByte();

        // read CRC16 of the MAC
        mac_crc16 = OWReadByte();
        mac_crc16 |= (OWReadByte() << 8);

        // check CRC16...
        return 1;
}
/*
//-----------------------------------------------------------------------------
// Generate a 1-Wire reset, return 1 if no presence detect was found,
// return 0 otherwise.
// (NOTE: Does not handle alarm presence from DS2404/DS1994)
//
int OWTouchReset(void)
{
        int result;

        tickDelay(G);
        outp(PORTADDRESS,0x00); // Drives DQ low
        tickDelay(H);
        outp(PORTADDRESS,0x01); // Releases the bus
        tickDelay(I);
        result = inp(PORTADDRESS) ^ 0x01; // Sample for presence pulse from slave
        tickDelay(J); // Complete the reset sequence recovery
        return result; // Return sample presence pulse result
}

//-----------------------------------------------------------------------------
// Send a 1-Wire write bit. Provide 10us recovery time.
//
void OWWriteBit(int bit)
{
        if (bit)
        {
                // Write '1' bit
                outp(PORTADDRESS,0x00); // Drives DQ low
                tickDelay(A);
                outp(PORTADDRESS,0x01); // Releases the bus
                tickDelay(B); // Complete the time slot and 10us recovery
        }
        else
        {
                // Write '0' bit
                outp(PORTADDRESS,0x00); // Drives DQ low
                tickDelay(C);
                outp(PORTADDRESS,0x01); // Releases the bus
                tickDelay(D);
        }
}

//-----------------------------------------------------------------------------
// Read a bit from the 1-Wire bus and return it. Provide 10us recovery time.
//
int OWReadBit(void)
{
        int result;

        outp(PORTADDRESS,0x00); // Drives DQ low
        tickDelay(A);
        outp(PORTADDRESS,0x01); // Releases the bus
        tickDelay(E);
        result = inp(PORTADDRESS) & 0x01; // Sample the bit value from the slave
        tickDelay(F); // Complete the time slot and 10us recovery

        return result;
}

//-----------------------------------------------------------------------------
// Write 1-Wire data byte
//
void OWWriteByte(int data)
{
        int loop;

        // Loop to write each bit in the byte, LS-bit first
        for (loop = 0; loop < 8; loop++)
        {
                OWWriteBit(data & 0x01);

                // shift the data byte for the next bit
                data >>= 1;
        }
}

//-----------------------------------------------------------------------------
// Read 1-Wire data byte and return it
//
int OWReadByte(void)
{
        int loop, result=0;

        for (loop = 0; loop < 8; loop++)
        {
                // shift the result to get it ready for the next bit
                result >>= 1;

                // if result is one, then set MS bit
                if (OWReadBit())
                        result |= 0x80;
        }
        return result;
}

//-----------------------------------------------------------------------------
// Write a 1-Wire data byte and return the sampled result.
//
int OWTouchByte(int data)
{
        int loop, result=0;

        for (loop = 0; loop < 8; loop++)
        {
                // shift the result to get it ready for the next bit
                result >>= 1;

                // If sending a '1' then read a bit else write a '0'
                if (data & 0x01)
                {
                        if (OWReadBit())
                                result |= 0x80;
                }
                else
                        OWWriteBit(0);

                // shift the data byte for the next bit
                data >>= 1;
        }
        return result;
}

//-----------------------------------------------------------------------------
// Write a block 1-Wire data bytes and return the sampled result in the same
// buffer.
//
void OWBlock(unsigned char *data, int data_len)
{
        int loop;

        for (loop = 0; loop < data_len; loop++)
        {
                data[loop] = OWTouchByte(data[loop]);
        }
}

//-----------------------------------------------------------------------------
// Set all devices on 1-Wire to overdrive speed. Return '1' if at least one
// overdrive capable device is detected.
//
int OWOverdriveSkip(unsigned char *data, int data_len)
{
        // set the speed to 'standard'
        SetSpeed(1);

        // reset all devices
        if (OWTouchReset()) // Reset the 1-Wire bus
                return 0; // Return if no devices found

        // overdrive skip command
        OWWriteByte(0x3C);

        // set the speed to 'overdrive'
        SetSpeed(0);

        // do a 1-Wire reset in 'overdrive' and return presence result
        return OWTouchReset();
}


//-----------------------------------------------------------------------------
// Read and return the page data and SHA-1 message authentication code (MAC)
// from a DS2432.
//
int ReadPageMAC(int page, unsigned char *page_data, unsigned char *mac)
{
        int i;
        unsigned short data_crc16, mac_crc16;

        // set the speed to 'standard'
        SetSpeed(1);

        // select the device
        if (OWTouchReset()) // Reset the 1-Wire bus
                return 0; // Return if no devices found

        OWWriteByte(0xCC); // Send Skip ROM command to select single device

        // read the page
        OWWriteByte(0xA5); // Read Authentication command
        OWWriteByte((page << 5) & 0xFF); // TA1
        OWWriteByte(0); // TA2 (always zero for DS2432)

        // read the page data
        for (i = 0; i < 32; i++)
                page_data[i] = OWReadByte();
        OWWriteByte(0xFF);

        // read the CRC16 of command, address, and data
        data_crc16 = OWReadByte();
        data_crc16 |= (OWReadByte() << 8);

        // delay 2ms for the device MAC computation
        // read the MAC
        for (i = 0; i < 20; i++)
                mac[i] = OWReadByte();

        // read CRC16 of the MAC
        mac_crc16 = OWReadByte();
        mac_crc16 |= (OWReadByte() << 8);

        // check CRC16...
        return 1;
}*/