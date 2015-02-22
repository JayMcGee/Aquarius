all: driverAtlasI2CDO driverAtlasI2CPH driverAtlasI2CK
	
driverAtlasI2CDO: BlackI2C.o BlackCore.o commun.o
	g++ -std=c++0x driverAtlasI2CDO.cpp BlackI2C.o BlackCore.o commun.o -o driverAtlasI2CDO
	
driverAtlasI2CPH: BlackI2C.o BlackCore.o commun.o
	g++ -std=c++0x driverAtlasI2CPH.cpp BlackI2C.o BlackCore.o commun.o -o driverAtlasI2CPH
	
driverAtlasI2CK: BlackI2C.o BlackCore.o commun.o
	g++ -std=c++0x driverAtlasI2CK.cpp BlackI2C.o BlackCore.o commun.o -o driverAtlasI2CK
	
BlackI2C.o: ../../../include/blacklib/BlackI2C.cpp
	g++ -std=c++0x -c ../../../include/blacklib/BlackI2C.cpp

BlackCore.o: ../../../include/blacklib/BlackCore.cpp
	g++ -std=c++0x -c ../../../include/blacklib/BlackCore.cpp
	
commun.o: ../../commun.cpp
	g++ -std=c++0x -o commun.o -c ../../commun.cpp
	
copylibs:
	cp *.o ../../libs/
	
copyexec:
	cp driver* ../../exec/
	
clean: rm *.o
		rm driverAtlasI2CDO driverAtlasI2CPH driverAtlasI2CK