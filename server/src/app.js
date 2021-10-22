const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
require('dotenv').config();

require('./auth/passportDiscordSSO');

require('./models/user'); // Same with this I think
require('./models/room');

require('./api/game');

const api = require('./api'); // Get our api
const passport = require('passport'); // We're gonna need passport

const app = express(); // Setup our express app and our port from the .env file

// Middleware
app.use(morgan('dev')); // Morgan for console messages on reqs
app.use(cors({ origin: "http://localhost:3000", credentials: true })); // Tell cors to be kind 
app.use(express.json()); // Use express json bodyparser

app.use(cookieSession({ // Setup cookiesession on our app
  maxAge: 24 * 60 * 60 * 1000, // One day in MS
  keys: [process.env.COOKIE_KEY] // Cookie key found in .env file
}));

app.use(passport.initialize()); // Use passport and it's session functionality
app.use(passport.session());

// Connect to mongodb
mongoose.connect(process.env.DB_URI, () => {
  console.log('Connected to mongodb');
});

// API Routes
app.use('/api/v1', api);

module.exports = app;