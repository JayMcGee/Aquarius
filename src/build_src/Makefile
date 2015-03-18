CC=g++
CFLAGS=-std=c++0x -Wall
LDFLAGS=
EXECUTABLE=AquariusFullDataUpdate
MAKE=make
DIR_EXEC=/var/lib/cloud9/Aquarius/exec/

all: driver $(EXECUTABLE)

driver: 
	$(MAKE) -C drivers

$(EXECUTABLE): main.o
	$(CC) $(CFLAGS) main.o -o $(EXECUTABLE)
	
main.o: main.cpp
	$(CC) $(CFLAGS) -c main.cpp
	
clean: 
	rm libs/*.o
	rm exec/*
	rm -rf drivers/*/driver*Exec
	rm $(EXECUTABLE)
