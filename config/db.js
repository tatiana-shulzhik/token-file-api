const config = require('./config');
const mysql = require('mysql2')
require('dotenv').config();

const connection = mysql.createConnection({
    host: config.MYSQL_HOST,
    port: config.MYSQL_PORT,
    user: config.MYSQL_USER,
    password: config.MYSQL_PASSWORD,
    database: config.MYSQL_DATABASE
})

connection.connect((error) => {
    if (error) {
        return console.log('Ошибка подключения к БД!', error);
    } else {
        return console.log('Подлючение успешно!');
    }
})

module.exports = connection