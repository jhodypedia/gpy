const express = require('express');
const session = require('express-session');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const fileUpload = require('express-fileupload');

const app = express();
require('./listener/listener');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(fileUpload());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'secretkey', resave: false, saveUninitialized: false }));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layouts/main');

app.use('/', require('./routes/auth'));
app.use('/', require('./routes/user'));
app.use('/', require('./routes/deposit'));
app.use('/', require('./routes/withdraw'));
app.use('/', require('./routes/admin'));

app.listen(3000, () => console.log('✅ Server running: http://localhost:3000'));
