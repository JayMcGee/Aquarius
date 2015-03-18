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
  PRIMARY KEY (`config_id`),
  UNIQUE KEY `config_key_name_UNIQUE` (`config_key_name`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_Config`
--

LOCK TABLES `t_Config` WRITE;
/*!40000 ALTER TABLE `t_Config` DISABLE KEYS */;
INSERT INTO `t_Config` VALUES (1,'READ_INTERVAL','30'),(2,'SEND_ADDRESS','www.cloudiaproject.org/c/data.json'),(3,'LAST_KNOWN_DATE','Wed Mar 18 09:24:40 UTC 2015'),(4,'STATION_ID','sta001');
/*!40000 ALTER TABLE `t_Config` ENABLE KEYS */;
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
