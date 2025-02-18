const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const config = require('./config/config')
dotenv.config();

const app = express();
const PORT = config.PORT || 3000;
app.use(bodyParser.json());
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту: ${PORT}`);
});
