all: main


main: main.o commun.o OneWireDevice.o
	g++ -std=c++0x main.o commun.o OneWireDevice.o -o main
	
main.o: main.cpp
	g++ -std=c++0x -o main.o -c main.cpp
	
commun.o: commun.cpp
	g++ -std=c++0x -o commun.o -c commun.cpp
	
OneWireDevice.o: OneWireDevice.cpp
	g++ -std=c++0x -o OneWireDevice.o -c OneWireDevice.cpp
	