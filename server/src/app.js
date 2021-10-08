const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
require('dotenv').config();

require('./auth/passport');
require('./auth/passportDiscordSSO');

require('./models/user');

const middlewares = require('./middlewares');
const api = require('./api');
const passport = require('passport');

const app = express();
const port = process.env.PORT;

// Middleware
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

app.use(cookieSession({
  maxAge: 24 * 60 * 60 * 1000, // One day in MS
  keys: [process.env.COOKIE_KEY]
}));

app.use(passport.initialize());
app.use(passport.session());

// Connect to mongodb
mongoose.connect(process.env.DB_URI, () => {
  console.log('Connected to mongodb');
});

// API Routes
app.get('/', (req, res) => {
  res.json({
    message: "Hello world"
  });
});

app.use('/api/v1', api);

module.exports = app;