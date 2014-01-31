-- phpMyAdmin SQL Dump
-- version 3.1.3.1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Jul 27, 2012 at 01:29 PM
-- Server version: 5.1.47
-- PHP Version: 5.2.13

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `apollo`
--

-- --------------------------------------------------------

--
-- Table structure for table `browserver`
--

CREATE TABLE IF NOT EXISTS `browserver` (
  `browserver_no` int(12) NOT NULL AUTO_INCREMENT,
  `browserver_name` varchar(100) NOT NULL,
  `browserver_version` varchar(100) NOT NULL,
  `browserver_mobile` varchar(10) NOT NULL,
  `browserver_website` varchar(100) NOT NULL,
  `browserver_ts` varchar(12) NOT NULL,
  PRIMARY KEY (`browserver_no`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

--
-- Dumping data for table `browserver`
--

