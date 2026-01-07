const mongoose = require('mongoose');

async function main() {
   await mongoose.connect(process.env.STRING);
}

module.exports = main;