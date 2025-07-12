-- Users
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') DEFAULT 'user',
  saldo BIGINT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Pengaturan Sistem
CREATE TABLE config (
  id INT PRIMARY KEY,
  nama_web VARCHAR(100),
  url_web VARCHAR(100),
  email VARCHAR(100),
  password_gmail VARCHAR(255)
);

INSERT INTO config (id, nama_web, url_web, email, password_gmail)
VALUES (1, 'GoPay QR Gateway', 'https://gopayqr.local', 'admin@email.com', 'gmailpassword123');

-- Deposit Method (Admin upload QR)
CREATE TABLE deposit_method (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama VARCHAR(100) NOT NULL,
  qr_image VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Deposit Table
CREATE TABLE deposits (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  method_id INT,
  jumlah INT,
  kode_unik INT,
  jumlah_total INT,
  status ENUM('pending','paid','failed') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (method_id) REFERENCES deposit_method(id)
);

-- Withdraw Method (admin bisa tambah bank/e-wallet)
CREATE TABLE withdraw_method (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama VARCHAR(100) NOT NULL,
  kode VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Withdraw Table
CREATE TABLE withdraws (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  method_id INT,
  jumlah INT,
  tujuan VARCHAR(100),
  status ENUM('pending','success','failed') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (method_id) REFERENCES withdraw_method(id)
);

-- Admin kirim saldo ke user (Log)
CREATE TABLE kirim_saldo (
  id INT AUTO_INCREMENT PRIMARY KEY,
  admin_id INT,
  user_id INT,
  jumlah INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (admin_id) REFERENCES users(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
