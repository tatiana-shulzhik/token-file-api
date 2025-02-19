const { Sequelize } = require('sequelize');
const config = require('./app-config');

const sequelize = new Sequelize({
  username: config.MYSQL_USER,
  password: config.MYSQL_PASSWORD,
  database: config.MYSQL_DATABASE,
  host: config.MYSQL_HOST,
  dialect: "mysql",
});

module.exports = { sequelize };
