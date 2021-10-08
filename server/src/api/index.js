const express = require('express');
const loginWithDiscordApi = require('./loginWithDiscord');

const router = express.Router();

router.use(loginWithDiscordApi);

module.exports = router;