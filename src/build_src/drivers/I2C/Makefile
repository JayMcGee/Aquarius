all: main driverAtlasI2CDO driverAtlasI2CPH driverAtlasI2CK
 
main: main.o BlackI2C.o BlackCore.o
	g++ -std=c++0x main.o BlackI2C.o BlackCore.o -o main
	
driverAtlasI2CDO:
	g++ -std=c++0x driverAtlasI2CDO.cpp -o driverOneWireExec
	
driverAtlasI2CPH:
	g++ -std=c++0x driverAtlasI2CPH.cpp -o driverOneWireExec
	
driverAtlasI2CK:
	g++ -std=c++0x driverAtlasI2CK.cpp -o driverOneWireExec
	
main.o: main.cpp
	g++ -std=c++0x -c main.cpp
	
BlackI2C.o: ../../../include/blackLib/BlackI2C.cpp
	g++ -std=c++0x -c ../../../include/blackLib/BlackI2C.cpp

BlackCore.o: ../../../include/blackLib/BlackCore.cpp
	g++ -std=c++0x -c ../../../include/blackLib/BlackCore.cpp
	
clean: rm *.o
		rm MainTest