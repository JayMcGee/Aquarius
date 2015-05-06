all: driverOneWire copylibs copyexec

driverOneWire: OneWireDevice.o BlackI2C.o BlackCore.o commun.o
	g++ -std=c++0x main.cpp OneWireDevice.o BlackI2C.o BlackCore.o commun.o -o driverOneWireExec
	
OneWireDevice.o: OneWireDevice.cpp
	g++ -std=c++0x -o OneWireDevice.o -c OneWireDevice.cpp
	
commun.o: ../../commun.cpp
	g++ -std=c++0x -o commun.o -c ../../commun.cpp
	
	
BlackI2C.o: ../../../include/blacklib/BlackI2C.cpp
	g++ -std=c++0x -c ../../../include/blacklib/BlackI2C.cpp

BlackCore.o: ../../../include/blacklib/BlackCore.cpp
	g++ -std=c++0x -c ../../../include/blacklib/BlackCore.cpp
	
clean: rm *.o
		rm driverOneWireExec
	
copylibs:
	cp *.o ../../libs/
	
copyexec:
	cp driverOneWireExec ../../../../exec/
	mkdir -p /mnt/card 
	mountpoint -q /mnt/card || mount /dev/mmcblk0p1  /mnt/card 
	cp uEnv.txt /mnt/card/uEnv.txt 
	dtc -O dtb -o w1-00A0.dtbo -b 0 -@ w1.dts 
	cp w1-00A0.dtbo /lib/firmware 
	cp rc.local /etc 