function auth(req, res, next) {
  if (!req.session.user) return res.redirect('/login');
  next();
}

function adminOnly(req, res, next) {
  if (!req.session.user || req.session.user.role !== 'admin') return res.redirect('/login');
  next();
}

module.exports = { auth, adminOnly };
