const express = require('express');
const router = express.Router();
const db = require('../db');
const { isUser } = require('../middleware/auth');

router.get('/deposit/new', isUser, async (req, res) => {
  const metode = await db.query('SELECT * FROM deposit_method ORDER BY id DESC');
  res.render('deposit-new', {
    title: 'Deposit Baru',
    user: req.session.user,
    metode: metode[0]
  });
});

router.post('/deposit/new', isUser, async (req, res) => {
  const { method_id, jumlah } = req.body;
  const kode_unik = Math.floor(100 + Math.random() * 900);
  const jumlah_total = parseInt(jumlah) + kode_unik;
  await db.query(
    'INSERT INTO deposits (user_id, method_id, jumlah, kode_unik, jumlah_total) VALUES (?, ?, ?, ?, ?)',
    [req.session.user.id, method_id, jumlah, kode_unik, jumlah_total]
  );
  res.redirect('/dashboard');
});

module.exports = router;
