all: main

main: main.o BlackI2C.o BlackCore.o
	g++ -std=c++0x main.o BlackI2C.o BlackCore.o -o main
	
main.o: main.cpp
	g++ -std=c++0x -c main.cpp
	
BlackI2C.o: ../../include/blackLib/BlackI2C.cpp
	g++ -std=c++0x -c ../../include/blackLib/BlackI2C.cpp

BlackCore.o: ../../include/blackLib/BlackCore.cpp
	g++ -std=c++0x -c ../../include/blackLib/BlackCore.cpp
	
clean: rm *.o
		rm MainTest

