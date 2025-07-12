const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');

router.get('/login', (req, res) => {
  res.render('auth-login', { title: 'Login' });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const [rows] = await pool.query(`SELECT * FROM users WHERE email=?`, [email]);
  if (!rows.length) return res.render('auth-login', { error: 'User tidak ditemukan', title: 'Login' });

  const user = rows[0];
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.render('auth-login', { error: 'Password salah', title: 'Login' });

  req.session.user = { id: user.id, email: user.email, username: user.username, role: user.role };
  req.session.token = jwt.sign({ id: user.id, role: user.role }, 'SECRETKEY', { expiresIn: '1d' });

  res.redirect(user.role === 'admin' ? '/admin/dashboard' : '/dashboard');
});

router.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/login'));
});

module.exports = router;
