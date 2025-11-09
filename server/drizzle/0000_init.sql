CREATE TABLE IF NOT EXISTS `users` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `email` varchar(255) NOT NULL UNIQUE,
  `password_hash` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `profiles` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `user_id` int NOT NULL UNIQUE,
  `full_name` varchar(255) NOT NULL,
  `phone` varchar(100),
  `role` enum('admin','driver','client') NOT NULL DEFAULT 'client',
  `plan` varchar(100),
  `avatar_url` varchar(500),
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `profiles_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `missions` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `client_id` int NOT NULL,
  `driver_id` int,
  `mission_number` varchar(100) NOT NULL UNIQUE,
  `departure_address` varchar(255) NOT NULL,
  `departure_city` varchar(255) NOT NULL,
  `departure_postal_code` varchar(50) NOT NULL,
  `arrival_address` varchar(255) NOT NULL,
  `arrival_city` varchar(255) NOT NULL,
  `arrival_postal_code` varchar(50) NOT NULL,
  `scheduled_date` datetime NOT NULL,
  `scheduled_time` varchar(50),
  `actual_start_time` datetime,
  `actual_end_time` datetime,
  `distance_km` float,
  `price` float,
  `status` enum('pending','assigned','in_progress','completed','cancelled') NOT NULL DEFAULT 'pending',
  `priority` enum('normal','urgent','express') NOT NULL DEFAULT 'normal',
  `notes` text,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `quotes` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `full_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(100) NOT NULL,
  `company_name` varchar(255),
  `vehicle_type` varchar(100) NOT NULL,
  `departure_location` varchar(255) NOT NULL,
  `arrival_location` varchar(255) NOT NULL,
  `preferred_date` datetime,
  `message` text,
  `status` enum('new','quoted','converted','declined') NOT NULL DEFAULT 'new',
  `estimated_price` float,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `quote_attachments` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `quote_id` int NOT NULL,
  `file_name` varchar(255) NOT NULL,
  `mime_type` varchar(150),
  `file_size` int NOT NULL,
  `content` longblob NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `quote_attachments_quote_id_fk` FOREIGN KEY (`quote_id`) REFERENCES `quotes`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `driver_applications` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `full_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(100) NOT NULL,
  `years_experience` int NOT NULL,
  `license_types` json NOT NULL,
  `regions` json NOT NULL,
  `availability` varchar(255) NOT NULL,
  `has_own_vehicle` tinyint(1) NOT NULL DEFAULT 0,
  `has_company` tinyint(1) NOT NULL DEFAULT 0,
  `message` text,
  `status` enum('new','in_review','approved','rejected') NOT NULL DEFAULT 'new',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `driver_application_attachments` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `application_id` int NOT NULL,
  `file_name` varchar(255) NOT NULL,
  `mime_type` varchar(150),
  `file_size` int NOT NULL,
  `content` longblob NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `driver_application_attachments_application_id_fk` FOREIGN KEY (`application_id`) REFERENCES `driver_applications`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `password_reset_tokens` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `user_id` int NOT NULL,
  `token_hash` varchar(128) NOT NULL UNIQUE,
  `expires_at` datetime NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `password_reset_tokens_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
