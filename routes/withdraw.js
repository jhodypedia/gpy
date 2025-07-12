const express = require('express');
const router = express.Router();
const pool = require('../db');
const { auth } = require('../middleware/auth');

router.get('/withdraw', auth, (req, res) => {
  res.render('withdraw-new', { title: 'Withdraw', user: req.session.user });
});

router.post('/withdraw', auth, async (req, res) => {
  const tujuan = req.body.tujuan.trim();
  const jumlah = parseInt(req.body.jumlah);

  const [[user]] = await pool.query(`SELECT saldo FROM users WHERE id=?`, [req.session.user.id]);
  if (!user || user.saldo < jumlah) {
    return res.render('withdraw-new', { title: 'Withdraw', user: req.session.user, error: 'Saldo tidak cukup' });
  }

  await pool.query(`UPDATE users SET saldo = saldo - ? WHERE id=?`, [jumlah, req.session.user.id]);
  await pool.query(`INSERT INTO withdrawals (user_id, jumlah, tujuan) VALUES (?, ?, ?)`, [req.session.user.id, jumlah, tujuan]);

  res.redirect('/dashboard');
});

module.exports = router;
