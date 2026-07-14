// server.js
const app = require('./app');
const connectDB = require('./config/db');
const config = require('./config');
const {createRedisClient} = require('./config/redis')

connectDB().then(() => {
  createRedisClient();
  app.listen(config.port, () => {
    console.log(`[Server] NIT Kurukshetra Recruitment Portal backend running on port ${config.port}`);
  });
});
