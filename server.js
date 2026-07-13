// server.js
const app = require('./app');
const connectDB = require('./config/db');
const config = require('./config');

connectDB().then(() => {
  app.listen(config.port, () => {
    console.log(`[Server] NIT Kurukshetra Recruitment Portal backend running on port ${config.port}`);
  });
});
