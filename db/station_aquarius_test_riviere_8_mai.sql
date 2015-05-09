-- phpMyAdmin SQL Dump
-- version 3.4.11.1deb2+deb7u1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: May 08, 2015 at 03:57 PM
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
(1, 'READ_INTERVAL', '5', 'Minutes between each read operation'),
(2, 'SEND_ADDRESS', 'http://cloudiaproject.org/data.php', 'ClouDIA data send address'),
(3, 'LAST_KNOWN_DATE', 'Fri May  8 15:55:49 UTC 2015\n', 'Last known operating date'),
(4, 'STATION_ID', 'bra003', 'ClouDIA station ID'),
(5, 'NUMBER_RETRIES', '5', 'Number of read attempts on sensors'),
(6, 'DEBUG_LEVEL', '3', '0 = no debug, 1 = errors only, minimal = 2, 3'),
(7, 'SENSOR_UNIT', 'su0008', 'Cloudia Sensor Unit ID'),
(8, 'OW_DRIVER_WATER_COMP', '28-000006052315', 'OneWire water temperature compensation');

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
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=103 ;

--
-- Dumping data for table `t_Data`
--

INSERT INTO `t_Data` (`idt_Data`, `data_value`, `data_t_virtual`, `data_date`, `data_is_sent`) VALUES
(1, 16.38, 1, '2015-05-08 15:08:01', 0),
(2, 10.14, 2, '2015-05-08 15:08:03', 0),
(3, 33.2, 3, '2015-05-08 15:08:03', 0),
(4, 27.7, 4, '2015-05-08 15:08:03', 0),
(5, 1410, 7, '2015-05-08 15:08:07', 0),
(6, 761, 8, '2015-05-08 15:08:07', 0),
(7, 0.66, 9, '2015-05-08 15:08:07', 0),
(8, 1, 10, '2015-05-08 15:08:07', 0),
(9, 0.91, 11, '2015-05-08 15:08:08', 0),
(10, -7153.74, 12, '2015-05-08 15:08:10', 0),
(11, 4524.66, 13, '2015-05-08 15:08:11', 0),
(12, 109.153, 14, '2015-05-08 15:08:11', 0),
(13, 16.31, 1, '2015-05-08 15:13:09', 0),
(14, 14, 2, '2015-05-08 15:13:11', 0),
(15, 34.6, 3, '2015-05-08 15:13:12', 0),
(16, 21.1, 4, '2015-05-08 15:13:12', 0),
(17, 1388, 7, '2015-05-08 15:13:16', 0),
(18, 749, 8, '2015-05-08 15:13:16', 0),
(19, 0.64, 9, '2015-05-08 15:13:16', 0),
(20, 1, 10, '2015-05-08 15:13:16', 0),
(21, 0.9, 11, '2015-05-08 15:13:16', 0),
(22, 0, 12, '2015-05-08 15:13:19', 0),
(23, 0, 13, '2015-05-08 15:13:19', 0),
(24, 0, 14, '2015-05-08 15:13:19', 0),
(25, 16.25, 1, '2015-05-08 15:18:17', 0),
(26, 12.02, 2, '2015-05-08 15:18:19', 0),
(27, 34.5, 3, '2015-05-08 15:18:19', 0),
(28, 21.2, 4, '2015-05-08 15:18:19', 0),
(29, 1395, 7, '2015-05-08 15:18:23', 0),
(30, 753, 8, '2015-05-08 15:18:23', 0),
(31, 0.65, 9, '2015-05-08 15:18:23', 0),
(32, 1, 10, '2015-05-08 15:18:23', 0),
(33, 0.9, 11, '2015-05-08 15:18:24', 0),
(34, 0, 12, '2015-05-08 15:18:26', 0),
(35, 0, 13, '2015-05-08 15:18:26', 0),
(36, 0, 14, '2015-05-08 15:18:26', 0),
(37, 16.31, 1, '2015-05-08 15:23:59', 0),
(38, 11.16, 2, '2015-05-08 15:24:01', 0),
(39, 34.4, 3, '2015-05-08 15:24:01', 0),
(40, 23.5, 4, '2015-05-08 15:24:01', 0),
(41, 1398, 7, '2015-05-08 15:24:05', 0),
(42, 755, 8, '2015-05-08 15:24:05', 0),
(43, 0.65, 9, '2015-05-08 15:24:05', 0),
(44, 1, 10, '2015-05-08 15:24:05', 0),
(45, 0.89, 11, '2015-05-08 15:24:06', 0),
(46, -7153.74, 12, '2015-05-08 15:24:55', 0),
(47, 4524.66, 13, '2015-05-08 15:24:55', 0),
(48, 117.922, 14, '2015-05-08 15:24:55', 0),
(49, 16.38, 1, '2015-05-08 15:29:07', 0),
(50, 11.26, 2, '2015-05-08 15:29:09', 0),
(51, 34.4, 3, '2015-05-08 15:29:11', 0),
(52, 20, 4, '2015-05-08 15:29:11', 0),
(53, 1405, 7, '2015-05-08 15:29:15', 0),
(54, 759, 8, '2015-05-08 15:29:15', 0),
(55, 0.65, 9, '2015-05-08 15:29:15', 0),
(56, 1, 10, '2015-05-08 15:29:15', 0),
(57, 0.89, 11, '2015-05-08 15:29:16', 0),
(58, -7153.74, 12, '2015-05-08 15:30:04', 0),
(59, 4524.66, 13, '2015-05-08 15:30:04', 0),
(60, 124.739, 14, '2015-05-08 15:30:04', 0),
(61, 16.13, 1, '2015-05-08 15:40:07', 0),
(62, 12.97, 2, '2015-05-08 15:40:08', 0),
(63, 32.5, 3, '2015-05-08 15:40:10', 0),
(64, 25.6, 4, '2015-05-08 15:40:10', 0),
(65, 1103, 7, '2015-05-08 15:40:14', 0),
(66, 595, 8, '2015-05-08 15:40:14', 0),
(67, 0.51, 9, '2015-05-08 15:40:14', 0),
(68, 1, 10, '2015-05-08 15:40:14', 0),
(69, 0.9, 11, '2015-05-08 15:40:15', 0),
(70, -7153.82, 12, '2015-05-08 15:41:03', 0),
(71, 4524.66, 13, '2015-05-08 15:41:03', 0),
(72, 124.472, 14, '2015-05-08 15:41:04', 0),
(73, 16.13, 1, '2015-05-08 15:45:15', 0),
(74, 13.42, 2, '2015-05-08 15:45:17', 0),
(75, 32.5, 3, '2015-05-08 15:45:17', 0),
(76, 25.5, 4, '2015-05-08 15:45:17', 0),
(77, 1109, 7, '2015-05-08 15:45:21', 0),
(78, 599, 8, '2015-05-08 15:45:21', 0),
(79, 0.51, 9, '2015-05-08 15:45:21', 0),
(80, 1, 10, '2015-05-08 15:45:21', 0),
(81, 0.9, 11, '2015-05-08 15:45:22', 0),
(82, 16.19, 1, '2015-05-08 15:50:22', 0),
(83, 13.73, 2, '2015-05-08 15:50:24', 0),
(84, 29.3, 3, '2015-05-08 15:50:25', 0),
(85, 29.5, 4, '2015-05-08 15:50:25', 0),
(86, 1110, 7, '2015-05-08 15:50:29', 0),
(87, 599, 8, '2015-05-08 15:50:29', 0),
(88, 0.51, 9, '2015-05-08 15:50:29', 0),
(89, 1, 10, '2015-05-08 15:50:29', 0),
(90, 0.89, 11, '2015-05-08 15:50:29', 0),
(91, 16.25, 1, '2015-05-08 15:55:50', 0),
(92, 13.76, 2, '2015-05-08 15:55:52', 0),
(93, 28.5, 3, '2015-05-08 15:55:54', 0),
(94, 33.6, 4, '2015-05-08 15:55:54', 0),
(95, 1111, 7, '2015-05-08 15:55:58', 0),
(96, 599, 8, '2015-05-08 15:55:58', 0),
(97, 0.51, 9, '2015-05-08 15:55:58', 0),
(98, 1, 10, '2015-05-08 15:55:58', 0),
(99, 0.89, 11, '2015-05-08 15:55:58', 0),
(100, -7153.82, 12, '2015-05-08 15:56:47', 0),
(101, 4524.66, 13, '2015-05-08 15:56:47', 0),
(102, 123.501, 14, '2015-05-08 15:56:47', 0);

-- --------------------------------------------------------

--
-- Table structure for table `t_PhysicalSensor`
--

CREATE TABLE IF NOT EXISTS `t_PhysicalSensor` (
  `physical_id` int(11) NOT NULL AUTO_INCREMENT,
  `cloudia_unit_id` varchar(45) NOT NULL,
  `physical_name` varchar(45) NOT NULL,
  `physical_t_type` int(11) NOT NULL,
  `physical_address` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`physical_id`),
  UNIQUE KEY `sensors_id_UNIQUE` (`physical_id`),
  UNIQUE KEY `cloudia_id_UNIQUE` (`cloudia_unit_id`),
  UNIQUE KEY `sensors_name_UNIQUE` (`physical_name`),
  KEY `fk_t_sensor_type_idx` (`physical_t_type`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=8 ;

--
-- Dumping data for table `t_PhysicalSensor`
--

INSERT INTO `t_PhysicalSensor` (`physical_id`, `cloudia_unit_id`, `physical_name`, `physical_t_type`, `physical_address`) VALUES
(1, 'su0001', 'Water PH', 2, '1:99'),
(2, 'su0002', 'Water Temperature', 4, '28-000006700658'),
(3, 'su0003', 'Case Temp/Hum', 5, '1:14'),
(4, 'su0004', 'Water DO', 1, '1:97'),
(5, 'su0005', 'Water Conductivity', 3, '1:100'),
(6, 'su0006', 'Battery Sensor', 6, 'P9_40'),
(7, 'su0007', 'GPS', 7, '');

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
  PRIMARY KEY (`virtual_id`),
  UNIQUE KEY `unit_id_UNIQUE` (`virtual_id`),
  KEY `fk_t_unit_sensors_idx` (`virtual_t_physical`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=15 ;

--
-- Dumping data for table `t_VirtualSensor`
--

INSERT INTO `t_VirtualSensor` (`virtual_id`, `cloudia_id`, `virtual_measure_unit`, `virtual_t_physical`, `virtual_driver_pos`, `virtual_max`, `virtual_min`, `virtual_color`, `virtual_precision`) VALUES
(1, '01', '°C', 2, 5, 125, -55, '#FF9900', 2),
(2, '02', 'pH', 1, 5, 14, 0, '#ED1C24', 2),
(3, '03', '°C', 3, 5, 80, -40, '#EB6841', 2),
(4, '04', '% ', 3, 7, 100, 0, '#E84A5F', 2),
(5, '05', '% ', 4, 5, 100, 0, '#F6CB04', 2),
(6, '06', 'mg/L', 4, 7, 35.99, 0.01, '#F6CB04', 2),
(7, '07', 'u/S', 5, 5, 50000, 0.5, '#28903B', 2),
(8, '08', 'mg/L', 5, 7, 100, 0, '#28903B', 2),
(9, '09', 'Salinity', 5, 9, 100, 0, '#28903B', 2),
(10, '10', 'SG', 5, 11, 100, 0, '#28903B', 2),
(11, '11', 'Volts', 6, 5, 14, 5, '#3299BB', 2),
(12, '12', 'Longitude', 7, 7, 180, -180, '#78C4D2', 0),
(13, '13', 'Latitude', 7, 9, 90, -90, '#78C4D2', 0),
(14, '14', 'Altitude (m)', 7, 11, 8848, 0, '#7f4197', 0);

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
