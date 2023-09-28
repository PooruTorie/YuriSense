-- -----------------------------------------------------
-- Schema yurisense
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `yurisense` DEFAULT CHARACTER SET utf8 ;
USE `yurisense` ;

-- -----------------------------------------------------
-- Table `yurisense`.`Sensor`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `yurisense`.`Sensor` (
  `uuid` VARCHAR(24) NOT NULL,
  `name` VARCHAR(20) NULL,
  `lastConnect` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  `connected` VARCHAR(20) NULL,
  `version` VARCHAR(20) NULL,
  `type` VARCHAR(45) NULL,
  `manufacture` VARCHAR(45) NULL,
  `rack` INT NULL,
  PRIMARY KEY (`uuid`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `yurisense`.`SensorData`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `yurisense`.`SensorData` (
  `sensor` VARCHAR(24) NOT NULL,
  `timestamp` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  `value` BLOB NULL,
  `label` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`sensor`, `timestamp`),
  INDEX `fk_SensorData_KnownSensor_idx` (`sensor` ASC),
  CONSTRAINT `fk_SensorData_KnownSensor`
    FOREIGN KEY (`sensor`)
    REFERENCES `yurisense`.`Sensor` (`uuid`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `yurisense`.`User`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `yurisense`.`User` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(100) NOT NULL,
  `password` CHAR(97) NOT NULL,
  `admin` TINYINT NOT NULL DEFAULT 0,
  `firstName` VARCHAR(50) NOT NULL,
  `lastName` VARCHAR(50) NOT NULL,
  `phone` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC))
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `yurisense`.`Rack`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `yurisense`.`Rack` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `maximalTemperature` FLOAT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `yurisense`.`Log`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `yurisense`.`Log` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `timestamp` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
    `rack` INT NOT NULL,
    `user` INT NULL,
    `oldTemperature` FLOAT NULL,
    PRIMARY KEY (`id`),
    INDEX `fk_Log_Rack1_idx` (`rack` ASC),
    INDEX `fk_Log_User1_idx` (`user` ASC),
    CONSTRAINT `fk_Log_Rack1`
     FOREIGN KEY (`rack`)
         REFERENCES `yurisense`.`Rack` (`id`)
         ON DELETE CASCADE
         ON UPDATE CASCADE,
    CONSTRAINT `fk_Log_User1`
     FOREIGN KEY (`user`)
         REFERENCES `yurisense`.`User` (`id`)
         ON DELETE SET NULL
         ON UPDATE CASCADE)
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `yurisense`.`LoginRetries`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `yurisense`.`LoginRetries` (
  `ip` CHAR(16) NOT NULL,
  `retries` INT NOT NULL,
  `waitTimeMinutes` INT NOT NULL,
  `lastRetry` TIMESTAMP,
  PRIMARY KEY (`ip`))
ENGINE = InnoDB;


-- -------------------------------------------------------
-- Create Yuri user
-- -------------------------------------------------------
CREATE USER 'yuri'@'%' IDENTIFIED BY 'yurisense';
GRANT ALL ON `yurisense`.* TO 'yuri'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;