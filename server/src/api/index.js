const express = require('express');
const loginWithDiscordApi = require('./loginWithDiscord');
const userApi = require('./user');
const roomsApi = require('./rooms');

const router = express.Router();

// Setup api to use discord oauth
router.use(loginWithDiscordApi);
// Setup api to use user auth api (for login with cookies)
router.use(userApi);
// Setup api to use for rooms
router.use(roomsApi);

module.exports = router;