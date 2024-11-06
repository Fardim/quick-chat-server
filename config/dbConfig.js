const mongoose = require('mongoose');

// connect to mongodb
mongoose.connect(process.env.CONN_STRING);

const db = mongoose.connection;

db.on('connected', () => {
    console.log('DB connection successful');
});

db.on('error', () => {
    console.log('DB connection failed');
});

module.exports = db;