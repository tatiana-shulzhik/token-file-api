const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sequelize } = require("../config/sequelize");
const User = require('../models/user')(sequelize);
const Session = require('../models/session')(sequelize);
const config = require('../config/app-config');

exports.registerUser = async (login, password) => {
  try {
    const existingUser = await User.findOne({ where: { id: login  } });
    if (existingUser) {
      return { message: 'Ошибка регистрации', error: 'login уже зарегистрирован' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ id: login, password: hashedPassword });

    return { message: 'Пользователь успешно зарегистрирован', userId: user.id };
  } catch (error) {
    console.error('Ошибка при регистрации пользователя:', error);
    return { message: 'Ошибка регистрации', error: error.message };
  }
};

exports.loginUser = async (login, password) => {
  const user = await User.findOne({ where: { id: login } });
  if (!user) return null;

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) return null;

  const session = await Session.create({
    userId: user.id,
    valid: true,
  });

  const accessToken = jwt.sign(
    { userId: user.id, sessionId: session.id },
    config.ACCESS_SECRET,
    { expiresIn: '10m' }
  );

  const refreshToken = jwt.sign(
    { userId: user.id, sessionId: session.id },
    config.REFRESH_SECRET,
    { expiresIn: '7d' }
  );

  session.refreshToken = refreshToken;
  await session.save();

  return { user, accessToken, refreshToken };
};

exports.refreshAccessToken = async (refreshToken) => {
  try {
    const decoded = jwt.verify(refreshToken, config.REFRESH_SECRET);

    const tokenRecord = await Session.findOne({
      where: { refreshToken, userId: decoded.userId, valid: true }
    });

    if (!tokenRecord) return null;

    const user = await User.findByPk(decoded.userId);

    if (!user) return null;

    const newAccessToken = jwt.sign(
      { userId: user.id, sessionId: tokenRecord.id },
      config.ACCESS_SECRET,
      { expiresIn: '10m' }
    );

    return { accessToken: newAccessToken };
  } catch (error) {
    return null;
  }
};

exports.getUserProfile = async (userId) => {
  return User.findByPk(userId, { attributes: ['id'] });
};

exports.logout = async (refreshToken) => {
  try {
    const decoded = jwt.verify(refreshToken, config.REFRESH_SECRET);

    const tokenRecord = await Session.findOne({
      where: { refreshToken, userId: decoded.userId, valid: true }
    });

    if (!tokenRecord) {
      throw new Error('Неверный или уже отозванный токен');
    }

    tokenRecord.valid = false;
    await tokenRecord.save();

    return { success: true, message: 'Вы успешно вышли из системы' };
  } catch (error) {
    return { message: 'Неверный токен', error: error.message };
  }
};

