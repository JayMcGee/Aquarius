-- phpMyAdmin SQL Dump
-- version 3.4.11.1deb2+deb7u1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Mar 27, 2015 at 02:45 PM
-- Server version: 5.5.41
-- PHP Version: 5.4.36-0+deb7u3

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
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=7 ;

--
-- Dumping data for table `t_Config`
--

INSERT INTO `t_Config` (`config_id`, `config_key_name`, `config_key_value`, `config_key_description`) VALUES
(1, 'READ_INTERVAL', '5', 'Minutes between each read operation'),
(2, 'SEND_ADDRESS', 'www.cloudiaproject.org/c/data.json', 'ClouDIA data send address'),
(3, 'LAST_KNOWN_DATE', 'Fri Mar 27 14:17:35 UTC 2015\n', 'Last known operating date'),
(4, 'STATION_ID', 'sta001', 'ClouDIA station ID'),
(5, 'NUMBER_RETRIES', '5', 'Number of read attempts on sensors'),
(6, 'DEBUG_LEVEL', '2', '0 = no debug, 1 = errors only, minimal = 2, 3');

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
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=145 ;

--
-- Dumping data for table `t_Data`
--

INSERT INTO `t_Data` (`idt_Data`, `data_value`, `data_t_virtual`, `data_date`, `data_is_sent`) VALUES
(1, 4.274, 2, '2015-03-27 11:12:21', 0),
(2, 29.937, 1, '2015-03-27 11:12:22', 0),
(3, 8.05, 5, '2015-03-27 11:12:24', 0),
(4, 88.5, 6, '2015-03-27 11:12:24', 0),
(5, 0, 7, '2015-03-27 11:12:25', 0),
(6, 0, 8, '2015-03-27 11:12:25', 0),
(7, 0, 9, '2015-03-27 11:12:26', 0),
(8, 1, 10, '2015-03-27 11:12:26', 0),
(9, 4.272, 2, '2015-03-27 12:16:52', 0),
(10, 29.562, 1, '2015-03-27 12:16:53', 0),
(11, 8.96, 5, '2015-03-27 12:16:55', 0),
(12, 98.6, 6, '2015-03-27 12:16:55', 0),
(13, 0, 7, '2015-03-27 12:16:56', 0),
(14, 0, 8, '2015-03-27 12:16:56', 0),
(15, 0, 9, '2015-03-27 12:16:56', 0),
(16, 1, 10, '2015-03-27 12:16:56', 0),
(17, 4.271, 2, '2015-03-27 12:18:24', 0),
(18, 29.25, 1, '2015-03-27 12:18:25', 0),
(19, 23.8, 3, '2015-03-27 12:18:25', 0),
(20, 23.1, 4, '2015-03-27 12:18:25', 0),
(21, 9, 5, '2015-03-27 12:18:26', 0),
(22, 98.9, 6, '2015-03-27 12:18:26', 0),
(23, 0, 7, '2015-03-27 12:18:27', 0),
(24, 0, 8, '2015-03-27 12:18:27', 0),
(25, 0, 9, '2015-03-27 12:18:27', 0),
(26, 1, 10, '2015-03-27 12:18:27', 0),
(27, 4.267, 2, '2015-03-27 12:20:00', 0),
(28, 29.187, 1, '2015-03-27 12:20:00', 0),
(29, 9.03, 5, '2015-03-27 12:20:02', 0),
(30, 99.4, 6, '2015-03-27 12:20:02', 0),
(31, 0, 7, '2015-03-27 12:20:03', 0),
(32, 0, 8, '2015-03-27 12:20:03', 0),
(33, 0, 9, '2015-03-27 12:20:04', 0),
(34, 1, 10, '2015-03-27 12:20:04', 0),
(35, 4.268, 2, '2015-03-27 13:48:15', 0),
(36, 25.875, 1, '2015-03-27 13:48:17', 0),
(37, 23.7, 3, '2015-03-27 13:48:17', 0),
(38, 23.3, 4, '2015-03-27 13:48:17', 0),
(39, 9.28, 5, '2015-03-27 13:48:19', 0),
(40, 102.1, 6, '2015-03-27 13:48:19', 0),
(41, 0, 7, '2015-03-27 13:48:20', 0),
(42, 0, 8, '2015-03-27 13:48:20', 0),
(43, 0, 9, '2015-03-27 13:48:20', 0),
(44, 1, 10, '2015-03-27 13:48:20', 0),
(45, 4.269, 2, '2015-03-27 13:50:04', 0),
(46, 25.75, 1, '2015-03-27 13:50:05', 0),
(47, 23.2, 3, '2015-03-27 13:50:06', 0),
(48, 24.1, 4, '2015-03-27 13:50:06', 0),
(49, 9.22, 5, '2015-03-27 13:50:08', 0),
(50, 101.4, 6, '2015-03-27 13:50:08', 0),
(51, 0, 7, '2015-03-27 13:50:09', 0),
(52, 0, 8, '2015-03-27 13:50:09', 0),
(53, 0, 9, '2015-03-27 13:50:09', 0),
(54, 1, 10, '2015-03-27 13:50:09', 0),
(55, 4.271, 2, '2015-03-27 13:50:36', 0),
(56, 25.75, 1, '2015-03-27 13:50:37', 0),
(57, 9.2, 5, '2015-03-27 13:50:40', 0),
(58, 101.2, 6, '2015-03-27 13:50:40', 0),
(59, 0, 7, '2015-03-27 13:50:41', 0),
(60, 0, 8, '2015-03-27 13:50:41', 0),
(61, 0, 9, '2015-03-27 13:50:41', 0),
(62, 1, 10, '2015-03-27 13:50:41', 0),
(63, 4.269, 2, '2015-03-27 13:54:36', 0),
(64, 25.625, 1, '2015-03-27 13:54:37', 0),
(65, 9.21, 5, '2015-03-27 13:54:39', 0),
(66, 101.3, 6, '2015-03-27 13:54:39', 0),
(67, 0, 7, '2015-03-27 13:54:40', 0),
(68, 0, 8, '2015-03-27 13:54:40', 0),
(69, 0, 9, '2015-03-27 13:54:40', 0),
(70, 1, 10, '2015-03-27 13:54:40', 0),
(71, 4.267, 2, '2015-03-27 13:58:13', 0),
(72, 25.562, 1, '2015-03-27 13:58:14', 0),
(73, 9.26, 5, '2015-03-27 13:58:16', 0),
(74, 101.8, 6, '2015-03-27 13:58:16', 0),
(75, 0, 7, '2015-03-27 13:58:18', 0),
(76, 0, 8, '2015-03-27 13:58:18', 0),
(77, 0, 9, '2015-03-27 13:58:18', 0),
(78, 1, 10, '2015-03-27 13:58:18', 0),
(79, 4.266, 2, '2015-03-27 13:58:55', 0),
(80, 25.562, 1, '2015-03-27 13:58:56', 0),
(81, 23.2, 3, '2015-03-27 13:58:57', 0),
(82, 23.6, 4, '2015-03-27 13:58:57', 0),
(83, 9.24, 5, '2015-03-27 13:58:59', 0),
(84, 101.7, 6, '2015-03-27 13:58:59', 0),
(85, 0, 7, '2015-03-27 13:59:00', 0),
(86, 0, 8, '2015-03-27 13:59:00', 0),
(87, 0, 9, '2015-03-27 13:59:00', 0),
(88, 1, 10, '2015-03-27 13:59:00', 0),
(89, 4.268, 2, '2015-03-27 14:02:43', 0),
(90, 25.5, 1, '2015-03-27 14:02:43', 0),
(91, 23.2, 3, '2015-03-27 14:02:44', 0),
(92, 23.8, 4, '2015-03-27 14:02:44', 0),
(93, 9.24, 5, '2015-03-27 14:02:45', 0),
(94, 101.7, 6, '2015-03-27 14:02:45', 0),
(95, 0, 7, '2015-03-27 14:02:46', 0),
(96, 0, 8, '2015-03-27 14:02:46', 0),
(97, 0, 9, '2015-03-27 14:02:46', 0),
(98, 1, 10, '2015-03-27 14:02:46', 0),
(99, 4.269, 2, '2015-03-27 14:05:30', 0),
(100, 25.5, 1, '2015-03-27 14:05:31', 0),
(101, 23.1, 3, '2015-03-27 14:05:32', 0),
(102, 23.3, 4, '2015-03-27 14:05:32', 0),
(103, 9.26, 5, '2015-03-27 14:05:33', 0),
(104, 101.8, 6, '2015-03-27 14:05:33', 0),
(105, 0, 7, '2015-03-27 14:05:34', 0),
(106, 0, 8, '2015-03-27 14:05:34', 0),
(107, 0, 9, '2015-03-27 14:05:34', 0),
(108, 1, 10, '2015-03-27 14:05:34', 0),
(109, 4.268, 2, '2015-03-27 14:15:36', 0),
(110, 27.5, 1, '2015-03-27 14:15:37', 0),
(111, 9.2, 5, '2015-03-27 14:15:39', 0),
(112, 101.2, 6, '2015-03-27 14:15:39', 0),
(113, 0, 7, '2015-03-27 14:15:40', 0),
(114, 0, 8, '2015-03-27 14:15:40', 0),
(115, 0, 9, '2015-03-27 14:15:40', 0),
(116, 1, 10, '2015-03-27 14:15:41', 0),
(117, 4.268, 2, '2015-03-27 14:16:05', 0),
(118, 27.625, 1, '2015-03-27 14:16:06', 0),
(119, 9.23, 5, '2015-03-27 14:16:08', 0),
(120, 101.6, 6, '2015-03-27 14:16:08', 0),
(121, 0, 7, '2015-03-27 14:16:09', 0),
(122, 0, 8, '2015-03-27 14:16:09', 0),
(123, 0, 9, '2015-03-27 14:16:09', 0),
(124, 1, 10, '2015-03-27 14:16:09', 0),
(125, 4.269, 2, '2015-03-27 14:17:03', 0),
(126, 27.75, 1, '2015-03-27 14:17:03', 0),
(127, 23.3, 3, '2015-03-27 14:17:04', 0),
(128, 23.5, 4, '2015-03-27 14:17:04', 0),
(129, 9.2, 5, '2015-03-27 14:17:05', 0),
(130, 101.2, 6, '2015-03-27 14:17:05', 0),
(131, 0, 7, '2015-03-27 14:17:06', 0),
(132, 0, 8, '2015-03-27 14:17:06', 0),
(133, 0, 9, '2015-03-27 14:17:06', 0),
(134, 1, 10, '2015-03-27 14:17:06', 0),
(135, 4.267, 2, '2015-03-27 14:17:36', 0),
(136, 27.875, 1, '2015-03-27 14:17:37', 0),
(137, 23.3, 3, '2015-03-27 14:17:38', 0),
(138, 23.5, 4, '2015-03-27 14:17:38', 0),
(139, 9.21, 5, '2015-03-27 14:17:39', 0),
(140, 101.3, 6, '2015-03-27 14:17:39', 0),
(141, 0, 7, '2015-03-27 14:17:41', 0),
(142, 0, 8, '2015-03-27 14:17:41', 0),
(143, 0, 9, '2015-03-27 14:17:41', 0),
(144, 1, 10, '2015-03-27 14:17:41', 0);

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
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=6 ;

--
-- Dumping data for table `t_PhysicalSensor`
--

INSERT INTO `t_PhysicalSensor` (`physical_id`, `cloudia_unit_id`, `physical_name`, `physical_t_type`, `physical_address`) VALUES
(1, 'su0001', 'Water PH', 2, '1:99'),
(2, 'su0002', 'Water Temperature', 4, '28-000006700658'),
(3, 'su0003', 'Case Temp/Hum', 5, '1:14'),
(4, 'su0004', 'Water DO', 1, '1:97'),
(5, 'su0005', 'Water Conductivity', 3, '1:100');

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
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=6 ;

--
-- Dumping data for table `t_Types`
--

INSERT INTO `t_Types` (`types_id`, `types_name`, `types_driver`) VALUES
(1, 'Atlas I2C DO', '/var/lib/cloud9/Aquarius/exec/driverAtlasI2CDO'),
(2, 'Atlas I2C PH', '/var/lib/cloud9/Aquarius/exec/driverAtlasI2CPH'),
(3, 'Atlas I2C K', '/var/lib/cloud9/Aquarius/exec/driverAtlasI2CK'),
(4, 'One Wire ', '/var/lib/cloud9/Aquarius/exec/driverOneWireExec '),
(5, 'DHT22', '/var/lib/cloud9/Aquarius/exec/driverDHT22Exec');

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
  PRIMARY KEY (`virtual_id`),
  UNIQUE KEY `unit_id_UNIQUE` (`virtual_id`),
  KEY `fk_t_unit_sensors_idx` (`virtual_t_physical`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=11 ;

--
-- Dumping data for table `t_VirtualSensor`
--

INSERT INTO `t_VirtualSensor` (`virtual_id`, `cloudia_id`, `virtual_measure_unit`, `virtual_t_physical`, `virtual_driver_pos`) VALUES
(1, '001', '°C', 2, 5),
(2, '001', 'pH', 1, 5),
(3, '001', '°C', 3, 5),
(4, '002', '% ', 3, 7),
(5, '001', '% ', 4, 5),
(6, '002', 'mg/L', 4, 7),
(7, '001', 'u/S', 5, 5),
(8, '002', 'TDS', 5, 7),
(9, '003', 'Salinity', 5, 9),
(10, '004', 'SG', 5, 11);

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
