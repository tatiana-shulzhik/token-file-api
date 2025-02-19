const express = require('express');
const { register, login, profile, refreshToken } = require('../controllers/auth-controller');
const { verifyToken } = require('../middlewares/auth-middleware');

const router = express.Router();

router.post('/signup', register);
router.post('/signin', login);
router.post('/signin/new_token', refreshToken);
router.get('/info', verifyToken, profile);

module.exports = router;
