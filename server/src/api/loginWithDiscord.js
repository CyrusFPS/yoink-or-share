const express = require('express');
const passport = require('passport');

const router = express.Router();

const successLoginURL = "http://localhost:3000/login/success";
const errorLoginURL = "http://localhost:3000/login/error";

router.get('/login/discord', passport.authenticate('discord', {
  scope: ["identify"]
}));

router.get('/auth/discord/callback', passport.authenticate('discord', {
  failureMessage: 'Cannot login to Discord, please try again later!', 
  failureRedirect: errorLoginURL,
  successRedirect: successLoginURL
}), (req, res) => {
  res.send("Thank you for signing in!");
});

module.exports = router;