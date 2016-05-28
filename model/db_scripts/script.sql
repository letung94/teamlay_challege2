-- MySQL Script generated by MySQL Workbench
-- 05/24/16 17:10:14
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema cv_maker
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `cv_maker` ;

-- -----------------------------------------------------
-- Schema cv_maker
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `cv_maker` DEFAULT CHARACTER SET utf8 ;
USE `cv_maker` ;

-- -----------------------------------------------------
-- Table `cv_maker`.`user`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `cv_maker`.`user` ;

CREATE TABLE IF NOT EXISTS `cv_maker`.`user` (
  `Id` INT(11) NOT NULL AUTO_INCREMENT,
  `Username` VARCHAR(20) NULL DEFAULT NULL,
  `Email` VARCHAR(200) NULL DEFAULT NULL,
  `PasswordHash` VARCHAR(5000) NULL DEFAULT NULL,
  `CreatedDate` DATETIME NULL DEFAULT NULL,
  `IsConfirmed` BIT(1) NULL DEFAULT NULL,
  `IsBlocked` BIT(1) NULL DEFAULT NULL,
  `ResetPasswordToken` VARCHAR(5000) NULL DEFAULT NULL,
  `ResetPasswordExpire` DATETIME NULL DEFAULT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE INDEX `Email_UNIQUE` (`Email` ASC),
  UNIQUE INDEX `Username_UNIQUE` (`Username` ASC))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `cv_maker`.`curriculum_vitae`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `cv_maker`.`curriculum_vitae` ;

CREATE TABLE IF NOT EXISTS `cv_maker`.`curriculum_vitae` (
  `Id` INT(11) NOT NULL AUTO_INCREMENT,
  `Name` VARCHAR(500) NULL DEFAULT NULL,
  `CreatedDate` DATETIME NULL DEFAULT NULL,
  `IsDeleted` BIT(1) NULL DEFAULT NULL,
  `UrlSlug` VARCHAR(600) NULL DEFAULT NULL,
  `UserId` INT(11) NULL DEFAULT NULL,
  PRIMARY KEY (`Id`),
  INDEX `UserId_idx` (`UserId` ASC),
  CONSTRAINT `FK_CV_UserId`
    FOREIGN KEY (`UserId`)
    REFERENCES `cv_maker`.`user` (`Id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `cv_maker`.`certification`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `cv_maker`.`certification` ;

CREATE TABLE IF NOT EXISTS `cv_maker`.`certification` (
  `Id` INT(11) NOT NULL AUTO_INCREMENT,
  `Title` VARCHAR(100) NULL DEFAULT NULL,
  `CertificateAuthority` VARCHAR(100) NULL DEFAULT NULL,
  `Date` DATETIME NULL DEFAULT NULL,
  `Details` TEXT NULL DEFAULT NULL,
  `CV_Id` INT(11) NOT NULL,
  PRIMARY KEY (`Id`),
  INDEX `FK_Certification_CV_Id_idx` (`CV_Id` ASC),
  CONSTRAINT `FK_Certification_CV_Id`
    FOREIGN KEY (`CV_Id`)
    REFERENCES `cv_maker`.`curriculum_vitae` (`Id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `cv_maker`.`contact_info`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `cv_maker`.`contact_info` ;

CREATE TABLE IF NOT EXISTS `cv_maker`.`contact_info` (
  `Id` INT(11) NOT NULL AUTO_INCREMENT,
  `FirstName` VARCHAR(50) NULL DEFAULT NULL,
  `LastName` VARCHAR(50) NULL DEFAULT NULL,
  `Avatar` VARCHAR(255) NULL DEFAULT NULL,
  `Email` VARCHAR(50) NULL DEFAULT NULL,
  `Phone` VARCHAR(13) NULL DEFAULT NULL,
  `Website` VARCHAR(100) NULL DEFAULT NULL,
  `Address` VARCHAR(255) NULL DEFAULT NULL,
  `CV_Id` INT(11) NOT NULL,
  PRIMARY KEY (`Id`),
  INDEX `FK_ContactInfo_CV_Id_idx` (`CV_Id` ASC),
  CONSTRAINT `FK_ContactInfo_CV_Id`
    FOREIGN KEY (`CV_Id`)
    REFERENCES `cv_maker`.`curriculum_vitae` (`Id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `cv_maker`.`education`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `cv_maker`.`education` ;

CREATE TABLE IF NOT EXISTS `cv_maker`.`education` (
  `Id` INT(11) NOT NULL AUTO_INCREMENT,
  `Institude` VARCHAR(100) NULL DEFAULT NULL,
  `Degree` VARCHAR(100) NULL DEFAULT NULL,
  `FromDate` DATETIME NULL DEFAULT NULL,
  `ToDate` DATETIME NULL DEFAULT NULL,
  `Details` TEXT NULL DEFAULT NULL,
  `CV_Id` INT(11) NOT NULL,
  PRIMARY KEY (`Id`),
  INDEX `FK_Education_CV_Id_idx` (`CV_Id` ASC),
  CONSTRAINT `FK_Education_CV_Id`
    FOREIGN KEY (`CV_Id`)
    REFERENCES `cv_maker`.`curriculum_vitae` (`Id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `cv_maker`.`experience`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `cv_maker`.`experience` ;

CREATE TABLE IF NOT EXISTS `cv_maker`.`experience` (
  `Id` INT(11) NOT NULL AUTO_INCREMENT,
  `Company` VARCHAR(100) NULL DEFAULT NULL,
  `Designation` VARCHAR(50) NULL DEFAULT NULL,
  `FromDate` DATETIME NULL DEFAULT NULL,
  `ToDate` DATETIME NULL DEFAULT NULL,
  `Details` TEXT NULL DEFAULT NULL,
  `CV_id` INT(11) NOT NULL,
  PRIMARY KEY (`Id`),
  INDEX `FK_Experience_CV_Id_idx` (`CV_id` ASC),
  CONSTRAINT `FK_Experience_CV_Id`
    FOREIGN KEY (`CV_id`)
    REFERENCES `cv_maker`.`curriculum_vitae` (`Id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `cv_maker`.`role`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `cv_maker`.`role` ;

CREATE TABLE IF NOT EXISTS `cv_maker`.`role` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `role_name` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `cv_maker`.`skill`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `cv_maker`.`skill` ;

CREATE TABLE IF NOT EXISTS `cv_maker`.`skill` (
  `Id` INT(11) NOT NULL AUTO_INCREMENT,
  `Name` VARCHAR(50) NULL DEFAULT NULL,
  `Level` INT(11) NULL DEFAULT NULL,
  `Maturity` VARCHAR(50) NULL DEFAULT NULL,
  `LastTime` INT(11) NULL DEFAULT NULL,
  `CV_Id` INT(11) NOT NULL,
  PRIMARY KEY (`Id`),
  INDEX `FK_Skill_CV_Id_idx` (`CV_Id` ASC),
  CONSTRAINT `FK_Skill_CV_Id`
    FOREIGN KEY (`CV_Id`)
    REFERENCES `cv_maker`.`curriculum_vitae` (`Id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `cv_maker`.`summary`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `cv_maker`.`summary` ;

CREATE TABLE IF NOT EXISTS `cv_maker`.`summary` (
  `Id` INT(11) NOT NULL,
  `Headline` VARCHAR(50) NULL DEFAULT NULL,
  `ProfessionalSummary` TEXT NULL DEFAULT NULL,
  `CV_Id` INT(11) NOT NULL,
  PRIMARY KEY (`Id`),
  INDEX `FK_Summary_CV_Id_idx` (`CV_Id` ASC),
  CONSTRAINT `FK_Summary_CV_Id`
    FOREIGN KEY (`CV_Id`)
    REFERENCES `cv_maker`.`curriculum_vitae` (`Id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `cv_maker`.`user_role`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `cv_maker`.`user_role` ;

CREATE TABLE IF NOT EXISTS `cv_maker`.`user_role` (
  `UserId` INT(11) NOT NULL,
  `RoleId` INT(11) NOT NULL,
  PRIMARY KEY (`UserId`, `RoleId`),
  INDEX `FK_UserRole_RoleId_idx` (`RoleId` ASC),
  CONSTRAINT `FK_UserRole_RoleId`
    FOREIGN KEY (`RoleId`)
    REFERENCES `cv_maker`.`role` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `FK_UserRole_UserId`
    FOREIGN KEY (`UserId`)
    REFERENCES `cv_maker`.`user` (`Id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
