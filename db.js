const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'gopay1',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Fungsi utama untuk query biasa
async function query(sql, params) {
  const [rows] = await pool.execute(sql, params);
  return rows;
}

// Fungsi untuk mengambil satu baris data (object)
async function getOne(sql, params) {
  const [rows] = await pool.execute(sql, params);
  return rows[0] || null;
}

module.exports = {
  query,
  getOne
};
