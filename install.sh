#!/bin/bash
apt-get update; apt-get install build-essential python-dev python-setuptools python-pip python-smbus mysql-server mysql-client 
echo "Installing npm packages ..."
cd /var/lib/cloud9/Aquarius/node-bootstrap/ 
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
cp /var/lib/cloud9/Aquarius/install/uEnv.txt /mnt/card/uEnv.txt 
dtc -O dtb -o /var/lib/cloud9/Aquarius/install/w1-00A0.dtbo -b 0 -@ /var/lib/cloud9/Aquarius/install/w1.dts 
cp /var/lib/cloud9/Aquarius/install/w1-00A0.dtbo /lib/firmware 
cp /var/lib/cloud9/Aquarius/install/rc.local /etc 
echo "Thy shall reboot, for thy need to reseat" 
reboot 
