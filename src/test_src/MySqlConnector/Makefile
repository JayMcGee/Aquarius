all: main

main: main.o FileRead/OneWireDevice.o FileRead/commun.o ../commun.o
	g++ main.o FileRead/OneWireDevice.o FileRead/commun.o ../commun.o -o main -I/usr/include/cppconn -L/usr/lib -lmysqlcppconn

main.o: main.cpp
	g++ -c main.cpp -I/usr/include/cppconn -L/usr/lib -lmysqlcppconn