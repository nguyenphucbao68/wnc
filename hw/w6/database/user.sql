CREATE TABLE `wnc`.`user` ( `user_id` SMALLINT(5) NOT NULL AUTO_INCREMENT, `username` VARCHAR(45) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL , `password` VARCHAR(45) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL , `refresh_token` TEXT CHARACTER SET utf8 COLLATE utf8_general_ci NULL , PRIMARY KEY (`user_id`)) ENGINE = InnoDB;