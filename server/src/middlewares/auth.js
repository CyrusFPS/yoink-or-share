const isUserAuthenticated = (req, res, next) => {
  if (req.user) return next(); // If the user is there then keep going
  return res.status(401).json({ auth: false }); // User's not there just tell them they're not authenticated
}

module.exports = isUserAuthenticated;