CC=g++
CFLAGS=-std=c++0x -c -Wall
MAKE=make
export DIR_EXEC=/var/lib/cloud9/Aquarius/exec/

all: DHT22Driver OneWireDriver I2CDriver RTCDriver GPIODriver SIM908Driver

DHT22Driver: 
	$(MAKE) -C DHT22
	
OneWireDriver:
	$(MAKE) -C OneWire

I2CDriver:
	$(MAKE) -C I2C
	
GPIODriver:
	$(MAKE) -C GPIO

RTCDriver:
	$(MAKE) -C RTC

SIM908Driver:
	$(MAKE) -C SIM908