const authService = require('../services/auth-service');
const responseHelper = require('../utils/response-helper');
const authDto = require('../dtos/auth.dto');
const { refreshTokenValidationDto } = require('../dtos/token-validation.dto');

exports.register = async (req, res) => {
    const { email, password } = req.body;
    const { error } = authDto.validate({ email, password });

    if (error) {
        return responseHelper.sendResponse(res, 400, 'Ошибка валидации', { error: error.details[0].message });
    }

    const result = await authService.registerUser(email, password);

    if (result.error) {
        return responseHelper.sendResponse(res, 400, 'Ошибка регистрации', { error: result.error });
    }

    return responseHelper.sendResponse(res, 201, 'Пользователь успешно зарегистрирован', { userId: result.userId });
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    const { error } = authDto.validate({ email, password });

    if (error) {
        return responseHelper.sendResponse(res, 400, 'Ошибка валидации', { error: error.details[0].message });
    }

    const result = await authService.loginUser(email, password);

    if (!result) {
        return responseHelper.sendResponse(res, 401, 'Неверный email или пароль');
    }

    return responseHelper.sendResponse(res, 200, 'Успешный вход', {
        accessToken: result.accessToken,
        refreshToken: result.refreshToken
    });
};

exports.refreshToken = async (req, res) => {
    const { refreshToken } = req.body;
    const { error } = refreshTokenValidationDto.validate({ refreshToken });

    if (error) {
        return responseHelper.sendResponse(res, 400, 'Ошибка валидации', { error: error.details[0].message });
    }

    const result = await authService.refreshAccessToken(refreshToken);

    if (!result) {
        return responseHelper.sendResponse(res, 401, 'Недействительный или просроченный refresh token');
    }

    return responseHelper.sendResponse(res, 200, 'Токен обновлен', { accessToken: result.accessToken });
};

exports.profile = async (req, res) => {
    const user = await authService.getUserProfile(req.user.userId);

    if (!user) {
        return responseHelper.sendResponse(res, 404, 'Пользователь не найден');
    }

    res.json({ userId: user.id });
};

exports.logout = async (req, res) => {
    const { refreshToken } = req.body;
    const { error } = refreshTokenValidationDto.validate({ refreshToken });

    if (error) {
        return responseHelper.sendResponse(res, 400, 'Ошибка валидации', { error: error.details[0].message });
    }

    const result = await authService.logout(refreshToken);

    if (!result.success) {
        return responseHelper.sendResponse(res, 401, result.message);
    }

    return responseHelper.sendResponse(res, 200, result.message);
};

