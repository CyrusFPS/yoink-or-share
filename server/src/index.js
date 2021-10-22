const app = require('./app');
const port = process.env.EXPRESSPORT || 4000

// Start listening
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});