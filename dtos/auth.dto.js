const Joi = require('joi');

const authDto = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'Некорректный формат email',
        'any.required': 'Email обязателен',
    }),
    password: Joi.string().min(6).required().messages({
        'string.min': 'Пароль должен содержать минимум 6 символов',
        'any.required': 'Пароль обязателен',
    }),
});

module.exports = authDto;
