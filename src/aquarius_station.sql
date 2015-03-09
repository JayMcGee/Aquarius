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
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_Data`
--

LOCK TABLES `t_Data` WRITE;
/*!40000 ALTER TABLE `t_Data` DISABLE KEYS */;
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
INSERT INTO `t_SensorsUnit` VALUES (1,'su0001','Water PH',2,'1:99'),(2,'su0002','Water Temperature',4,'28-000006052315'),(3,'su0003','Case Temp/Hum',5,'1:14'),(4,'su0004','Water DO',1,'1:100'),(5,'su0005','Water Conductivity',3,'1:103');
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
INSERT INTO `t_Types` VALUES (1,'Atlas I2C DO','/var/lib/cloud9/Aquarius/src/build_src/exec/driverAtlasI2CDO'),(2,'Atlas I2C PH','/var/lib/cloud9/Aquarius/src/build_src/exec/driverAtlasI2CPH'),(3,'Atlas I2C K','/var/lib/cloud9/Aquarius/src/build_src/exec/driverAtlasI2CK'),(4,'One Wire ','/var/lib/cloud9/Aquarius/src/build_src/exec/driverOneWireExec '),(5,'DHT22','/var/lib/cloud9/Aquarius/src/build_src/exec/driverDHT22Exec');
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

-- Dump completed on 2015-03-09  9:02:30
