all: driverAtlasI2CDO driverAtlasI2CPH driverAtlasI2CK copylibs copyexec cleanObject
	
driverAtlasI2CDO: commun.o OneWireDevice.o BlackI2C.o BlackCore.o Atlas_I2C_DO.o Atlas_I2C.o
	g++ -std=c++0x driverAtlas_I2CDO.cpp OneWireDevice.o BlackI2C.o BlackCore.o Atlas_I2C_DO.o Atlas_I2C.o commun.o -o driverAtlasI2CDO
	
driverAtlasI2CPH: commun.o OneWireDevice.o BlackI2C.o BlackCore.o Atlas_I2C_PH.o Atlas_I2C.o
	g++ -std=c++0x driverAtlas_I2CPH.cpp OneWireDevice.o BlackI2C.o BlackCore.o  Atlas_I2C_PH.o Atlas_I2C.o commun.o -o driverAtlasI2CPH
	
driverAtlasI2CK: commun.o OneWireDevice.o BlackI2C.o BlackCore.o Atlas_I2C_K.o Atlas_I2C.o 
	g++ -std=c++0x driverAtlas_I2CK.cpp OneWireDevice.o BlackI2C.o BlackCore.o Atlas_I2C_K.o Atlas_I2C.o commun.o -o driverAtlasI2CK
	
commun.o: ../../commun.cpp
	g++ -std=c++0x -c ../../commun.cpp
	
BlackI2C.o: ../../../include/blacklib/BlackI2C.cpp
	g++ -std=c++0x -c ../../../include/blacklib/BlackI2C.cpp

BlackCore.o: ../../../include/blacklib/BlackCore.cpp
	g++ -std=c++0x -c ../../../include/blacklib/BlackCore.cpp
	
Atlas_I2C.o: Atlas_I2C.cpp
	g++ -std=c++0x -c Atlas_I2C.cpp

Atlas_I2C_PH.o: Atlas_I2C_PH.cpp
	g++ -std=c++0x -c Atlas_I2C_PH.cpp

Atlas_I2C_DO.o: Atlas_I2C_DO.cpp
	g++ -std=c++0x -c Atlas_I2C_DO.cpp

Atlas_I2C_K.o: Atlas_I2C_K.cpp
	g++ -std=c++0x -c Atlas_I2C_K.cpp
	
OneWireDevice.o: ../OneWire/OneWireDevice.cpp
	g++ -std=c++0x -c ../OneWire/OneWireDevice.cpp
	
copylibs:
	cp *.o ../../libs/
	
copyexec:
	cp driverAtlasI2C* ../../../../exec/

cleanObject:
	rm *.o
	
clean: 
	rm *.o
	rm driverAtlasI2CDO driverAtlasI2CPH driverAtlasI2CK