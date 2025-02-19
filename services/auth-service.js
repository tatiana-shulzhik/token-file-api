const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sequelize } = require("../config/sequelize");
const User = require('../models/user')(sequelize);;
const config = require('../config/app-config');

exports.registerUser = async (email, password) => {
    try {
        console.log('Регистрация пользователя:', email);

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return { message: 'Ошибка регистрации', error: 'Email уже зарегистрирован' };
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('Хешированный пароль:', hashedPassword);

        const user = await User.create({ email, password: hashedPassword });

        return { message: 'Пользователь успешно зарегистрирован', userId: user.id };
    } catch (error) {
        console.error('Ошибка при регистрации пользователя:', error);
        return { message: 'Ошибка регистрации', error: error.message };
    }
};

exports.loginUser = async (email, password) => {
    const user = await User.findOne({ where: { email } });
    if (!user) return null;

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return null;

    const accessToken = jwt.sign(
        { userId: user.id },
        config.ACCESS_SECRET,
        { expiresIn: '10m' }
    );

    const refreshToken = jwt.sign(
        { userId: user.id },
        config.REFRESH_SECRET,
        { expiresIn: '7d' }
    );

    return { user, accessToken, refreshToken };
};

exports.refreshAccessToken = async (refreshToken) => {
    try {
        const decoded = jwt.verify(refreshToken, config.REFRESH_SECRET);
        const user = await User.findByPk(decoded.userId);
        if (!user) return null;

        const newAccessToken = jwt.sign(
            { userId: user.id },
            config.ACCESS_SECRET,
            { expiresIn: '10m' }
        );

        return { accessToken: newAccessToken };
    } catch (error) {
        return null;
    }
};

exports.getUserProfile = async (userId) => {
    return User.findByPk(userId, { attributes: ['id', 'email'] });
};
