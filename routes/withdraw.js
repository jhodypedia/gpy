const express = require('express');
const router = express.Router();
const db = require('../db');
const { isUser } = require('../middleware/auth');

router.get('/withdraw', isUser, async (req, res) => {
  const metode = await db.query('SELECT * FROM withdraw_method ORDER BY id DESC');
  res.render('withdraw-new', {
    title: 'Withdraw',
    user: req.session.user,
    metode: metode[0]
  });
});

router.post('/withdraw', isUser, async (req, res) => {
  const { method_id, jumlah, tujuan } = req.body;
  const user = req.session.user;

  if (user.saldo < jumlah) return res.send('Saldo tidak cukup');

  await db.query(
    'INSERT INTO withdraws (user_id, method_id, jumlah, tujuan) VALUES (?, ?, ?, ?)',
    [user.id, method_id, jumlah, tujuan]
  );

  await db.query('UPDATE users SET saldo = saldo - ? WHERE id = ?', [jumlah, user.id]);
  res.redirect('/dashboard');
});

module.exports = router;
