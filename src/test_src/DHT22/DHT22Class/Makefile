all: DHT22MMIO

DHT22MMIO: main.o bbb_dht_read.o bbb_mmio.o common_dht_read.o DHT_22.o
	g++ -std=c++0x -lrt main.o bbb_dht_read.o bbb_mmio.o common_dht_read.o DHT_22.o -o DHT22MMIO
	
MainTest.o: main.cpp
	g++ -std=c++0x -c main.cpp 
	
bbb_mmio.o: bbb_mmio.c
	g++ -std=c++0x -c bbb_mmio.c 
	
bbb_dht_read.o: bbb_dht_read.c
	g++ -std=c++0x -c bbb_dht_read.c 
	
common_dht_read.o: common_dht_read.c
	g++ -std=c++0x -c common_dht_read.c 
	
DHT_22.o: DHT_22.cpp
	g++ -std=c++0x -c DHT_22.cpp
	
clean: rm *.o
		rm MainTest

