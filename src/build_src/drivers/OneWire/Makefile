all: driverOneWire copylibs copyexec

driverOneWire: OneWireDevice.o 
	g++ -std=c++0x main.cpp OneWireDevice.o -o driverOneWireExec
	
OneWireDevice.o: OneWireDevice.cpp
	g++ -std=c++0x -o OneWireDevice.o -c OneWireDevice.cpp
	
clean: rm *.o
		rm driverOneWireExec
	
copylibs:
	cp *.o ../../libs/
	
copyexec:
	cp driverOneWireExec ../../exec/