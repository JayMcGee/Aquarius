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
-- Table structure for table `t_Config`
--

DROP TABLE IF EXISTS `t_Config`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `t_Config` (
  `config_id` int(11) NOT NULL AUTO_INCREMENT,
  `config_key_name` varchar(45) NOT NULL,
  `config_key_value` varchar(45) NOT NULL,
  `config_key_description` varchar(45) NOT NULL,
  PRIMARY KEY (`config_id`),
  UNIQUE KEY `config_key_name_UNIQUE` (`config_key_name`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_Config`
--

LOCK TABLES `t_Config` WRITE;
/*!40000 ALTER TABLE `t_Config` DISABLE KEYS */;
INSERT INTO `t_Config` VALUES (1,'READ_INTERVAL','5','Minutes between each read operation'),(2,'SEND_ADDRESS','www.cloudiaproject.org/c/data.json','ClouDIA data send address'),(3,'LAST_KNOWN_DATE','Wed Mar 18 09:24:40 UTC 2015','Last known operating date'),(4,'STATION_ID','sta001','ClouDIA station ID'),(5,'NUMBER_RETRYS','5','Number of read attempts on sensors');
/*!40000 ALTER TABLE `t_Config` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t_Data`
--

DROP TABLE IF EXISTS `t_Data`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `t_Data` (
  `idt_Data` int(11) NOT NULL AUTO_INCREMENT,
  `data_value` float NOT NULL,
  `data_t_unit` int(11) NOT NULL,
  `data_date` datetime NOT NULL,
  `data_is_sent` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`idt_Data`),
  UNIQUE KEY `idt_Data_UNIQUE` (`idt_Data`),
  KEY `fk_t_data_unit_idx` (`data_t_unit`),
  CONSTRAINT `fk_t_data_unit` FOREIGN KEY (`data_t_unit`) REFERENCES `t_Sensor` (`sensor_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=107 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_Data`
--

LOCK TABLES `t_Data` WRITE;
/*!40000 ALTER TABLE `t_Data` DISABLE KEYS */;
INSERT INTO `t_Data` VALUES (1,4.296,2,'2014-05-15 04:40:01',0),(2,23.562,1,'2014-05-15 04:40:02',0),(3,9.14,5,'2014-05-15 04:40:04',0),(4,100.5,6,'2014-05-15 04:40:04',0),(5,0,7,'2014-05-15 04:40:05',0),(6,0,8,'2014-05-15 04:40:05',0),(7,0,9,'2014-05-15 04:40:05',0),(8,1,10,'2014-05-15 04:40:05',0),(9,4.298,2,'2000-01-01 03:02:59',0),(10,23.437,1,'2000-01-01 03:03:00',0),(11,9.16,5,'2000-01-01 03:03:01',0),(12,100.8,6,'2000-01-01 03:03:01',0),(13,0,7,'2000-01-01 03:03:03',0),(14,0,8,'2000-01-01 03:03:03',0),(15,0,9,'2000-01-01 03:03:03',0),(16,1,10,'2000-01-01 03:03:03',0),(17,4.291,2,'2015-03-18 16:32:35',0),(18,23.437,1,'2015-03-18 16:32:36',0),(19,9.12,5,'2015-03-18 16:32:37',0),(20,100.4,6,'2015-03-18 16:32:38',0),(21,0,7,'2015-03-18 16:32:39',0),(22,0,8,'2015-03-18 16:32:39',0),(23,0,9,'2015-03-18 16:32:39',0),(24,1,10,'2015-03-18 16:32:39',0),(25,4.291,2,'2015-03-18 16:33:49',0),(26,23.375,1,'2015-03-18 16:33:50',0),(27,9.17,5,'2015-03-18 16:33:52',0),(28,100.9,6,'2015-03-18 16:33:52',0),(29,0,7,'2015-03-18 16:33:54',0),(30,0,8,'2015-03-18 16:33:54',0),(31,0,9,'2015-03-18 16:33:54',0),(32,1,10,'2015-03-18 16:33:54',0),(33,4.294,2,'2015-03-18 16:33:55',0),(34,23.375,1,'2015-03-18 16:33:56',0),(35,23.3,3,'2015-03-18 16:33:57',0),(36,24.6,4,'2015-03-18 16:33:57',0),(37,9.12,5,'2015-03-18 16:33:58',0),(38,100.3,6,'2015-03-18 16:33:58',0),(39,0,7,'2015-03-18 16:33:59',0),(40,0,8,'2015-03-18 16:33:59',0),(41,0,9,'2015-03-18 16:33:59',0),(42,1,10,'2015-03-18 16:33:59',0),(43,4.293,2,'2015-03-18 16:34:55',0),(44,23.437,1,'2015-03-18 16:34:56',0),(45,23.3,3,'2015-03-18 16:34:56',0),(46,24.7,4,'2015-03-18 16:34:56',0),(47,9.15,5,'2015-03-18 16:34:57',0),(48,100.6,6,'2015-03-18 16:34:57',0),(49,0,7,'2015-03-18 16:34:59',0),(50,0,8,'2015-03-18 16:34:59',0),(51,0,9,'2015-03-18 16:34:59',0),(52,1,10,'2015-03-18 16:34:59',0),(53,4.292,2,'2015-03-18 16:35:00',0),(54,23.375,1,'2015-03-18 16:35:01',0),(55,23.2,3,'2015-03-18 16:35:02',0),(56,24.6,4,'2015-03-18 16:35:02',0),(57,9.16,5,'2015-03-18 16:35:03',0),(58,100.8,6,'2015-03-18 16:35:03',0),(59,0,7,'2015-03-18 16:35:04',0),(60,0,8,'2015-03-18 16:35:04',0),(61,0,9,'2015-03-18 16:35:04',0),(62,1,10,'2015-03-18 16:35:05',0),(63,4.294,2,'2015-03-18 16:36:53',0),(64,23.437,1,'2015-03-18 16:36:54',0),(65,9.12,5,'2015-03-18 16:36:55',0),(66,100.3,6,'2015-03-18 16:36:55',0),(67,0,7,'2015-03-18 16:36:57',0),(68,0,8,'2015-03-18 16:36:57',0),(69,0,9,'2015-03-18 16:36:57',0),(70,1,10,'2015-03-18 16:36:57',0),(71,4.294,2,'2015-03-18 16:36:58',0),(72,23.437,1,'2015-03-18 16:36:59',0),(73,9.14,5,'2015-03-18 16:37:01',0),(74,100.6,6,'2015-03-18 16:37:01',0),(75,0,7,'2015-03-18 16:37:02',0),(76,0,8,'2015-03-18 16:37:02',0),(77,0,9,'2015-03-18 16:37:02',0),(78,1,10,'2015-03-18 16:37:02',0),(79,4.292,2,'2015-03-18 16:38:34',0),(80,23.437,1,'2015-03-18 16:38:35',0),(81,9.13,5,'2015-03-18 16:38:36',0),(82,100.4,6,'2015-03-18 16:38:36',0),(83,0,7,'2015-03-18 16:38:38',0),(84,0,8,'2015-03-18 16:38:38',0),(85,0,9,'2015-03-18 16:38:38',0),(86,1,10,'2015-03-18 16:38:38',0),(87,4.292,2,'2015-03-18 16:44:53',0),(88,23.437,1,'2015-03-18 16:44:54',0),(89,23.3,3,'2015-03-18 16:44:54',0),(90,24.7,4,'2015-03-18 16:44:54',0),(91,9.13,5,'2015-03-18 16:44:55',0),(92,100.4,6,'2015-03-18 16:44:55',0),(93,0,7,'2015-03-18 16:44:57',0),(94,0,8,'2015-03-18 16:44:57',0),(95,0,9,'2015-03-18 16:44:57',0),(96,1,10,'2015-03-18 16:44:57',0),(97,4.295,2,'2015-03-18 16:48:40',0),(98,23.312,1,'2015-03-18 16:48:41',0),(99,23.2,3,'2015-03-18 16:48:41',0),(100,24.9,4,'2015-03-18 16:48:41',0),(101,9.14,5,'2015-03-18 16:48:42',0),(102,100.5,6,'2015-03-18 16:48:42',0),(103,0,7,'2015-03-18 16:48:43',0),(104,0,8,'2015-03-18 16:48:43',0),(105,0,9,'2015-03-18 16:48:43',0),(106,1,10,'2015-03-18 16:48:43',0);
/*!40000 ALTER TABLE `t_Data` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t_Sensor`
--

DROP TABLE IF EXISTS `t_Sensor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `t_Sensor` (
  `sensor_id` int(11) NOT NULL AUTO_INCREMENT,
  `cloudia_sensor_id` varchar(45) NOT NULL,
  `sensor_measure_unit` varchar(45) NOT NULL,
  `sensor_t_unit` int(11) NOT NULL,
  `sensor_driver_pos` int(11) NOT NULL DEFAULT '5',
  PRIMARY KEY (`sensor_id`),
  UNIQUE KEY `unit_id_UNIQUE` (`sensor_id`),
  KEY `fk_t_unit_sensors_idx` (`sensor_t_unit`),
  CONSTRAINT `fk_t_unit_sensors` FOREIGN KEY (`sensor_t_unit`) REFERENCES `t_SensorsUnit` (`unit_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_Sensor`
--

LOCK TABLES `t_Sensor` WRITE;
/*!40000 ALTER TABLE `t_Sensor` DISABLE KEYS */;
INSERT INTO `t_Sensor` VALUES (1,'001','°C',2,5),(2,'001','pH',1,5),(3,'001','°C',3,5),(4,'002','% ',3,7),(5,'001','% ',4,5),(6,'002','mg/L',4,7),(7,'001','u/S',5,5),(8,'002','TDS',5,7),(9,'003','Salinity',5,9),(10,'004','SG',5,11);
/*!40000 ALTER TABLE `t_Sensor` ENABLE KEYS */;
UNLOCK TABLES;

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
INSERT INTO `t_SensorsUnit` VALUES (1,'su0001','Water PH',2,'1:99'),(2,'su0002','Water Temperature',4,'28-000006700658'),(3,'su0003','Case Temp/Hum',5,'1:14'),(4,'su0004','Water DO',1,'1:97'),(5,'su0005','Water Conductivity',3,'1:100');
/*!40000 ALTER TABLE `t_SensorsUnit` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t_Types`
--

DROP TABLE IF EXISTS `t_Types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `t_Types` (
  `types_id` int(11) NOT NULL AUTO_INCREMENT,
  `types_name` varchar(45) NOT NULL,
  `types_driver` varchar(450) NOT NULL,
  PRIMARY KEY (`types_id`),
  UNIQUE KEY `types_id_UNIQUE` (`types_id`),
  UNIQUE KEY `types_name_UNIQUE` (`types_name`),
  UNIQUE KEY `types_driver_UNIQUE` (`types_driver`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_Types`
--

LOCK TABLES `t_Types` WRITE;
/*!40000 ALTER TABLE `t_Types` DISABLE KEYS */;
INSERT INTO `t_Types` VALUES (1,'Atlas I2C DO','/var/lib/cloud9/Aquarius/exec/driverAtlasI2CDO'),(2,'Atlas I2C PH','/var/lib/cloud9/Aquarius/exec/driverAtlasI2CPH'),(3,'Atlas I2C K','/var/lib/cloud9/Aquarius/exec/driverAtlasI2CK'),(4,'One Wire ','/var/lib/cloud9/Aquarius/exec/driverOneWireExec '),(5,'DHT22','/var/lib/cloud9/Aquarius/exec/driverDHT22Exec');
/*!40000 ALTER TABLE `t_Types` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2015-03-20  9:15:41
