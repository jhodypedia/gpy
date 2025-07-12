const express = require('express');
const router = express.Router();
const db = require('../db');
const { isUser } = require('../middleware/auth');

// Dashboard user
router.get('/dashboard', isUser, async (req, res) => {
  const user = req.session.user;

  // Ambil total deposit dan withdraw user
  const totalDeposit = await db.getOne('SELECT SUM(jumlah_total) as total FROM deposits WHERE user_id = ?', [user.id]);
  const totalWithdraw = await db.getOne('SELECT SUM(jumlah) as total FROM withdraws WHERE user_id = ?', [user.id]);

  res.render('dashboard-user', {
    title: 'Dashboard',
    user,
    totalDeposit: totalDeposit.total || 0,
    totalWithdraw: totalWithdraw.total || 0
  });
});

module.exports = router;
