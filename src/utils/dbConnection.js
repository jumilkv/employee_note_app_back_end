const { Pool, Client } = require("pg");
const dotenv = require('dotenv')
dotenv.config()

const pool = new Pool({
    user: process.env.DEFAULT_USERNAME,
    host: process.env.HOST,
    database: process.env.DB,
    password: process.env.PASS,
    port: process.env.DB_PORT
});

pool
    .connect()
    .then(() => {
        console.log("Database Connection Established");
        console.log("Database : " + process.env.DB);
    })
    .catch(error => {
        console.error(error);
    });

module.exports = pool