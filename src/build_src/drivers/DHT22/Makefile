all: driverDHT22 copylibs copyexec

driverDHT22: main.cpp bbb_dht_read.o bbb_mmio.o common_dht_read.o dht22Device.o BlackI2C.o BlackCore.o commun.o
	g++ -std=c++0x -lrt main.cpp bbb_dht_read.o bbb_mmio.o common_dht_read.o dht22Device.o BlackI2C.o BlackCore.o commun.o -o driverDHT22Exec

dht22Device.o: dht22Device.cpp
	g++ -std=c++0x -c dht22Device.cpp
	
bbb_mmio.o: libs/bbb_mmio.c
	g++ -std=c++0x -c libs/bbb_mmio.c 
	
bbb_dht_read.o: libs/bbb_dht_read.c
	g++ -std=c++0x -c libs/bbb_dht_read.c 
	
common_dht_read.o: libs/common_dht_read.c
	g++ -std=c++0x -c libs/common_dht_read.c 

commun.o: ../../commun.cpp
	g++ -std=c++0x -o commun.o -c ../../commun.cpp	
	
BlackI2C.o: ../../../include/blacklib/BlackI2C.cpp
	g++ -std=c++0x -c ../../../include/blacklib/BlackI2C.cpp

BlackCore.o: ../../../include/blacklib/BlackCore.cpp
	g++ -std=c++0x -c ../../../include/blacklib/BlackCore.cpp
	
clean: 
		rm *.o
		rm driverDHT22Exec

copylibs:
	cp *.o ../../libs/

copyexec:
	cp driverDHT22Exec ../../../../exec/