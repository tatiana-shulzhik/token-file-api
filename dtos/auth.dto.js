const Joi = require('joi');

const authDto = Joi.object({
    login: Joi.alternatives()
        .try(
            Joi.string().email().messages({
                'string.email': 'Некорректный формат email',
            }),
            Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).messages({
                'string.pattern.base': 'Некорректный формат номера телефона',
            })
        )
        .required()
        .messages({
            'any.required': 'Логин (email или телефон) обязателен',
        }),

    password: Joi.string().min(6).required().messages({
        'string.min': 'Пароль должен содержать минимум 6 символов',
        'any.required': 'Пароль обязателен',
    }),
});

module.exports = authDto;
