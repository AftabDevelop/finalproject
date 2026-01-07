const { createClient } = require('redis');

const client = createClient({
    username: 'default',
    password: process.env.PASS,
    socket: {
        host: 'redis-10318.c12.us-east-1-4.ec2.redns.redis-cloud.com',
        port: 10318
    }
});


module.exports = client;