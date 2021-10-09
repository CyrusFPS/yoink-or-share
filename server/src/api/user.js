const express = require('express');
const isUserAuthenticated = require('../middlewares/auth');

const router = express.Router();

// Setup cookie auth check endpoint, using is user authed middleware
router.get('/auth/user', isUserAuthenticated, (req, res) => {
  // If authed then respond with the user and auth status
  res.json({ user: req.user, auth: true });
});

module.exports = router;