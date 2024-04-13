const { body } = require('express-validator');

const validationMovieCreate = [
    body('Title')
        .notEmpty().withMessage('El titulo no debe estar bacio').bail()
        .isLength({ min: 5 }).withMessage('El nombre debe tener al menos 5 caracteres'),
    body('Rating')
        .notEmpty().withMessage('Debes completar con un numero de rating').bail()
        .isInt({ min: 1, max: 10 }).withMessage('El rating debe estar entre 1 y 10'),
    body('Awards')
        .notEmpty().withMessage('Debes completar los awards').bail()
        .isInt({ min: 0 }).withMessage('Los premios deben ser de o hasta los premios que ganaste'),
        body('release_date')
        .notEmpty().withMessage('Debes completar la fecha de lanzamiento').bail()
        .isISO8601().withMessage('La fecha de lanzamiento debe tener el formato ISO8601 (YYYY-MM-DD)'),   
    body('length')
        .notEmpty().withMessage('La duración no puede estar vacía').bail()
        .isInt({ min: 1, max: 100000 }).withMessage('La duración debe ser un número entre 1 y 100000')
];

module.exports = { validationMovieCreate };