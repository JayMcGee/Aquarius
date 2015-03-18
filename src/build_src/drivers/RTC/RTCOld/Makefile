all: driverRTC copylibs copyexec

driverRTC: main.cpp BlackI2C.o BlackCore.o commun.o
	g++ -std=c++0x main.cpp BlackI2C.o BlackCore.o commun.o -o driverRTC

commun.o: ../../commun.cpp
	g++ -std=c++0x -o commun.o -c ../../commun.cpp
	
	
BlackI2C.o: ../../../include/blacklib/BlackI2C.cpp
	g++ -std=c++0x -c ../../../include/blacklib/BlackI2C.cpp

BlackCore.o: ../../../include/blacklib/BlackCore.cpp
	g++ -std=c++0x -c ../../../include/blacklib/BlackCore.cpp
	
clean: rm *.o
		rm driverRTC
	
copylibs:
	cp *.o ../../libs/
	
copyexec:
	cp driverRTC ../../exec/