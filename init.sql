CREATE DATABASE database COLLATE utf8mb4_unicode_ci;
use database;

SET NAMES utf8mb4;

CREATE TABLE users (
  user_id varchar(20) DEFAULT NULL,
  username varchar(20) NULL,
  password varchar(20) NULL,
  focus_category_id varchar(20) DEFAULT NULL
) CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE categories (
  category_id varchar(20) DEFAULT NULL,
  name varchar(20) DEFAULT 'New category',
  user_id varchar(20) DEFAULT NULL
) CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE tasks (
  task_id varchar(20) DEFAULT NULL,
  text text NOT NULL,
  category_id varchar(20) NULL,
  completed tinyint(1) NOT NULL DEFAULT '0'
) CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE categories
ADD UNIQUE KEY category_id_unique (category_id) USING BTREE;

ALTER TABLE tasks
ADD UNIQUE KEY task_id_unique (task_id) USING BTREE;

ALTER TABLE users
ADD UNIQUE KEY username_unique (username),
ADD UNIQUE KEY user_id_unique (user_id) USING BTREE;