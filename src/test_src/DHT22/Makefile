all: DHT22Main

DHT22Main: TestDHT22.o BlackGPIO.o BlackCore.o Timing.o dht22.o
	g++ -std=c++0x TestDHT22.o BlackGPIO.o BlackCore.o Timing.o dht22.o -o MainTest
	
TestDHT22.o: TestDHT22.cpp
	g++ -std=c++0x -c TestDHT22.cpp
	
dht22.o: dht22.cpp
	g++ -std=c++0x -c dht22.cpp
	
BlackCore.o: ../BlackLib/BlackCore.cpp
	g++ -std=c++0x -c ../BlackLib/BlackCore.cpp
	
BlackGPIO.o: ../BlackLib/BlackGPIO.cpp
	g++ -std=c++0x -c ../BlackLib/BlackGPIO.cpp

Timing.o: ../BlackLib/Timing.cpp
	g++ -std=c++0x -c ../BlackLib/Timing.cpp
	
clean: rm *.o
		rm MainTest

