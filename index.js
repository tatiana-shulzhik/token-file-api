const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config/app-config');
const authRoutes = require('./routes/auth-routes');
const fileRoutes = require('./routes/file-routes');
const { sequelize } = require('./config/sequelize');
const cors = require('cors');

const PORT = config.PORT || 3000;

const app = express();
sequelize.authenticate()
  .then(() => console.log('Connection has been established successfully.'))
  .catch((err) => console.error('Unable to connect to the database:', err));

app.use(cors());

app.use(bodyParser.json());

app.use('/', authRoutes);
app.use('/file', fileRoutes);

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту: ${PORT}`);
});
