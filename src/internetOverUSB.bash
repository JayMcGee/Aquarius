#!/bin/bash
# Proper header for a Bash script.
echo "Adding default route... "
route add default gw 192.168.7.1

echo "Adding nameserver..."
echo "nameserver 8.8.8.8" >> /etc/resolv.conf

echo "Done enabling internet over USB"