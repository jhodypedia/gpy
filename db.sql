-- Tabel users
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  phone VARCHAR(20),
  password VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') DEFAULT 'user',
  saldo BIGINT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel config (hanya 1 baris)
CREATE TABLE config (
  id INT PRIMARY KEY DEFAULT 1,
  nama_web VARCHAR(255),
  url_web VARCHAR(255),
  email_pengirim VARCHAR(255),
  password_email VARCHAR(255)
);

-- Tabel metode_deposit (admin upload metode bayar)
CREATE TABLE metode_deposit (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama VARCHAR(100),
  gambar TEXT,
  aktif BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel deposits
CREATE TABLE deposits (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  metode_id INT,
  jumlah BIGINT,
  kode_unik INT,
  total_transfer BIGINT,
  status ENUM('pending','success','failed') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (metode_id) REFERENCES metode_deposit(id)
);

-- Tabel withdraws
CREATE TABLE withdraws (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  jumlah BIGINT,
  status ENUM('pending','success','failed') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Tabel log_saldo_admin (untuk track saldo admin)
CREATE TABLE log_saldo_admin (
  id INT AUTO_INCREMENT PRIMARY KEY,
  admin_id INT,
  user_id INT,
  jumlah BIGINT,
  keterangan TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (admin_id) REFERENCES users(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Insert config awal (kosongkan password_email kalau pakai MailDev)
INSERT INTO config (id, nama_web, url_web, email_pengirim, password_email)
VALUES (1, 'GoPay Gateway', 'https://domainanda.com', 'youremail@icloud.com', 'aplikasi_password');

-- Insert admin awal
INSERT INTO users (username, email, phone, password, role, saldo)
VALUES ('admin', 'admin@email.com', '', '$2a$10$1K2FNgWox5bYAbFhEAvl1O5RZr2RYUFMZUpiA2k3o8S1Qn6NHqxKa', 'admin', 10000000);
-- Password: 123456 (bcrypt)
