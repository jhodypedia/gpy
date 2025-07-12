const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../db');

router.get('/login', (req, res) => {
  res.render('auth-login', { title: 'Login' });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await db.getOne('SELECT * FROM users WHERE email = ?', [email]);
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.render('auth-login', { title: 'Login', error: 'Email atau password salah' });
  }
  req.session.user = user;
  res.redirect(user.role === 'admin' ? '/admin/dashboard' : '/dashboard');
});

router.get('/register', (req, res) => {
  res.render('auth-register', { title: 'Register' });
});

router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  const hash = bcrypt.hashSync(password, 10);
  await db.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, hash]);
  res.redirect('/login');
});

router.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/login'));
});

module.exports = router;
