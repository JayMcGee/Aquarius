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

-- Dump completed on 2015-03-18  9:32:29
