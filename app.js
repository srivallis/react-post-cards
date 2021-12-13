const express = require('express');
const cors = require('cors');
const session = require('express-session')
const cookieParser = require('cookie-parser');
const passport = require('passport');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const config = require('./src/config');
const port = process.env.PORT || 4000;

require('./models/Card');
require('./models/Section');
require('./models/User');

require('./_auth/services/passport');


const card = require('./routes/card');
const section = require('./routes/section');
const user = require('./routes/user');
const admin = require('./routes/admin');


mongoose.connect(config.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
.catch(e => {
  console.error('Connection error', e.message)
});

app.use(cookieParser());

app.use(session({
  secret: 'carpediem',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}))

app.use(express.urlencoded({ extended: true }));
app.use(cors())
app.use(express.json());

app.use(passport.initialize())
app.use(passport.session())

require('./_auth')(app);

app.use('/card', card);
app.use('/section', section);
app.use('/user', user);
app.use('/verify', admin);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'build')));
  app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });
}

app.listen(port, function () {
  console.log('Server is listening to port ', port);
});
