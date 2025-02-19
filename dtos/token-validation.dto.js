const Joi = require('joi');

const refreshTokenValidationDto = Joi.object({
    refreshToken: Joi.string().required().messages({
        'string.string': 'Некорректный формат Refresh token',
        'any.required': 'Refresh token обязателен',
    }),
});

module.exports = { refreshTokenValidationDto };
