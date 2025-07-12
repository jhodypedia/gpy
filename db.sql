-- Buat database
CREATE DATABASE IF NOT EXISTS gopay;
USE gopay;

-- Tabel user
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'user') DEFAULT 'user',
  saldo BIGINT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel deposit
CREATE TABLE deposits (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  jumlah BIGINT,
  kode_unik INT,
  total_transfer BIGINT,
  metode_id INT,
  status ENUM('pending', 'success', 'failed') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (metode_id) REFERENCES deposit_methods(id)
);

-- Tabel withdraw
CREATE TABLE withdrawals (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  jumlah BIGINT,
  tujuan VARCHAR(255),
  status ENUM('pending', 'done') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Tabel metode deposit
CREATE TABLE deposit_methods (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama VARCHAR(100) NOT NULL,
  gambar VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel konfigurasi
CREATE TABLE config (
  id INT PRIMARY KEY,
  site_name VARCHAR(100),
  site_url VARCHAR(255),
  email_admin VARCHAR(100),
  gmail_password VARCHAR(255)
);

-- Data awal: admin + 1 metode + 1 config
INSERT INTO users (username, email, password, role, saldo) VALUES
('admin', 'admin@mail.com', '$2a$10$0LtoErGBHUlVxI4ER9HxGOSRU7Je2ur3BPOPLcr41iL3P2KJ3cq5q', 'admin', 1000000);

INSERT INTO deposit_methods (nama, gambar) VALUES
('QRIS GoPay', '/uploads/qris-gopay.png');

INSERT INTO config (id, site_name, site_url, email_admin, gmail_password) VALUES
(1, 'GoPay QRIS Gateway', 'http://localhost:3000', 'admin@mail.com', 'passwordgmail123');
