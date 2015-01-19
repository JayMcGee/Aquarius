all: main

main: main.o SIM.o BlackUART.o BlackCore.o
	g++ -std=c++0x main.o SIM.o BlackUART.o BlackCore.o -o main
	
main.o: main.cpp
	g++ -std=c++0x -c main.cpp
	
SIM.o: SIM.cpp
	g++ -std=c++0x -c SIM.cpp
	
BlackUART.o: ../BlackLib/BlackUART.cpp
	g++ -std=c++0x -c ../BlackLib/BlackUART.cpp

BlackCore.o: ../BlackLib/BlackCore.cpp
	g++ -std=c++0x -c ../BlackLib/BlackCore.cpp
	
clean: rm *.o
		rm MainTest

