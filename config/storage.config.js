const Minio = require("minio");
const config = require('./app-config');

const minioClient = new Minio.Client({
  endPoint: config.MINIO_ENDPOINT,
  port: parseInt(config.MINIO_PORT, 10),
  useSSL: false,
  accessKey: config.MINIO_ROOT_USER,
  secretKey: config.MINIO_ROOT_PASSWORD,
});

module.exports = minioClient;
