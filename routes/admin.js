const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcryptjs');
const { adminOnly } = require('../middleware/auth');

// Dashboard
router.get('/admin/dashboard', adminOnly, async (req, res) => {
  const [[a]] = await pool.query(`SELECT COUNT(*) AS total FROM users WHERE role='user'`);
  const [[b]] = await pool.query(`SELECT SUM(saldo) AS total FROM users`);
  const [[c]] = await pool.query(`SELECT COUNT(*) AS total FROM deposits WHERE status='success'`);

  res.render('admin/dashboard', {
    title: 'Dashboard Admin',
    user: req.session.user,
    stat: {
      totalUser: a.total,
      totalSaldo: b.total || 0,
      totalDeposit: c.total
    }
  });
});

// CRUD Users
router.get('/admin/users', adminOnly, async (req, res) => {
  const [users] = await pool.query(`SELECT * FROM users`);
  res.render('admin/users', { title: 'Kelola User', user: req.session.user, users });
});

router.post('/admin/users/add', adminOnly, async (req, res) => {
  const { username, email, password, saldo } = req.body;
  const hash = await bcrypt.hash(password, 10);
  await pool.query(`INSERT INTO users (username, email, password, saldo) VALUES (?, ?, ?, ?)`, [username, email, hash, saldo || 0]);
  res.redirect('/admin/users');
});

router.post('/admin/users/edit/:id', adminOnly, async (req, res) => {
  const { username, email, saldo } = req.body;
  await pool.query(`UPDATE users SET username=?, email=?, saldo=? WHERE id=?`, [username, email, saldo, req.params.id]);
  res.redirect('/admin/users');
});

router.get('/admin/users/delete/:id', adminOnly, async (req, res) => {
  await pool.query(`DELETE FROM users WHERE id=?`, [req.params.id]);
  res.redirect('/admin/users');
});

// Kirim saldo ke user
router.get('/admin/saldo-kirim', adminOnly, (req, res) => {
  res.render('admin/kirim-saldo', { title: 'Kirim Saldo', user: req.session.user });
});

router.post('/admin/saldo-kirim', adminOnly, async (req, res) => {
  const { tujuan, jumlah } = req.body;
  const jumlahInt = parseInt(jumlah);

  const [[admin]] = await pool.query(`SELECT * FROM users WHERE id=?`, [req.session.user.id]);
  if (admin.saldo < jumlahInt) return res.send('Saldo admin tidak cukup.');

  const [[target]] = await pool.query(`SELECT * FROM users WHERE username=? OR email=?`, [tujuan, tujuan]);
  if (!target) return res.send('User tujuan tidak ditemukan.');

  await pool.query(`UPDATE users SET saldo = saldo - ? WHERE id=?`, [jumlahInt, admin.id]);
  await pool.query(`UPDATE users SET saldo = saldo + ? WHERE id=?`, [jumlahInt, target.id]);

  res.redirect('/admin/users');
});

// Upload metode deposit
router.get('/admin/metode', adminOnly, async (req, res) => {
  const [metodes] = await pool.query(`SELECT * FROM deposit_methods`);
  res.render('admin/deposit-method', { title: 'Metode Deposit', user: req.session.user, metodes });
});

router.post('/admin/metode', adminOnly, async (req, res) => {
  const { nama } = req.body;
  const gambar = req.files?.gambar;
  const fileName = Date.now() + '-' + gambar.name;
  gambar.mv(`public/uploads/${fileName}`);
  await pool.query(`INSERT INTO deposit_methods (nama, gambar) VALUES (?, ?)`, [nama, `/uploads/${fileName}`]);
  res.redirect('/admin/metode');
});

module.exports = router;
