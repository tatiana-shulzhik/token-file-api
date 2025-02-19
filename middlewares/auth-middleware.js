const jwt = require('jsonwebtoken');
const config = require("../config/app-config");
const { sequelize } = require('../config/sequelize');
const Session = require('../models/session')(sequelize);
const responseHelper = require('../utils/response-helper');

exports.verifyToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return responseHelper.sendResponse(res, 401, 'Требуется токен')
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, config.ACCESS_SECRET);
        const tokenRecord = await Session.findOne({
            where: { id: decoded.sessionId, valid: true }
        });

        if (!tokenRecord) {
            return responseHelper.sendResponse(res, 401, 'Сессия завершена (вы вышли)');
        };

        req.user = decoded;
        next();
    } catch (err) {
        return responseHelper.sendResponse(res, 401, 'Неверный токен');
    }
};
