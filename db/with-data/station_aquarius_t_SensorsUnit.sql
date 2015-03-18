CREATE DATABASE  IF NOT EXISTS `station_aquarius` /*!40100 DEFAULT CHARACTER SET latin1 */;
USE `station_aquarius`;
-- MySQL dump 10.13  Distrib 5.6.19, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: station_aquarius
-- ------------------------------------------------------
-- Server version	5.6.19-1~exp1ubuntu2

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `t_SensorsUnit`
--

DROP TABLE IF EXISTS `t_SensorsUnit`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `t_SensorsUnit` (
  `unit_id` int(11) NOT NULL AUTO_INCREMENT,
  `cloudia_unit_id` varchar(45) NOT NULL,
  `unit_name` varchar(45) NOT NULL,
  `unit_t_type` int(11) NOT NULL,
  `unit_address` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`unit_id`),
  UNIQUE KEY `sensors_id_UNIQUE` (`unit_id`),
  UNIQUE KEY `cloudia_id_UNIQUE` (`cloudia_unit_id`),
  UNIQUE KEY `sensors_name_UNIQUE` (`unit_name`),
  KEY `fk_t_sensor_type_idx` (`unit_t_type`),
  CONSTRAINT `fk_t_sensor_type` FOREIGN KEY (`unit_t_type`) REFERENCES `t_Types` (`types_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_SensorsUnit`
--

LOCK TABLES `t_SensorsUnit` WRITE;
/*!40000 ALTER TABLE `t_SensorsUnit` DISABLE KEYS */;
INSERT INTO `t_SensorsUnit` VALUES (1,'su0001','Water PH',2,'1:99'),(2,'su0002','Water Temperature',4,'28-000006052315'),(3,'su0003','Case Temp/Hum',5,'1:14'),(4,'su0004','Water DO',1,'1:100'),(5,'su0005','Water Conductivity',3,'1:103');
/*!40000 ALTER TABLE `t_SensorsUnit` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2015-03-18  9:42:54
