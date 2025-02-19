const Joi = require('joi');

const fileListDto = Joi.object({
    page: Joi.number().integer().min(1).default(1).messages({
        'number.base': 'Номер страницы должен быть числом',
        'number.integer': 'Номер страницы должен быть целым числом',
        'number.min': 'Номер страницы должен быть больше или равен 1',
    }),
    list_size: Joi.number().integer().min(1).default(10).messages({
        'number.base': 'Размер списка должен быть числом',
        'number.integer': 'Размер списка должен быть целым числом',
        'number.min': 'Размер списка должен быть больше или равен 1',
    }),
});

module.exports = fileListDto;
