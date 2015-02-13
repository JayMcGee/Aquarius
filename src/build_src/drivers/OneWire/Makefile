all: driverOneWire copylibs copyexec

driverOneWire: OneWireDevice.o commun.o
	g++ -std=c++0x main.cpp OneWireDevice.o commun.o -o driverOneWireExec
	
OneWireDevice.o: OneWireDevice.cpp
	g++ -std=c++0x -o OneWireDevice.o -c OneWireDevice.cpp
	
commun.o: ../../commun.cpp
	g++ -std=c++0x -o commun.o -c ../../commun.cpp
	
clean: rm *.o
		rm driverOneWireExec
	
copylibs:
	cp *.o ../../libs/
	
copyexec:
	cp driverOneWireExec ../../exec/