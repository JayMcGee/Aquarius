#!/bin/bash

echo "Installing npm packages ..."
cd /var/lib/cloud9/Aquarius/node-bootstrap
npm install 
echo "Installing Express.io ... "
npm install express.io
echo "Installing node-schedule ... "
npm install node-schedule
echo "Installing execSync ... "
npm install execSync

echo "Installing aquarius.service to system ..."
cp /var/lib/cloud9/Aquarius/aquarius.service /lib/systemd/system
cd /etc/systemd/system/multi-user.target.wants/
ln /lib/systemd/system/aquarius.service

cd /var/lib/cloud9/Aquarius

mkdir /mnt/card
mount /dev/mmcblk0p1  /mnt/card
cp /var/lib/cloud9/Aquarius/uEnv.txt /mnt/card/uEnv.txt

echo "Thy shall reboot, for thy need to reseat"
reboot
