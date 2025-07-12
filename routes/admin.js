const express = require('express');
const router = express.Router();
const db = require('../utils/db');
const { isAdmin } = require('../middleware/auth');

// Dashboard
router.get('/admin/dashboard', isAdmin, async (req, res) => {
  const totalUser = await db.getOne('SELECT COUNT(*) AS total FROM users');
  const totalSaldo = await db.getOne('SELECT SUM(saldo) AS total FROM users');
  res.render('admin/dashboard', {
    title: 'Admin Dashboard',
    user: req.session.user,
    totalUser: totalUser.total,
    totalSaldo: totalSaldo.total
  });
});

// Upload metode deposit (QR)
router.get('/admin/metode', isAdmin, async (req, res) => {
  const metode = await db.query('SELECT * FROM deposit_method');
  res.render('admin/metode', { title: 'Metode Deposit', user: req.session.user, metode: metode[0] });
});

router.post('/admin/metode', isAdmin, async (req, res) => {
  const { nama } = req.body;
  const qr = req.files.qr_image;
  const filename = Date.now() + '-' + qr.name;
  qr.mv('public/uploads/' + filename);
  await db.query('INSERT INTO deposit_method (nama, qr_image) VALUES (?, ?)', [nama, filename]);
  res.redirect('/admin/metode');
});

// Upload metode withdraw (Bank/eWallet)
router.get('/admin/withdraw/metode', isAdmin, async (req, res) => {
  const metode = await db.query('SELECT * FROM withdraw_method');
  res.render('admin/withdraw-metode', { title: 'Metode Withdraw', user: req.session.user, metode: metode[0] });
});

router.post('/admin/withdraw/metode', isAdmin, async (req, res) => {
  const { nama, kode } = req.body;
  await db.query('INSERT INTO withdraw_method (nama, kode) VALUES (?, ?)', [nama, kode]);
  res.redirect('/admin/withdraw/metode');
});

router.post('/admin/withdraw/metode/:id/hapus', isAdmin, async (req, res) => {
  await db.query('DELETE FROM withdraw_method WHERE id = ?', [req.params.id]);
  res.redirect('/admin/withdraw/metode');
});

// CRUD User (opsional)
router.get('/admin/users', isAdmin, async (req, res) => {
  const users = await db.query('SELECT * FROM users ORDER BY id DESC');
  res.render('admin/users', { title: 'Kelola User', user: req.session.user, users: users[0] });
});

router.post('/admin/users/:id/delete', isAdmin, async (req, res) => {
  await db.query('DELETE FROM users WHERE id = ?', [req.params.id]);
  res.redirect('/admin/users');
});

router.post('/admin/users/:id/saldo', isAdmin, async (req, res) => {
  const { id } = req.params;
  const { jumlah } = req.body;
  await db.query('UPDATE users SET saldo = saldo + ? WHERE id = ?', [jumlah, id]);
  await db.query('UPDATE users SET saldo = saldo - ? WHERE id = ?', [jumlah, req.session.user.id]); // admin saldo -
  await db.query('INSERT INTO kirim_saldo (admin_id, user_id, jumlah) VALUES (?, ?, ?)', [req.session.user.id, id, jumlah]);
  res.redirect('/admin/users');
});

module.exports = router;
