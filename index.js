const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config/app-config');
const authRoutes = require('./routes/auth-routes');
const { sequelize } = require('./config/sequelize');

const PORT = config.PORT || 3000;

const app = express();
sequelize.authenticate()
  .then(() => console.log('Connection has been established successfully.'))
  .catch((err) => console.error('Unable to connect to the database:', err));

app.use(bodyParser.json());

app.use('/', authRoutes);

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту: ${PORT}`);
});
