-- phpMyAdmin SQL Dump
-- version 3.4.11.1deb2+deb7u1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Jun 04, 2015 at 11:42 AM
-- Server version: 5.5.43
-- PHP Version: 5.4.39-0+deb7u2

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `station_aquarius`
--

-- --------------------------------------------------------

--
-- Table structure for table `t_Config`
--
USE station_aquarius;
CREATE TABLE IF NOT EXISTS `t_Config` (
  `config_id` int(11) NOT NULL AUTO_INCREMENT,
  `config_key_name` varchar(45) NOT NULL,
  `config_key_value` varchar(45) NOT NULL,
  `config_key_description` varchar(45) NOT NULL,
  PRIMARY KEY (`config_id`),
  UNIQUE KEY `config_key_name_UNIQUE` (`config_key_name`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=9 ;

--
-- Dumping data for table `t_Config`
--

INSERT INTO `t_Config` (`config_id`, `config_key_name`, `config_key_value`, `config_key_description`) VALUES
(1, 'READ_INTERVAL', '30', 'Minutes between each read operation'),
(2, 'SEND_ADDRESS', 'http://cloudiaproject.org/dev/data.php', 'ClouDIA data send address'),
(3, 'LAST_KNOWN_DATE', 'Thu Jun  4 11:27:13 UTC 2015\n', 'Last known operating date'),
(4, 'STATION_ID', 'bra003', 'ClouDIA station ID'),
(5, 'NUMBER_RETRIES', '5', 'Number of read attempts on sensors'),
(6, 'DEBUG_LEVEL', '3', '0 = no debug, 1 = errors only, minimal = 2, 3'),
(7, 'SENSOR_UNIT', 'su0008', 'Cloudia Sensor Unit ID'),
(8, 'PPP_APN', 'timbrasil.com.br tim tim', 'APN values');

-- --------------------------------------------------------

--
-- Table structure for table `t_Data`
--

CREATE TABLE IF NOT EXISTS `t_Data` (
  `idt_Data` int(11) NOT NULL AUTO_INCREMENT,
  `data_value` float NOT NULL,
  `data_t_virtual` int(11) NOT NULL,
  `data_date` datetime NOT NULL,
  `data_is_sent` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`idt_Data`),
  UNIQUE KEY `idt_Data_UNIQUE` (`idt_Data`),
  KEY `fk_t_data_unit_idx` (`data_t_virtual`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `t_PhysicalSensor`
--

CREATE TABLE IF NOT EXISTS `t_PhysicalSensor` (
  `physical_id` int(11) NOT NULL AUTO_INCREMENT,
  `physical_name` varchar(45) NOT NULL,
  `physical_t_type` int(11) NOT NULL,
  `physical_address` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`physical_id`),
  UNIQUE KEY `sensors_id_UNIQUE` (`physical_id`),
  UNIQUE KEY `sensors_name_UNIQUE` (`physical_name`),
  KEY `fk_t_sensor_type_idx` (`physical_t_type`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=8 ;

--
-- Dumping data for table `t_PhysicalSensor`
--

INSERT INTO `t_PhysicalSensor` (`physical_id`, `physical_name`, `physical_t_type`, `physical_address`) VALUES
(1, 'Water PH', 2, '1:99'),
(2, 'Water Temperature', 4, '28-000006700658'),
(3, 'Case Temp/Hum', 5, '1:14'),
(4, 'Water DO', 1, '1:97'),
(5, 'Water Conductivity', 3, '1:100'),
(6, 'Battery Sensor', 6, 'P9_40'),
(7, 'GPS', 7, '');

-- --------------------------------------------------------

--
-- Table structure for table `t_Types`
--

CREATE TABLE IF NOT EXISTS `t_Types` (
  `types_id` int(11) NOT NULL AUTO_INCREMENT,
  `types_name` varchar(45) NOT NULL,
  `types_driver` varchar(450) NOT NULL,
  PRIMARY KEY (`types_id`),
  UNIQUE KEY `types_id_UNIQUE` (`types_id`),
  UNIQUE KEY `types_name_UNIQUE` (`types_name`),
  UNIQUE KEY `types_driver_UNIQUE` (`types_driver`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=8 ;

--
-- Dumping data for table `t_Types`
--

INSERT INTO `t_Types` (`types_id`, `types_name`, `types_driver`) VALUES
(1, 'Atlas I2C DO', '/var/lib/cloud9/Aquarius/exec/driverAtlasI2CDO'),
(2, 'Atlas I2C PH', '/var/lib/cloud9/Aquarius/exec/driverAtlasI2CPH'),
(3, 'Atlas I2C K', '/var/lib/cloud9/Aquarius/exec/driverAtlasI2CK'),
(4, 'One Wire ', '/var/lib/cloud9/Aquarius/exec/driverOneWireExec '),
(5, 'DHT22', '/var/lib/cloud9/Aquarius/exec/driverDHT22Exec'),
(6, 'Battery Sensor', 'python /var/lib/cloud9/Aquarius/exec/adc.py'),
(7, 'SIM908GPS', 'python /var/lib/cloud9/Aquarius/exec/driverSIM908.py');

-- --------------------------------------------------------

--
-- Table structure for table `t_VirtualSensor`
--

CREATE TABLE IF NOT EXISTS `t_VirtualSensor` (
  `virtual_id` int(11) NOT NULL AUTO_INCREMENT,
  `cloudia_id` varchar(45) NOT NULL,
  `virtual_measure_unit` varchar(45) NOT NULL,
  `virtual_t_physical` int(11) NOT NULL,
  `virtual_driver_pos` int(11) NOT NULL DEFAULT '5',
  `virtual_max` float DEFAULT NULL,
  `virtual_min` float DEFAULT NULL,
  `virtual_color` varchar(45) DEFAULT NULL,
  `virtual_precision` int(10) unsigned DEFAULT NULL,
  `virtual_on` int(11) NOT NULL DEFAULT '1',
  PRIMARY KEY (`virtual_id`),
  UNIQUE KEY `unit_id_UNIQUE` (`virtual_id`),
  KEY `fk_t_unit_sensors_idx` (`virtual_t_physical`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=15 ;

--
-- Dumping data for table `t_VirtualSensor`
--

INSERT INTO `t_VirtualSensor` (`virtual_id`, `cloudia_id`, `virtual_measure_unit`, `virtual_t_physical`, `virtual_driver_pos`, `virtual_max`, `virtual_min`, `virtual_color`, `virtual_precision`, `virtual_on`) VALUES
(1, '01', '°C', 2, 5, 125, -55, '#FF9900', 2, 1),
(2, '02', 'pH', 1, 5, 14, 0, '#ED1C24', 2, 1),
(3, '03', '°C', 3, 5, 80, -40, '#EB6841', 2, 1),
(4, '04', '% ', 3, 7, 100, 0, '#E84A5F', 2, 1),
(5, '05', '% ', 4, 5, 100, 0, '#F6CB04', 2, 1),
(6, '06', 'mg/L', 4, 7, 35.99, 0.01, '#F6CB04', 2, 1),
(7, '07', 'u/S', 5, 5, 50000, 0.5, '#28903B', 2, 1),
(8, '08', 'mg/L', 5, 7, 2000, 0, '#28903B', 2, 1),
(9, '09', 'Salinity', 5, 9, 100, 0, '#28903B', 2, 0),
(10, '10', 'SG', 5, 11, 100, 0, '#28903B', 2, 0),
(11, '11', 'Volts', 6, 5, 14, 5, '#3299BB', 2, 0),
(12, '12', 'Longitude', 7, 7, 180, -180, '#78C4D2', 0, 1),
(13, '13', 'Latitude', 7, 9, 90, -90, '#78C4D2', 0, 1),
(14, '14', 'Altitude (m)', 7, 11, 8848, 0, '#7f4197', 0, 1);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `t_PhysicalSensor`
--
ALTER TABLE `t_PhysicalSensor`
  ADD CONSTRAINT `fk_t_sensor_type` FOREIGN KEY (`physical_t_type`) REFERENCES `t_Types` (`types_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `t_VirtualSensor`
--
ALTER TABLE `t_VirtualSensor`
  ADD CONSTRAINT `fk_t_VirtualSensor_1` FOREIGN KEY (`virtual_t_physical`) REFERENCES `t_PhysicalSensor` (`physical_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
