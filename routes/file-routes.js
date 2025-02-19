const express = require('express');
const { uploadFile, getFileList, getFileById, deleteFile, downloadFile, updateFile } = require('../controllers/file-controller');
const { verifyToken } = require('../middlewares/auth-middleware');
const upload = require('../middlewares/multer');

const router = express.Router();

router.post('/upload', verifyToken, upload.single('file'), uploadFile);
router.get('/list', getFileList);
router.get('/:id', getFileById);
router.delete('/delete/:id', verifyToken, deleteFile);
router.get('/download/:id', downloadFile);
router.put('/update/:id', verifyToken, upload.single('file'), updateFile);

module.exports = router;
