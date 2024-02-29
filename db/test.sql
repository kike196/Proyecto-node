CREATE DATABASE ProyectoNode;

USE ProyectoNode;

CREATE TABLE IF NOT EXISTS `users` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `phone` varchar(20) COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `message` varchar(255) COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

show tables;

describe users;
