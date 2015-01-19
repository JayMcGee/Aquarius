-- phpMyAdmin SQL Dump
-- version 4.2.7.1
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Nov 07, 2014 at 08:27 PM
-- Server version: 5.6.20
-- PHP Version: 5.5.15

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `stationmeteocegep`
--
CREATE DATABASE IF NOT EXISTS `stationmeteocegep` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `stationmeteocegep`;

-- --------------------------------------------------------

--
-- Table structure for table `datastation`
--

CREATE TABLE IF NOT EXISTS `datastation` (
`stationID` int(11) NOT NULL,
  `dataDate` datetime DEFAULT NULL,
  `dataSunrise` time DEFAULT NULL,
  `dataSundown` time DEFAULT NULL,
  `dataInTemp` float DEFAULT NULL,
  `dataInHum` int(11) DEFAULT NULL,
  `dataOutTemp` float DEFAULT NULL,
  `dataOutHum` int(11) DEFAULT NULL,
  `dataRainIn` float DEFAULT NULL,
  `dataSpd` int(11) DEFAULT NULL,
  `dataAvgSpd` int(11) DEFAULT NULL,
  `dataWindDir` int(11) DEFAULT NULL,
  `dataPressure` float NOT NULL
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 COMMENT='Représente une lecture de la station météo' AUTO_INCREMENT=393 ;

--
-- Dumping data for table `datastation`
--

INSERT INTO `datastation` (`stationID`, `dataDate`, `dataSunrise`, `dataSundown`, `dataInTemp`, `dataInHum`, `dataOutTemp`, `dataOutHum`, `dataRainIn`, `dataSpd`, `dataAvgSpd`, `dataWindDir`, `dataPressure`) VALUES
(3, '2014-11-04 10:25:56', '06:31:00', '16:31:00', 72, 20, 39, 79, 0, 3, 3, 177, 29),
(4, '2014-11-04 10:26:00', '06:31:00', '16:31:00', 72, 20, 39, 79, 0, 3, 3, 178, 29),
(5, '2014-11-04 10:26:04', '06:31:00', '16:31:00', 72, 20, 39, 79, 0, 3, 3, 178, 29),
(6, '2014-11-04 10:44:33', '06:31:00', '16:31:00', 72, 20, 40, 83, 0, 1, 1, 189, 29),
(7, '2014-11-04 11:08:05', '06:31:00', '16:31:00', 72, 20, 40, 85, 0, 0, 1, 182, 29),
(8, '2014-11-04 11:08:11', '06:31:00', '16:31:00', 72, 20, 40, 85, 0, 0, 1, 182, 29),
(9, '2014-11-04 11:08:17', '06:31:00', '16:31:00', 72, 20, 40, 85, 0, 0, 1, 182, 29),
(10, '2014-11-04 11:08:24', '06:31:00', '16:31:00', 72, 20, 40, 85, 0, 0, 1, 182, 29),
(11, '2014-11-04 11:08:31', '06:31:00', '16:31:00', 72, 20, 40, 85, 0, 0, 1, 182, 29),
(12, '2014-11-04 11:08:38', '06:31:00', '16:31:00', 72, 20, 40, 85, 0, 0, 1, 182, 29),
(13, '2014-11-04 11:08:47', '06:31:00', '16:31:00', 72, 20, 40, 85, 0, 0, 1, 182, 29),
(14, '2014-11-04 11:08:54', '06:31:00', '16:31:00', 72, 20, 40, 85, 0, 0, 1, 182, 29),
(15, '2014-11-04 11:09:00', '06:31:00', '16:31:00', 72, 20, 40, 85, 0, 0, 1, 182, 29),
(16, '2014-11-04 11:09:06', '06:31:00', '16:31:00', 72, 20, 40, 85, 0, 0, 1, 182, 29),
(17, '2014-11-04 11:09:13', '06:31:00', '16:31:00', 72, 20, 40, 85, 0, 0, 1, 182, 29),
(18, '2014-11-04 11:09:19', '06:31:00', '16:31:00', 72, 20, 40, 85, 0, 0, 1, 182, 29),
(19, '2014-11-04 11:09:26', '06:31:00', '16:31:00', 72, 20, 40, 85, 0, 0, 1, 181, 29),
(20, '2014-11-04 11:09:33', '06:31:00', '16:31:00', 72, 20, 40, 85, 0, 0, 1, 182, 29),
(21, '2014-11-04 11:09:39', '06:31:00', '16:31:00', 72, 20, 40, 85, 0, 0, 1, 182, 29),
(22, '2014-11-04 11:09:45', '06:31:00', '16:31:00', 72, 20, 40, 85, 0, 0, 1, 182, 29),
(23, '2014-11-04 11:09:51', '06:31:00', '16:31:00', 72, 20, 40, 85, 0, 0, 1, 181, 29),
(24, '2014-11-04 11:09:58', '06:31:00', '16:31:00', 72, 20, 40, 85, 0, 0, 0, 181, 29),
(25, '2014-11-04 11:10:04', '06:31:00', '16:31:00', 72, 20, 40, 85, 0, 0, 0, 182, 29),
(26, '2014-11-04 11:10:10', '06:31:00', '16:31:00', 72, 20, 40, 86, 0, 0, 0, 182, 29),
(27, '2014-11-04 11:10:17', '06:31:00', '16:31:00', 72, 20, 40, 86, 0, 0, 0, 182, 29),
(28, '2014-11-04 11:10:24', '06:31:00', '16:31:00', 72, 20, 40, 86, 0, 0, 0, 181, 29),
(29, '2014-11-04 11:10:30', '06:31:00', '16:31:00', 72, 20, 40, 86, 0, 0, 0, 182, 29),
(30, '2014-11-04 11:10:36', '06:31:00', '16:31:00', 72, 20, 40, 86, 0, 0, 0, 182, 29),
(31, '2014-11-04 11:10:43', '06:31:00', '16:31:00', 72, 20, 40, 86, 0, 0, 0, 182, 29),
(32, '2014-11-04 11:10:49', '06:31:00', '16:31:00', 72, 20, 40, 86, 0, 0, 0, 181, 29),
(33, '2014-11-04 11:10:56', '06:31:00', '16:31:00', 72, 20, 40, 86, 0, 1, 0, 181, 29),
(34, '2014-11-04 11:11:02', '06:31:00', '16:31:00', 72, 20, 40, 86, 0, 1, 0, 181, 29),
(35, '2014-11-04 11:11:09', '06:31:00', '16:31:00', 72, 20, 40, 86, 0, 1, 0, 181, 29),
(36, '2014-11-04 11:11:16', '06:31:00', '16:31:00', 72, 20, 40, 86, 0, 0, 0, 181, 29),
(37, '2014-11-04 11:11:22', '06:31:00', '16:31:00', 72, 20, 40, 86, 0, 0, 0, 181, 29),
(38, '2014-11-04 11:11:28', '06:31:00', '16:31:00', 72, 20, 40, 86, 0, 0, 0, 181, 29),
(39, '2014-11-04 11:11:35', '06:31:00', '16:31:00', 72, 20, 40, 86, 0, 0, 0, 181, 29),
(40, '2014-11-04 11:11:41', '06:31:00', '16:31:00', 72, 20, 40, 86, 0, 0, 0, 181, 29),
(41, '2014-11-04 11:11:49', '06:31:00', '16:31:00', 72, 20, 40, 86, 0, 0, 0, 181, 29),
(42, '2014-11-04 11:11:55', '06:31:00', '16:31:00', 72, 20, 40, 86, 0, 0, 0, 181, 29),
(43, '2014-11-04 11:12:01', '06:31:00', '16:31:00', 72, 20, 40, 86, 0, 0, 0, 181, 29),
(44, '2014-11-04 11:12:07', '06:31:00', '16:31:00', 72, 20, 40, 86, 0, 0, 0, 181, 29),
(45, '2014-11-04 11:12:14', '06:31:00', '16:31:00', 72, 20, 40, 86, 0, 0, 0, 181, 29),
(46, '2014-11-04 11:12:20', '06:31:00', '16:31:00', 72, 20, 40, 86, 0, 0, 0, 181, 29),
(47, '2014-11-04 11:12:27', '06:31:00', '16:31:00', 72, 20, 40, 86, 0, 0, 0, 181, 29),
(48, '2014-11-04 11:12:33', '06:31:00', '16:31:00', 72, 20, 40, 86, 0, 0, 0, 181, 29),
(49, '2014-11-04 11:12:40', '06:31:00', '16:31:00', 72, 20, 40, 86, 0, 0, 0, 181, 29),
(50, '2014-11-04 11:12:46', '06:31:00', '16:31:00', 72, 20, 40, 86, 0, 0, 0, 181, 29),
(51, '2014-11-04 11:12:52', '06:31:00', '16:31:00', 72, 20, 40, 86, 0, 0, 0, 181, 29),
(52, '2014-11-04 11:12:58', '06:31:00', '16:31:00', 72, 20, 40, 86, 0, 0, 0, 181, 29),
(53, '2014-11-04 11:13:05', '06:31:00', '16:31:00', 72, 20, 40, 86, 0, 0, 0, 181, 29),
(54, '2014-11-04 11:13:11', '06:31:00', '16:31:00', 72, 20, 40, 86, 0, 1, 0, 181, 29),
(55, '2014-11-04 11:13:18', '06:31:00', '16:31:00', 72, 20, 40, 86, 0, 0, 0, 181, 29),
(56, '2014-11-04 11:13:24', '06:31:00', '16:31:00', 72, 20, 40, 86, 0, 1, 0, 181, 29),
(57, '2014-11-04 11:13:33', '06:31:00', '16:31:00', 72, 20, 40, 85, 0, 1, 0, 181, 29),
(58, '2014-11-04 11:13:40', '06:31:00', '16:31:00', 72, 20, 40, 85, 0, 1, 0, 181, 29),
(59, '2014-11-04 11:13:46', '06:31:00', '16:31:00', 72, 20, 40, 85, 0, 0, 0, 181, 29),
(60, '2014-11-04 11:13:52', '06:31:00', '16:31:00', 72, 20, 40, 85, 0, 0, 0, 181, 29),
(61, '2014-11-04 11:14:06', '06:31:00', '16:31:00', 72, 20, 40, 85, 0, 0, 0, 181, 29),
(62, '2014-11-04 11:14:12', '06:31:00', '16:31:00', 72, 20, 40, 85, 0, 0, 0, 181, 29),
(63, '2014-11-04 11:14:18', '06:31:00', '16:31:00', 72, 20, 40, 85, 0, 0, 0, 181, 29),
(64, '2014-11-04 11:14:25', '06:31:00', '16:31:00', 72, 20, 40, 84, 0, 0, 0, 181, 29),
(65, '2014-11-04 11:14:31', '06:31:00', '16:31:00', 72, 20, 40, 84, 0, 0, 0, 181, 29),
(66, '2014-11-04 11:14:37', '06:31:00', '16:31:00', 72, 20, 40, 84, 0, 0, 0, 181, 29),
(67, '2014-11-04 11:14:44', '06:31:00', '16:31:00', 72, 20, 40, 84, 0, 0, 0, 181, 29),
(68, '2014-11-04 11:14:50', '06:31:00', '16:31:00', 72, 20, 40, 84, 0, 0, 0, 181, 29),
(69, '2014-11-04 11:14:56', '06:31:00', '16:31:00', 72, 20, 40, 84, 0, 1, 0, 181, 29),
(70, '2014-11-04 11:15:10', '06:31:00', '16:31:00', 72, 20, 40, 84, 0, 1, 0, 181, 29),
(71, '2014-11-04 11:15:16', '06:31:00', '16:31:00', 72, 20, 40, 85, 0, 1, 0, 181, 29),
(72, '2014-11-04 11:15:23', '06:31:00', '16:31:00', 72, 20, 40, 85, 0, 1, 0, 181, 29),
(73, '2014-11-04 11:15:29', '06:31:00', '16:31:00', 72, 20, 40, 85, 0, 1, 0, 181, 29),
(74, '2014-11-04 11:15:35', '06:31:00', '16:31:00', 72, 20, 40, 85, 0, 1, 0, 181, 29),
(75, '2014-11-04 11:15:42', '06:31:00', '16:31:00', 72, 20, 40, 85, 0, 1, 0, 181, 29),
(76, '2014-11-04 11:15:48', '06:31:00', '16:31:00', 72, 20, 40, 85, 0, 1, 0, 181, 29),
(77, '2014-11-04 11:15:55', '06:31:00', '16:31:00', 72, 20, 40, 85, 0, 0, 0, 181, 29),
(78, '2014-11-04 11:16:01', '06:31:00', '16:31:00', 72, 20, 40, 85, 0, 0, 0, 181, 29),
(79, '2014-11-04 11:16:08', '06:31:00', '16:31:00', 72, 20, 40, 85, 0, 0, 0, 181, 29),
(80, '2014-11-04 11:16:15', '06:31:00', '16:31:00', 72, 20, 40, 85, 0, 0, 0, 181, 29),
(81, '2014-11-04 11:16:21', '06:31:00', '16:31:00', 72, 20, 40, 85, 0, 0, 0, 181, 29),
(82, '2014-11-04 11:16:27', '06:31:00', '16:31:00', 72, 20, 40, 85, 0, 0, 0, 181, 29),
(83, '2014-11-04 11:16:34', '06:31:00', '16:31:00', 72, 20, 40, 85, 0, 0, 0, 181, 29),
(84, '2014-11-04 11:16:41', '06:31:00', '16:31:00', 72, 20, 40, 85, 0, 0, 0, 181, 29),
(85, '2014-11-04 11:16:47', '06:31:00', '16:31:00', 72, 20, 40, 85, 0, 0, 0, 181, 29),
(86, '2014-11-04 11:16:53', '06:31:00', '16:31:00', 72, 20, 40, 85, 0, 0, 0, 181, 29),
(87, '2014-11-04 11:17:00', '06:31:00', '16:31:00', 72, 21, 40, 85, 0, 0, 0, 181, 29),
(88, '2014-11-04 11:17:06', '06:31:00', '16:31:00', 72, 21, 40, 85, 0, 0, 0, 181, 29),
(89, '2014-11-04 11:17:13', '06:31:00', '16:31:00', 72, 21, 40, 85, 0, 0, 0, 181, 29),
(90, '2014-11-04 11:17:19', '06:31:00', '16:31:00', 72, 21, 40, 85, 0, 0, 0, 181, 29),
(91, '2014-11-04 11:17:26', '06:31:00', '16:31:00', 72, 21, 40, 85, 0, 0, 0, 181, 29),
(92, '2014-11-04 11:17:33', '06:31:00', '16:31:00', 72, 21, 40, 85, 0, 0, 0, 181, 29),
(93, '2014-11-04 11:17:39', '06:31:00', '16:31:00', 72, 21, 40, 85, 0, 0, 0, 181, 29),
(94, '2014-11-04 11:22:13', '06:31:00', '16:31:00', 72, 21, 40, 84, 0, 2, 0, 120, 29),
(95, '2014-11-04 11:22:19', '06:31:00', '16:31:00', 72, 21, 40, 84, 0, 2, 0, 120, 29),
(96, '2014-11-04 11:22:26', '06:31:00', '16:31:00', 72, 21, 40, 84, 0, 2, 0, 119, 29),
(97, '2014-11-04 11:22:32', '06:31:00', '16:31:00', 72, 21, 40, 84, 0, 2, 0, 118, 29),
(98, '2014-11-04 11:22:38', '06:31:00', '16:31:00', 72, 21, 40, 84, 0, 2, 0, 116, 29),
(99, '2014-11-04 11:22:45', '06:31:00', '16:31:00', 72, 21, 40, 84, 0, 3, 0, 114, 29),
(100, '2014-11-04 11:22:51', '06:31:00', '16:31:00', 72, 21, 40, 84, 0, 2, 0, 114, 29),
(101, '2014-11-04 11:22:58', '06:31:00', '16:31:00', 72, 21, 40, 84, 0, 2, 1, 113, 29),
(102, '2014-11-04 11:23:04', '06:31:00', '16:31:00', 72, 21, 40, 84, 0, 2, 1, 113, 29),
(103, '2014-11-04 11:23:11', '06:31:00', '16:31:00', 72, 21, 40, 84, 0, 2, 1, 112, 29),
(104, '2014-11-04 11:23:17', '06:31:00', '16:31:00', 72, 21, 40, 84, 0, 3, 1, 92, 29),
(105, '2014-11-04 11:23:23', '06:31:00', '16:31:00', 72, 21, 40, 84, 0, 2, 1, 91, 29),
(106, '2014-11-04 11:23:29', '06:31:00', '16:31:00', 72, 21, 40, 84, 0, 2, 1, 91, 29),
(107, '2014-11-04 11:23:36', '06:31:00', '16:31:00', 72, 21, 40, 84, 0, 2, 1, 93, 29),
(108, '2014-11-04 11:23:49', '06:31:00', '16:31:00', 72, 21, 40, 84, 0, 2, 1, 93, 29),
(109, '2014-11-04 11:23:56', '06:31:00', '16:31:00', 72, 21, 40, 84, 0, 1, 1, 93, 29),
(110, '2014-11-04 11:24:02', '06:31:00', '16:31:00', 72, 21, 40, 84, 0, 2, 1, 93, 29),
(111, '2014-11-04 11:24:08', '06:31:00', '16:31:00', 72, 21, 40, 84, 0, 2, 1, 93, 29),
(112, '2014-11-04 11:24:15', '06:31:00', '16:31:00', 72, 21, 40, 84, 0, 2, 1, 93, 29),
(113, '2014-11-04 11:24:21', '06:31:00', '16:31:00', 72, 21, 40, 84, 0, 1, 1, 93, 29),
(114, '2014-11-04 11:24:28', '06:31:00', '16:31:00', 72, 21, 40, 84, 0, 1, 1, 93, 29),
(115, '2014-11-04 11:24:35', '06:31:00', '16:31:00', 72, 21, 40, 84, 0, 0, 1, 93, 29),
(116, '2014-11-04 11:24:41', '06:31:00', '16:31:00', 72, 21, 40, 84, 0, 0, 1, 93, 29),
(117, '2014-11-04 11:24:48', '06:31:00', '16:31:00', 72, 21, 40, 84, 0, 1, 1, 96, 29),
(118, '2014-11-04 11:24:54', '06:31:00', '16:31:00', 72, 21, 40, 84, 0, 2, 1, 110, 29),
(119, '2014-11-04 11:25:00', '06:31:00', '16:31:00', 72, 21, 40, 84, 0, 1, 1, 111, 29),
(120, '2014-11-04 11:25:07', '06:31:00', '16:31:00', 72, 21, 40, 84, 0, 1, 1, 111, 29),
(121, '2014-11-04 11:25:13', '06:31:00', '16:31:00', 72, 21, 40, 84, 0, 1, 1, 111, 29),
(122, '2014-11-04 11:25:20', '06:31:00', '16:31:00', 72, 21, 40, 84, 0, 0, 1, 111, 29),
(123, '2014-11-04 11:25:26', '06:31:00', '16:31:00', 72, 21, 40, 84, 0, 0, 1, 111, 29),
(124, '2014-11-04 11:25:34', '06:31:00', '16:31:00', 72, 21, 40, 85, 0, 0, 1, 111, 29),
(125, '2014-11-04 11:25:40', '06:31:00', '16:31:00', 72, 21, 40, 85, 0, 2, 1, 91, 29),
(126, '2014-11-04 11:25:46', '06:31:00', '16:31:00', 72, 21, 40, 85, 0, 2, 1, 89, 29),
(127, '2014-11-04 11:25:53', '06:31:00', '16:31:00', 72, 21, 40, 85, 0, 2, 1, 89, 29),
(128, '2014-11-04 11:25:59', '06:31:00', '16:31:00', 72, 21, 40, 85, 0, 1, 1, 89, 29),
(129, '2014-11-04 11:26:06', '06:31:00', '16:31:00', 72, 21, 40, 85, 0, 1, 1, 95, 29),
(130, '2014-11-04 11:26:12', '06:31:00', '16:31:00', 72, 21, 40, 85, 0, 2, 1, 96, 29),
(131, '2014-11-04 11:26:18', '06:31:00', '16:31:00', 72, 21, 40, 85, 0, 1, 1, 95, 29),
(132, '2014-11-04 11:26:25', '06:31:00', '16:31:00', 72, 21, 40, 85, 0, 2, 1, 96, 29),
(133, '2014-11-04 11:26:31', '06:31:00', '16:31:00', 72, 21, 40, 85, 0, 2, 1, 95, 29),
(134, '2014-11-04 11:26:37', '06:31:00', '16:31:00', 72, 21, 40, 85, 0, 2, 1, 95, 29),
(135, '2014-11-04 11:26:44', '06:31:00', '16:31:00', 72, 21, 40, 85, 0, 2, 1, 95, 29),
(136, '2014-11-04 11:26:50', '06:31:00', '16:31:00', 72, 21, 40, 85, 0, 3, 1, 95, 29),
(137, '2014-11-04 11:26:56', '06:31:00', '16:31:00', 72, 21, 40, 85, 0, 1, 1, 102, 29),
(138, '2014-11-04 11:27:03', '06:31:00', '16:31:00', 72, 21, 40, 85, 0, 1, 1, 137, 29),
(139, '2014-11-04 11:27:09', '06:31:00', '16:31:00', 72, 21, 40, 85, 0, 2, 1, 159, 29),
(140, '2014-11-04 11:27:15', '06:31:00', '16:31:00', 72, 21, 40, 84, 0, 4, 1, 168, 29),
(141, '2014-11-04 11:27:22', '06:31:00', '16:31:00', 72, 21, 40, 84, 0, 2, 1, 168, 29),
(142, '2014-11-04 11:27:29', '06:31:00', '16:31:00', 72, 21, 40, 84, 0, 1, 1, 160, 29),
(143, '2014-11-04 11:27:35', '06:31:00', '16:31:00', 72, 21, 40, 84, 0, 1, 1, 142, 29),
(144, '2014-11-04 11:27:41', '06:31:00', '16:31:00', 72, 21, 40, 84, 0, 2, 1, 117, 29),
(145, '2014-11-04 11:27:48', '06:31:00', '16:31:00', 72, 21, 40, 84, 0, 2, 1, 113, 29),
(146, '2014-11-04 11:27:54', '06:31:00', '16:31:00', 72, 21, 40, 84, 0, 2, 1, 91, 29),
(147, '2014-11-04 11:28:01', '06:31:00', '16:31:00', 72, 21, 40, 84, 0, 2, 1, 95, 29),
(148, '2014-11-04 11:28:08', '06:31:00', '16:31:00', 72, 21, 40, 84, 0, 3, 1, 95, 29),
(149, '2014-11-04 11:28:15', '06:31:00', '16:31:00', 72, 21, 40, 84, 0, 3, 1, 93, 29),
(150, '2014-11-04 11:28:21', '06:31:00', '16:31:00', 72, 21, 40, 84, 0, 2, 1, 93, 29),
(151, '2014-11-04 11:28:27', '06:31:00', '16:31:00', 72, 21, 40, 84, 0, 2, 1, 93, 29),
(152, '2014-11-04 11:28:34', '06:31:00', '16:31:00', 72, 21, 40, 84, 0, 1, 1, 93, 29),
(153, '2014-11-04 11:28:40', '06:31:00', '16:31:00', 72, 21, 40, 84, 0, 1, 1, 94, 29),
(154, '2014-11-04 11:28:47', '06:31:00', '16:31:00', 72, 21, 40, 84, 0, 1, 1, 94, 29),
(155, '2014-11-04 11:28:53', '06:31:00', '16:31:00', 72, 21, 40, 84, 0, 1, 1, 93, 29),
(156, '2014-11-04 11:28:59', '06:31:00', '16:31:00', 72, 21, 40, 84, 0, 1, 2, 94, 29),
(157, '2014-11-04 11:29:06', '06:31:00', '16:31:00', 72, 21, 40, 84, 0, 1, 2, 97, 29),
(158, '2014-11-04 11:29:12', '06:31:00', '16:31:00', 72, 21, 40, 84, 0, 0, 2, 97, 29),
(159, '2014-11-04 11:29:18', '06:31:00', '16:31:00', 72, 21, 40, 84, 0, 1, 2, 98, 29),
(160, '2014-11-04 11:29:25', '06:31:00', '16:31:00', 72, 21, 40, 84, 0, 1, 2, 97, 29),
(161, '2014-11-04 11:29:32', '06:31:00', '16:31:00', 72, 21, 40, 84, 0, 0, 2, 97, 29),
(162, '2014-11-04 11:29:38', '06:31:00', '16:31:00', 72, 21, 40, 84, 0, 1, 2, 97, 29),
(163, '2014-11-04 11:29:44', '06:31:00', '16:31:00', 72, 21, 40, 84, 0, 1, 2, 112, 29),
(164, '2014-11-04 11:29:51', '06:31:00', '16:31:00', 72, 21, 40, 84, 0, 2, 2, 141, 29),
(165, '2014-11-04 11:29:57', '06:31:00', '16:31:00', 72, 21, 40, 84, 0, 2, 2, 149, 29),
(166, '2014-11-04 11:30:04', '06:31:00', '16:31:00', 72, 21, 40, 84, 0, 2, 2, 157, 29),
(167, '2014-11-04 11:30:10', '06:31:00', '16:31:00', 72, 21, 40, 84, 0, 2, 2, 156, 29),
(168, '2014-11-04 11:30:23', '06:31:00', '16:31:00', 72, 21, 40, 84, 0, 1, 2, 156, 29),
(169, '2014-11-04 11:30:29', '06:31:00', '16:31:00', 72, 21, 40, 84, 0, 1, 2, 156, 29),
(170, '2014-11-04 11:30:35', '06:31:00', '16:31:00', 72, 21, 40, 84, 0, 0, 2, 156, 29),
(171, '2014-11-04 11:30:41', '06:31:00', '16:31:00', 72, 21, 40, 84, 0, 0, 2, 156, 29),
(172, '2014-11-04 11:30:48', '06:31:00', '16:31:00', 72, 21, 40, 84, 0, 0, 2, 156, 29),
(173, '2014-11-04 11:30:54', '06:31:00', '16:31:00', 72, 21, 40, 84, 0, 0, 2, 156, 29),
(174, '2014-11-04 11:31:01', '06:31:00', '16:31:00', 72, 21, 40, 84, 0, 0, 2, 155, 29),
(175, '2014-11-04 11:31:07', '06:31:00', '16:31:00', 72, 21, 40, 84, 0, 1, 2, 156, 29),
(176, '2014-11-04 11:31:13', '06:31:00', '16:31:00', 72, 21, 40, 84, 0, 1, 2, 156, 29),
(177, '2014-11-04 11:31:20', '06:31:00', '16:31:00', 72, 21, 40, 84, 0, 1, 2, 157, 29),
(178, '2014-11-04 11:31:26', '06:31:00', '16:31:00', 72, 21, 40, 84, 0, 0, 2, 157, 29),
(179, '2014-11-04 11:31:32', '06:31:00', '16:31:00', 72, 21, 40, 84, 0, 1, 2, 157, 29),
(180, '2014-11-04 11:31:39', '06:31:00', '16:31:00', 72, 21, 40, 84, 0, 2, 2, 155, 29),
(181, '2014-11-04 11:31:45', '06:31:00', '16:31:00', 72, 21, 40, 84, 0, 1, 2, 160, 29),
(182, '2014-11-04 11:31:52', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 3, 2, 165, 29),
(183, '2014-11-04 11:31:58', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 3, 2, 166, 29),
(184, '2014-11-04 11:32:05', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 3, 2, 166, 29),
(185, '2014-11-04 11:32:12', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 3, 2, 166, 29),
(186, '2014-11-04 11:32:18', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 1, 2, 166, 29),
(187, '2014-11-04 11:32:24', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 2, 2, 132, 29),
(188, '2014-11-04 11:32:31', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 3, 2, 149, 29),
(189, '2014-11-04 11:32:37', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 2, 2, 177, 29),
(190, '2014-11-04 11:32:44', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 2, 2, 93, 29),
(191, '2014-11-04 11:32:50', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 2, 2, 87, 29),
(192, '2014-11-04 11:32:56', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 1, 2, 89, 29),
(193, '2014-11-04 11:33:03', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 1, 2, 139, 29),
(194, '2014-11-04 11:33:09', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 1, 2, 139, 29),
(195, '2014-11-04 11:33:15', '06:31:00', '16:31:00', 72, 21, 41, 83, 0, 2, 2, 141, 29),
(196, '2014-11-04 11:33:22', '06:31:00', '16:31:00', 72, 21, 41, 83, 0, 1, 2, 143, 29),
(197, '2014-11-04 11:33:28', '06:31:00', '16:31:00', 72, 21, 41, 83, 0, 3, 2, 150, 29),
(198, '2014-11-04 11:33:34', '06:31:00', '16:31:00', 72, 21, 41, 83, 0, 3, 2, 172, 29),
(199, '2014-11-04 11:33:41', '06:31:00', '16:31:00', 72, 21, 41, 83, 0, 2, 2, 145, 29),
(200, '2014-11-04 11:33:47', '06:31:00', '16:31:00', 72, 21, 41, 83, 0, 2, 2, 174, 29),
(201, '2014-11-04 11:33:54', '06:31:00', '16:31:00', 72, 21, 41, 83, 0, 3, 2, 165, 29),
(202, '2014-11-04 11:34:00', '06:31:00', '16:31:00', 72, 21, 41, 83, 0, 2, 2, 129, 29),
(203, '2014-11-04 11:34:07', '06:31:00', '16:31:00', 72, 21, 41, 83, 0, 1, 2, 116, 29),
(204, '2014-11-04 11:34:13', '06:31:00', '16:31:00', 72, 21, 41, 83, 0, 1, 2, 133, 29),
(205, '2014-11-04 11:34:20', '06:31:00', '16:31:00', 72, 21, 41, 83, 0, 1, 2, 131, 29),
(206, '2014-11-04 11:34:26', '06:31:00', '16:31:00', 72, 21, 41, 83, 0, 2, 2, 126, 29),
(207, '2014-11-04 11:34:33', '06:31:00', '16:31:00', 72, 21, 41, 83, 0, 2, 2, 125, 29),
(208, '2014-11-04 11:34:39', '06:31:00', '16:31:00', 72, 21, 41, 83, 0, 1, 2, 121, 29),
(209, '2014-11-04 11:34:46', '06:31:00', '16:31:00', 72, 21, 41, 83, 0, 0, 2, 121, 29),
(210, '2014-11-04 11:34:52', '06:31:00', '16:31:00', 72, 21, 41, 83, 0, 1, 2, 120, 29),
(211, '2014-11-04 11:34:58', '06:31:00', '16:31:00', 72, 21, 41, 83, 0, 1, 2, 114, 29),
(212, '2014-11-04 11:35:05', '06:31:00', '16:31:00', 72, 21, 41, 83, 0, 2, 2, 114, 29),
(213, '2014-11-04 11:35:11', '06:31:00', '16:31:00', 72, 21, 41, 83, 0, 1, 2, 114, 29),
(214, '2014-11-04 11:35:18', '06:31:00', '16:31:00', 72, 21, 41, 83, 0, 1, 2, 112, 29),
(215, '2014-11-04 11:35:25', '06:31:00', '16:31:00', 72, 21, 41, 83, 0, 1, 2, 113, 29),
(216, '2014-11-04 11:35:31', '06:31:00', '16:31:00', 72, 21, 41, 83, 0, 3, 2, 124, 29),
(217, '2014-11-04 11:35:37', '06:31:00', '16:31:00', 72, 21, 41, 83, 0, 3, 2, 177, 29),
(218, '2014-11-04 11:35:43', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 2, 2, 177, 29),
(219, '2014-11-04 11:35:50', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 2, 2, 176, 29),
(220, '2014-11-04 11:35:56', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 1, 2, 175, 29),
(221, '2014-11-04 11:36:03', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 1, 2, 175, 29),
(222, '2014-11-04 11:36:10', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 1, 2, 131, 29),
(223, '2014-11-04 11:36:16', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 2, 2, 133, 29),
(224, '2014-11-04 11:36:23', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 1, 2, 144, 29),
(225, '2014-11-04 11:36:29', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 2, 2, 152, 29),
(226, '2014-11-04 11:36:36', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 2, 2, 160, 29),
(227, '2014-11-04 11:36:43', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 2, 2, 159, 29),
(228, '2014-11-04 11:36:49', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 1, 2, 160, 29),
(229, '2014-11-04 11:36:55', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 2, 2, 169, 29),
(230, '2014-11-04 11:37:02', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 2, 2, 170, 29),
(231, '2014-11-04 11:37:08', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 2, 2, 170, 29),
(232, '2014-11-04 11:37:14', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 1, 2, 170, 29),
(233, '2014-11-04 11:37:21', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 3, 2, 185, 29),
(234, '2014-11-04 11:37:27', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 3, 2, 138, 29),
(235, '2014-11-04 11:37:34', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 3, 2, 188, 29),
(236, '2014-11-04 11:37:40', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 3, 2, 191, 29),
(237, '2014-11-04 11:37:47', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 3, 2, 201, 29),
(238, '2014-11-04 11:37:53', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 1, 2, 188, 29),
(239, '2014-11-04 11:37:59', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 3, 2, 188, 29),
(240, '2014-11-04 11:38:06', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 2, 2, 157, 29),
(241, '2014-11-04 11:38:12', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 1, 2, 158, 29),
(242, '2014-11-04 11:38:19', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 2, 2, 174, 29),
(243, '2014-11-04 11:38:25', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 1, 2, 174, 29),
(244, '2014-11-04 11:38:31', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 1, 2, 174, 29),
(245, '2014-11-04 11:38:38', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 3, 2, 174, 29),
(246, '2014-11-04 11:38:44', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 2, 2, 175, 29),
(247, '2014-11-04 11:38:51', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 2, 2, 160, 29),
(248, '2014-11-04 11:38:57', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 2, 2, 173, 29),
(249, '2014-11-04 11:39:03', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 3, 2, 156, 29),
(250, '2014-11-04 11:39:10', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 5, 2, 169, 29),
(251, '2014-11-04 11:39:16', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 3, 2, 193, 29),
(252, '2014-11-04 11:39:22', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 2, 2, 192, 29),
(253, '2014-11-04 11:39:29', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 1, 2, 171, 29),
(254, '2014-11-04 11:39:43', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 2, 2, 152, 29),
(255, '2014-11-04 11:39:49', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 1, 2, 152, 29),
(256, '2014-11-04 11:39:55', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 2, 2, 156, 29),
(257, '2014-11-04 11:40:02', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 2, 2, 158, 29),
(258, '2014-11-04 11:40:08', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 2, 2, 194, 29),
(259, '2014-11-04 11:40:15', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 2, 2, 194, 29),
(260, '2014-11-04 11:40:21', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 2, 2, 194, 29),
(261, '2014-11-04 11:40:27', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 2, 2, 189, 29),
(262, '2014-11-04 11:40:34', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 2, 2, 168, 29),
(263, '2014-11-04 11:40:41', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 2, 2, 164, 29),
(264, '2014-11-04 11:40:47', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 2, 2, 168, 29),
(265, '2014-11-04 11:40:53', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 2, 2, 168, 29),
(266, '2014-11-04 11:41:00', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 3, 2, 201, 29),
(267, '2014-11-04 11:41:06', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 2, 2, 203, 29),
(268, '2014-11-04 11:41:12', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 1, 2, 201, 29),
(269, '2014-11-04 11:41:19', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 1, 2, 201, 29),
(270, '2014-11-04 11:41:25', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 1, 2, 201, 29),
(271, '2014-11-04 11:41:32', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 2, 2, 191, 29),
(272, '2014-11-04 11:41:39', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 2, 2, 187, 29),
(273, '2014-11-04 11:41:46', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 3, 2, 187, 29),
(274, '2014-11-04 11:41:52', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 3, 2, 187, 29),
(275, '2014-11-04 11:41:58', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 1, 2, 187, 29),
(276, '2014-11-04 11:42:05', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 2, 2, 187, 29),
(277, '2014-11-04 11:42:11', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 1, 2, 187, 29),
(278, '2014-11-04 11:42:17', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 1, 2, 187, 29),
(279, '2014-11-04 11:42:24', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 1, 2, 187, 29),
(280, '2014-11-04 11:42:30', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 0, 2, 187, 29),
(281, '2014-11-04 11:42:37', '06:31:00', '16:31:00', 72, 21, 41, 85, 0, 1, 2, 149, 29),
(282, '2014-11-04 11:42:43', '06:31:00', '16:31:00', 72, 21, 41, 85, 0, 3, 2, 139, 29),
(283, '2014-11-04 11:42:51', '06:31:00', '16:31:00', 72, 21, 41, 85, 0, 3, 2, 133, 29),
(284, '2014-11-04 11:42:58', '06:31:00', '16:31:00', 72, 21, 41, 85, 0, 2, 2, 135, 29),
(285, '2014-11-04 11:43:04', '06:31:00', '16:31:00', 72, 21, 41, 85, 0, 2, 2, 135, 29),
(286, '2014-11-04 11:43:10', '06:31:00', '16:31:00', 72, 21, 41, 85, 0, 1, 2, 135, 29),
(287, '2014-11-04 11:43:17', '06:31:00', '16:31:00', 72, 21, 41, 85, 0, 2, 2, 138, 29),
(288, '2014-11-04 11:43:23', '06:31:00', '16:31:00', 72, 21, 41, 85, 0, 2, 2, 146, 29),
(289, '2014-11-04 11:43:29', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 2, 2, 147, 29),
(290, '2014-11-04 11:43:36', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 2, 2, 147, 29),
(291, '2014-11-04 11:43:43', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 2, 2, 147, 29),
(292, '2014-11-04 11:43:49', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 1, 2, 147, 29),
(293, '2014-11-04 11:43:55', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 1, 2, 147, 29),
(294, '2014-11-04 11:44:02', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 2, 2, 149, 29),
(295, '2014-11-04 11:44:08', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 2, 2, 194, 29),
(296, '2014-11-04 11:44:14', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 2, 2, 193, 29),
(297, '2014-11-04 11:44:21', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 1, 2, 193, 29),
(298, '2014-11-04 11:44:28', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 1, 2, 193, 29),
(299, '2014-11-04 11:44:34', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 2, 2, 181, 29),
(300, '2014-11-04 11:44:40', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 2, 2, 181, 29),
(301, '2014-11-04 11:44:47', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 2, 2, 196, 29),
(302, '2014-11-04 11:44:53', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 3, 2, 174, 29),
(303, '2014-11-04 11:45:00', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 3, 2, 177, 29),
(304, '2014-11-04 11:45:06', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 2, 2, 176, 29),
(305, '2014-11-04 11:45:13', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 2, 2, 175, 29),
(306, '2014-11-04 11:45:20', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 2, 2, 175, 29),
(307, '2014-11-04 11:45:26', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 3, 2, 174, 29),
(308, '2014-11-04 11:45:33', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 5, 2, 173, 29),
(309, '2014-11-04 11:45:39', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 2, 2, 170, 29),
(310, '2014-11-04 11:45:46', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 2, 2, 169, 29),
(311, '2014-11-04 11:45:52', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 1, 2, 170, 29),
(312, '2014-11-04 11:45:59', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 2, 2, 170, 29),
(313, '2014-11-04 11:46:05', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 2, 2, 170, 29),
(314, '2014-11-04 11:46:11', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 1, 2, 170, 29),
(315, '2014-11-04 11:46:18', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 1, 2, 170, 29),
(316, '2014-11-04 11:46:24', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 1, 2, 170, 29),
(317, '2014-11-04 11:46:30', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 1, 2, 170, 29),
(318, '2014-11-04 11:46:37', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 1, 2, 170, 29),
(319, '2014-11-04 11:46:44', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 1, 2, 170, 29),
(320, '2014-11-04 11:46:50', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 1, 2, 170, 29),
(321, '2014-11-04 11:46:56', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 2, 2, 177, 29),
(322, '2014-11-04 11:47:03', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 4, 2, 181, 29),
(323, '2014-11-04 11:47:10', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 3, 2, 181, 29),
(324, '2014-11-04 11:47:16', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 2, 2, 179, 29),
(325, '2014-11-04 11:47:22', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 2, 2, 177, 29),
(326, '2014-11-04 11:47:29', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 3, 2, 181, 29),
(327, '2014-11-04 11:47:35', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 3, 2, 180, 29),
(328, '2014-11-04 11:47:42', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 2, 2, 180, 29),
(329, '2014-11-04 11:47:49', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 3, 2, 182, 29),
(330, '2014-11-04 11:47:55', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 3, 2, 185, 29),
(331, '2014-11-04 11:48:01', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 3, 2, 185, 29),
(332, '2014-11-04 11:48:08', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 2, 2, 185, 29),
(333, '2014-11-04 11:48:14', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 3, 2, 185, 29),
(334, '2014-11-04 11:48:20', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 3, 2, 194, 29),
(335, '2014-11-04 11:48:27', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 3, 2, 193, 29),
(336, '2014-11-04 11:48:33', '06:31:00', '16:31:00', 72, 21, 41, 83, 0, 4, 2, 191, 29),
(337, '2014-11-04 11:48:39', '06:31:00', '16:31:00', 72, 21, 41, 83, 0, 3, 2, 191, 29),
(338, '2014-11-04 11:48:46', '06:31:00', '16:31:00', 72, 21, 41, 83, 0, 2, 2, 186, 29),
(339, '2014-11-04 11:48:52', '06:31:00', '16:31:00', 72, 21, 41, 83, 0, 2, 2, 186, 29),
(340, '2014-11-04 11:48:59', '06:31:00', '16:31:00', 72, 21, 41, 83, 0, 1, 2, 185, 29),
(341, '2014-11-04 11:49:06', '06:31:00', '16:31:00', 72, 21, 41, 83, 0, 2, 2, 184, 29),
(342, '2014-11-04 11:49:12', '06:31:00', '16:31:00', 72, 21, 41, 83, 0, 2, 2, 183, 29),
(343, '2014-11-04 11:49:18', '06:31:00', '16:31:00', 72, 21, 41, 83, 0, 2, 2, 184, 29),
(344, '2014-11-04 11:49:25', '06:31:00', '16:31:00', 72, 21, 41, 83, 0, 2, 2, 184, 29),
(345, '2014-11-04 11:49:31', '06:31:00', '16:31:00', 72, 21, 41, 83, 0, 2, 2, 184, 29),
(346, '2014-11-04 11:49:38', '06:31:00', '16:31:00', 72, 21, 41, 83, 0, 2, 2, 185, 29),
(347, '2014-11-04 11:49:46', '06:31:00', '16:31:00', 72, 21, 41, 83, 0, 3, 2, 185, 29),
(348, '2014-11-04 11:49:53', '06:31:00', '16:31:00', 72, 21, 41, 83, 0, 2, 2, 185, 29),
(349, '2014-11-04 11:49:59', '06:31:00', '16:31:00', 72, 21, 41, 83, 0, 1, 2, 185, 29),
(350, '2014-11-04 11:50:06', '06:31:00', '16:31:00', 72, 21, 41, 83, 0, 2, 2, 183, 29),
(351, '2014-11-04 11:50:12', '06:31:00', '16:31:00', 72, 21, 41, 83, 0, 2, 2, 182, 29),
(352, '2014-11-04 11:50:18', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 1, 2, 182, 29),
(353, '2014-11-04 11:50:24', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 1, 2, 180, 29),
(354, '2014-11-04 11:50:31', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 2, 2, 139, 29),
(355, '2014-11-04 11:50:37', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 2, 2, 139, 29),
(356, '2014-11-04 11:50:44', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 1, 2, 141, 29),
(357, '2014-11-04 11:50:50', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 1, 2, 141, 29),
(358, '2014-11-04 11:50:57', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 2, 2, 141, 29),
(359, '2014-11-04 11:51:03', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 2, 2, 141, 29),
(360, '2014-11-04 11:51:10', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 2, 2, 141, 29),
(361, '2014-11-04 11:51:16', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 1, 2, 141, 29),
(362, '2014-11-04 11:51:22', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 1, 2, 141, 29),
(363, '2014-11-04 11:51:28', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 1, 2, 141, 29),
(364, '2014-11-04 11:51:35', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 1, 2, 141, 29),
(365, '2014-11-04 11:51:41', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 1, 2, 141, 29),
(366, '2014-11-04 11:51:48', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 0, 2, 141, 29),
(367, '2014-11-04 11:51:54', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 0, 2, 141, 29),
(368, '2014-11-04 11:52:01', '06:31:00', '16:31:00', 72, 21, 41, 85, 0, 0, 2, 142, 29),
(369, '2014-11-04 11:52:07', '06:31:00', '16:31:00', 72, 21, 41, 85, 0, 0, 2, 142, 29),
(370, '2014-11-04 11:52:14', '06:31:00', '16:31:00', 72, 21, 41, 85, 0, 0, 2, 142, 29),
(371, '2014-11-04 11:52:20', '06:31:00', '16:31:00', 72, 21, 41, 85, 0, 1, 2, 158, 29),
(372, '2014-11-04 11:52:26', '06:31:00', '16:31:00', 72, 21, 41, 85, 0, 2, 2, 160, 29),
(373, '2014-11-04 11:52:33', '06:31:00', '16:31:00', 72, 21, 41, 85, 0, 1, 2, 160, 29),
(374, '2014-11-04 11:52:39', '06:31:00', '16:31:00', 72, 21, 41, 85, 0, 1, 2, 160, 29),
(375, '2014-11-04 11:52:46', '06:31:00', '16:31:00', 72, 21, 41, 85, 0, 1, 2, 160, 29),
(376, '2014-11-04 11:52:52', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 1, 2, 160, 29),
(377, '2014-11-04 11:52:59', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 1, 2, 160, 29),
(378, '2014-11-04 11:53:05', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 1, 2, 160, 29),
(379, '2014-11-04 11:53:12', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 1, 2, 162, 29),
(380, '2014-11-04 11:53:18', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 1, 2, 204, 29),
(381, '2014-11-04 11:53:25', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 1, 2, 197, 29),
(382, '2014-11-04 11:53:31', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 1, 2, 197, 29),
(383, '2014-11-04 11:53:38', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 1, 2, 179, 29),
(384, '2014-11-04 11:53:44', '06:31:00', '16:31:00', 72, 21, 41, 84, 0, 2, 2, 195, 29),
(385, '2014-11-04 12:15:48', '06:31:00', '16:31:00', 73, 21, 42, 84, 0, 1, 1, 181, 29),
(386, '2014-11-06 11:01:17', '06:34:00', '16:28:00', 72, 22, 43, 70, 0, 1, 2, 154, 29),
(387, '2014-11-06 11:06:19', '06:34:00', '16:28:00', 72, 22, 43, 70, 0, 4, 1, 189, 29),
(388, '2014-11-06 11:11:20', '06:34:00', '16:28:00', 72, 22, 43, 69, 0, 2, 1, 164, 29),
(389, '2014-11-06 11:16:21', '06:34:00', '16:28:00', 72, 22, 44, 69, 0, 0, 2, 168, 29),
(390, '2014-11-06 11:21:23', '06:34:00', '16:28:00', 72, 22, 44, 68, 0, 3, 1, 183, 29),
(391, '2014-11-06 11:26:25', '06:34:00', '16:28:00', 72, 22, 44, 68, 0, 1, 1, 181, 29),
(392, '2014-11-06 11:31:26', '06:34:00', '16:28:00', 72, 22, 44, 67, 0, 2, 1, 324, 29);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `datastation`
--
ALTER TABLE `datastation`
 ADD PRIMARY KEY (`stationID`), ADD KEY `IndexDate` (`dataDate`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `datastation`
--
ALTER TABLE `datastation`
MODIFY `stationID` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=393;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
