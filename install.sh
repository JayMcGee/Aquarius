#!/bin/bash
apt-get update; apt-get install build-essential python-dev python-setuptools python-pip python-smbus mysql-server mysql-client 
cd /var/lib/cloud9/Aquarius/db
mysql -u root -p -h localhost < station_aquarius_420.sql
echo "Installing npm packages ..."
cd /var/lib/cloud9/Aquarius/node-bootstrap
pwd
npm install 
echo "Installing Express.io ... "
npm install express.io 
echo "Installing node-schedule ... " 
npm install node-schedule 
echo "Installing execSync ... " 
npm install execSync 
echo "Installing aquarius.service to system ..."
cp /var/lib/cloud9/Aquarius/install/aquarius.service /lib/systemd/system 
cd /etc/systemd/system/multi-user.target.wants/ 
ln /lib/systemd/system/aquarius.service 
cd /var/lib/cloud9/Aquarius/src/build_src/
make
echo "Thy shall reboot, for thy need to reseat" 
reboot 
