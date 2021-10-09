const passport = require('passport');
const passportJwt = require('passport-jwt');
const ExtractJwt = passportJwt.ExtractJwt;
const StrategyJwt = passportJwt.Strategy;
const User = require('../models/user');

// Setup passport with JWT
passport.use(
  new StrategyJwt(
    {
      // Where to get the JWT from a request
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // Our secret to encrypt/decrypt the JWT (I think?)
      secretOrKey: process.env.JWT_SECRET,
    }, (jwtPayload, done) => {
      // Use the JWT payload's id to find the corresponding user in our db
      return User.findOne({ discordID: jwtPayload.id })
        .then((user) => {
          // If it worked then return the user and keep moving
          return done(null, user);
        })
        .catch((err) => {
          // ERROR THE WORLD IS MELTING
          return done(err);
        });
    }
  )
);