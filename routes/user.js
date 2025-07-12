const express = require('express');
const router = express.Router();
const pool = require('../db');
const { auth } = require('../middleware/auth');

router.get('/dashboard', auth, async (req, res) => {
  const [[user]] = await pool.query(`SELECT saldo FROM users WHERE id=?`, [req.session.user.id]);
  res.render('user-dashboard', { title: 'Dashboard', user: req.session.user, saldo: user.saldo });
});

module.exports = router;
