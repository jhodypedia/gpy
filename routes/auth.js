const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcryptjs');

// GET Login
router.get('/login', (req, res) => {
  res.render('auth-login', { title: 'Login' });
});

// POST Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const [[user]] = await pool.query(`SELECT * FROM users WHERE email=?`, [email]);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.send('Email atau password salah');
  }

  req.session.user = user;
  res.redirect(user.role === 'admin' ? '/admin/dashboard' : '/dashboard');
});

// GET Register
router.get('/register', (req, res) => {
  res.render('auth-register', { title: 'Register' });
});

// POST Register
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  const [[exists]] = await pool.query(`SELECT * FROM users WHERE email=?`, [email]);
  if (exists) return res.send('Email sudah terdaftar.');

  const hash = await bcrypt.hash(password, 10);
  await pool.query(`INSERT INTO users (username, email, password, role, saldo) VALUES (?, ?, ?, 'user', 0)`, [username, email, hash]);

  res.redirect('/login');
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

module.exports = router;
