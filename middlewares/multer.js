const multer = require('multer');
const path = require('path');
const minioClient = require('../config/storage.config');

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
});

module.exports = upload;
