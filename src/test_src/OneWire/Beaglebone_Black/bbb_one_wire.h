/**
* 	File : bbb_one_wire.h
*	Creator : Jean-Philippe Fournier
*	Based upon : http://www.maximintegrated.com/en/app-notes/index.mvp/id/126
*				 and https://github.com/adafruit/Adafruit_Python_DHT
*	Description : Library used to read one wire devices on a BeagelBone Black using
*				  logic from MaximIntegrated and utilities by Adafruit
*	
*	Date : October 13, 2014
**/
#ifndef BBB_ONE_WIRE_H
#define BBB_ONE_WIRE_H

#define OW_DATA 22
#define SKIP_ROM 0xCC
#define READ_SCRATCHPAD 0xBE
#define CONVERT_T 0x44

#include "bbb_mmio.h"
#include "../common_dht_read.h"

#include <string>
#include <iostream>

using namespace std;

// 'tick' values
extern int gpioBase_;
extern int gpioNumber_;
extern gpio_t pin_;

extern int A,B,C,D,E,F,G,H,I,J;

void bbb_one_wire_setup(int gpio_base, int gpio_number);
int bbb_one_wire_DS1820_read(float* temperature, string * data);

// Pause for exactly 'tick' number of ticks = 0.25us
void tickDelay(int tick); // Implementation is platform specific

//Need reimplementation to adapt to new device
int OWTouchReset(void);
void OWWriteBit(int bit);
int OWReadBit(void);

//No reimplementation
void OWWriteByte(int data);
int OWReadByte(void);
int OWTouchByte(int data);
void OWBlock(unsigned char *data, int data_len);
int OWOverdriveSkip(unsigned char *data, int data_len);

//Read example provided
int ReadPageMAC(int page, unsigned char *page_data, unsigned char *mac);

#endif