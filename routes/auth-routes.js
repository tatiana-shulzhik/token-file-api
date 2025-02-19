const express = require('express');
const { register, login, profile, refreshToken, logout } = require('../controllers/auth-controller');
const { verifyToken } = require('../middlewares/auth-middleware');

const router = express.Router();

router.post('/signup', register);
router.post('/signin', login);
router.post('/signin/new_token', refreshToken);
router.get('/info', verifyToken, profile);
router.post('/logout', verifyToken, logout);

module.exports = router;
