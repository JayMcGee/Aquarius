#!/bin/bash

#NEW_DATE=$(date +%M --date 'now +5 mins')
#echo $NEW_DATE


#NEW_min=$(echo '%x\n'  $NEW_DATE)

#echo "New minutes :"  $NEW_min

#NEW_min_d=$($NEW_min/10)

#echo "units :" $NEW_min_d

i2cset -y 1 0x68 0x0F 0x84

SELECT=$(echo i2cset -y 1 0x68)
$SELECT 0x07 0x01
$SELECT 0x08 0x16
$SELECT 0x09 0x80
$SELECT 0x0A 0x80

$SELECT 0x0E 0x1D

echo ds1307 0x68 > /sys/class/i2c-adapter/i2c-1/new_device
hwclock -r -f /dev/rtc1
echo 0x68 > /sys/class/i2c-adapter/i2c-1/delete_device


