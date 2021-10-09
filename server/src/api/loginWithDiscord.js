const express = require('express');
const passport = require('passport');

const router = express.Router();

// Setup our fail and success URLs for discord oauth
const successLoginURL = "http://localhost:3000/login/success";
const errorLoginURL = "http://localhost:3000/login/error";

// Tell route to use passport with discord, all we want is their identity
router.get('/login/discord', passport.authenticate('discord', {
  scope: ["identify"]
}));

// Setup our discord callback function (runs after user authenticates with discord)
router.get('/auth/discord/callback', passport.authenticate('discord', {
  failureMessage: 'Cannot login to Discord, please try again later!', 
  failureRedirect: errorLoginURL, // If it fails redirect them to our failure url on frontend
  successRedirect: successLoginURL // If success then redirect them to our success url, which will just redirect them again
}), (req, res) => {
  res.send("Thank you for signing in!"); // Don't really need this ?
});

module.exports = router;