const express = require('express');
const router = express.Router();
const pool = require('../db');
const { auth } = require('../middleware/auth');

router.get('/deposit/new', auth, async (req, res) => {
  const [methods] = await pool.query(`SELECT * FROM deposit_methods`);
  res.render('deposit-new', { title: 'Deposit Baru', user: req.session.user, methods });
});

router.post('/deposit/new', auth, async (req, res) => {
  const jumlah = parseInt(req.body.jumlah);
  const metode_id = req.body.metode_id;
  const kode_unik = Math.floor(100 + Math.random() * 900);
  const total_transfer = jumlah + kode_unik;

  const [result] = await pool.query(
    `INSERT INTO deposits (user_id, jumlah, kode_unik, total_transfer, metode_id) VALUES (?, ?, ?, ?, ?)`,
    [req.session.user.id, jumlah, kode_unik, total_transfer, metode_id]
  );

  res.redirect(`/deposit/invoice/${result.insertId}`);
});

router.get('/deposit/invoice/:id', auth, async (req, res) => {
  const [rows] = await pool.query(`SELECT d.*, m.nama, m.gambar FROM deposits d LEFT JOIN deposit_methods m ON d.metode_id = m.id WHERE d.id=? AND user_id=?`, [req.params.id, req.session.user.id]);
  if (!rows.length) return res.send('Invoice tidak ditemukan.');
  res.render('deposit-invoice', { title: 'Invoice', user: req.session.user, invoice: rows[0] });
});

module.exports = router;
