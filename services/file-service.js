const path = require('path');
const fs = require('fs');
const minioClient = require('../config/storage.config');
const { sequelize } = require('../config/sequelize');
const File = require('../models/file')(sequelize);
const UserFile = require('../models/user-file')(sequelize);
const config = require('../config/app-config');

exports.uploadFile = async (file, userId) => {
    if (!file) throw new Error('No file uploaded.');

    const { originalname: fileName, mimetype: mimeType, size, buffer, path: filePath } = file;
    const timestamp = Date.now();
    const extension = path.extname(fileName);
    const uniqueFileName = `${timestamp}${extension}`;
    const bucketName = config.MINIO_BUCKET_NAME;
    const objectName = `files/${uniqueFileName}`;

    try {
        if (!(await minioClient.bucketExists(bucketName))) {
            await minioClient.makeBucket(bucketName, process.env.MINIO_REGION || 'us-east-1');
        }

        const fileContent = buffer || fs.readFileSync(filePath);
        await minioClient.putObject(bucketName, objectName, fileContent);

        const newFile = await File.create({ name: uniqueFileName, extension, mimeType, size });
        await UserFile.upsert({ userId, fileId: newFile.id });

        if (filePath) fs.unlinkSync(filePath);

        return newFile;
    } catch (error) {
        console.error('Error uploading file to MinIO:', error);
        throw new Error('Error uploading file to MinIO: ' + error.message);
    }
};

exports.getFilesWithPagination = async (page, listSize) => {
    try {
        const offset = (page - 1) * listSize;
        const { rows: files, count: totalFiles } = await File.findAndCountAll({ limit: listSize, offset });

        return {
            files,
            pagination: {
                totalFiles,
                totalPages: Math.ceil(totalFiles / listSize),
                currentPage: page,
                listSize,
            }
        };
    } catch (error) {
        throw new Error(`Error fetching file list: ${error.message}`);
    }
}

exports.getFileById = async (id) => {
    try {
        const file = await File.findByPk(id);
        return file;
    } catch (error) {
        throw new Error('Error fetching file by id: ' + error.message);
    }
}

exports.deleteFile = async (id) => {
    const file = await File.findByPk(id);

    if (!file) throw new Error('File not found');

    const objectName = `/files/${file.name}`;
    const bucketName = config.MINIO_BUCKET_NAME;

    await minioClient.removeObject(bucketName, objectName, (err) => {
        if (err) {
            throw new Error('Error deleting file from MinIO');
        }
    });
    await UserFile.destroy({ where: { fileId: id } });
    await File.destroy({ where: { id } });
};

exports.downloadFile = async (id) => {
    const file = await File.findByPk(id);

    if (!file) throw new Error('File not found');

    const bucketName = config.MINIO_BUCKET_NAME;
    const objectName = `files/${file.name}`;

    return minioClient.getObject(bucketName, objectName);
};

exports.updateFile = async (file, fileId, userId) => {
    if (!file) throw new Error('No file uploaded.');

    const { originalname: fileName, mimetype: mimeType, size, buffer, path: filePath } = file;
    const timestamp = Date.now();
    const extension = path.extname(fileName);
    const uniqueFileName = `${timestamp}${extension}`;
    const bucketName = config.MINIO_BUCKET_NAME;
    const objectName = `files/${uniqueFileName}`;

    try {
        const existingFile = await File.findByPk(fileId);

        if (!existingFile) throw new Error('File not found.');

        if (!(await minioClient.bucketExists(bucketName))) {
            await minioClient.makeBucket(bucketName, process.env.MINIO_REGION || 'us-east-1');
        }

        const fileContent = buffer || fs.readFileSync(filePath);

        await minioClient.removeObject(bucketName, `files/${existingFile.name}`);

        await minioClient.putObject(bucketName, objectName, fileContent);

        existingFile.name = uniqueFileName;
        existingFile.extension = extension;
        existingFile.mimeType = mimeType;
        existingFile.size = size;
        await existingFile.save();

        await UserFile.upsert({ userId, fileId: existingFile.id });

        if (filePath) fs.unlinkSync(filePath);

        return existingFile;
    } catch (error) {
        console.error('Error updating file in MinIO:', error);
        throw new Error('Error updating file: ' + error.message);
    }
};
