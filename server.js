const dotenv = require('dotenv');
dotenv.config({path: './config.env'});

const dbConfig = require('./config/dbConfig');

const app = require("./app");

const PORT = process.env.PORT_NUMBER || 3000;

console.log('PORt', PORT)

app.listen(PORT, () => {
    console.log('listening on port: ', PORT);
});