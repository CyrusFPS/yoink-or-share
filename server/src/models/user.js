const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  discordID: Number,
  username: String,
  discriminator: Number,
  email: String
});

const User = mongoose.model('user', userSchema);

module.exports = User;