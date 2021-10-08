const passport = require('passport');
const DiscordStrategy = require('passport-discord');
const User = require('../models/user');

// Serialize user function
passport.serializeUser((user, done) => {
  done(null, user.id)
});

// Deserialize user function
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    console.log(`Error deserializing: ${error}`);
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
    callbackURL: 'http://localhost:4000/api/v1/auth/discord/callback',
    clientID: process.env.DISCORD_CLIENT_ID,
    clientSecret: process.env.DISCORD_CLIENT_SECRET,
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
      console.log(`Error signing in: ${error}`);
      done(error, null);
    }
  })
);