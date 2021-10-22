const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roomSchema = new Schema({
  users: [String],
  whitelist: [String],
  owner: String
});

const Room = mongoose.model('room', roomSchema);

module.exports = Room;