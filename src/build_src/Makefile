CC=g++
CFLAGS=-std=c++0x -Wall
LDFLAGS=
MAKE=make
export DIR_EXEC=/var/lib/cloud9/Aquarius/exec/

all: driver 

driver: 
	$(MAKE) -C drivers
	
clean: 
	rm libs/*.o
	rm exec/*
	rm -rf drivers/*/driver*Exec
	rm $(EXECUTABLE)
