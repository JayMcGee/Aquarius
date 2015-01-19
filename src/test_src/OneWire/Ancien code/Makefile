all: MainOW

MainOW: main.o  bbb_one_wire.o bbb_mmio.o common_dht_read.o
	g++ -std=c++0x -lrt main.o bbb_one_wire.o bbb_mmio.o common_dht_read.o -o MainOW 
	
main.o: main.cpp
	g++ -std=c++0x -o main.o -c main.cpp 
		
bbb_one_wire.o: Beaglebone_Black/bbb_one_wire.cpp
	g++ -std=c++0x -o bbb_one_wire.o -c Beaglebone_Black/bbb_one_wire.cpp
	
common_dht_read.o: common_dht_read.cpp
	g++ -std=c++0x -o common_dht_read.o -c common_dht_read.cpp
	
bbb_mmio.o: Beaglebone_Black/bbb_mmio.cpp
	g++ -std=c++0x -o bbb_mmio.o -c Beaglebone_Black/bbb_mmio.cpp
	
clean: rm *.o
		rm main

