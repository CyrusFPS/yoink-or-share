const passport = require('passport');
const DiscordStrategy = require('passport-discord');
const User = require('../models/user');

// Serialize user function
passport.serializeUser((user, done) => {
  // Basically packaging the user id and shipping it off for later
  done(null, user.id)
});

// Deserialize user function
passport.deserializeUser(async (id, done) => {
  // Someones giving us our package back and now we need to find the corresponding user with the given id
  try {
    const user = await User.findById(id);
    // Found the user, return it and keep moving
    done(null, user);
  } catch (error) {
    // ERROR THE WORLD IS MELTING AGAIN
    done(error, null);
  }
});

// Creates one user
const createOneUser = async (profile) => {
  const newUser = await new User({
    discordID: profile.id,
    username: profile.username,
    discriminator: profile.discriminator,
    email: profile.email
  }).save();

  return newUser;
};

// Check if user already exists in database
const checkForUser = async (profile) => {
  const currentUser = await User.findOne({ discordID: profile.id });
  if (currentUser) return currentUser;
  return false;
};

passport.use(
  new DiscordStrategy({
    callbackURL: 'http://localhost:4000/api/v1/auth/discord/callback', // Where discord should go after a user authenticates
    clientID: process.env.DISCORD_CLIENT_ID, // Discord client id
    clientSecret: process.env.DISCORD_CLIENT_SECRET, // Discord client secret
  }, async (accessToken, refreshToken, profile, done) => {
    // Passport callback function
    try {
      // Check if user exists in database
      const userInDB = await checkForUser(profile);
      // If user is in database -
      if (userInDB) return done(null, userInDB);
      // If user isn't in database, create new user profile
      const newUser = await createOneUser(profile);
      done(null, newUser);
    } catch (error) {
      // NOT AGAINNNNN
      done(error, null);
    }
  })
);