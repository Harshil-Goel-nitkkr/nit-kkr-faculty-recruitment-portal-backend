const { createClient } = require('redis');
const config = require('./index');

// (REDIS) In-memory store keyed by a captchaId issued to the client.
const redisClient = createClient({url:config.captcha.redis_url});

redisClient.on('error', err => console.log('Redis Client Error', err));

const createRedisClient = async() => {
    try{
        await redisClient.connect();
        console.log('Redis Client Created')
    }catch(err){
        console.error('Redis connection failed:', err.message);
        process.exit(1);
    }
    
}

module.exports = {redisClient,createRedisClient};
