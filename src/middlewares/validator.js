const { body, validationResult } = require('express-validator');

// Capturador de errores de validación
const validateResults = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ status: 'Error de validación', errors: errors.array() });
    }
    next();
};

// Reglas de validación para Usuario
const validateUser = [
    body('nombre')
        .trim()
        .notEmpty().withMessage('El nombre es obligatorio.')
        .isLength({ min: 2 }).withMessage('El nombre debe tener al menos 2 caracteres.'),
    body('email')
        .trim()
        .isEmail().withMessage('Debe proporcionar un email válido.'),
    body('password')
        .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres.'),
    validateResults
];

// Reglas de validación para Inventario
const validateInventory = [
    body('codigo_sku')
        .trim()
        .notEmpty().withMessage('El código SKU es obligatorio.'),
    body('nombre_producto')
        .trim()
        .notEmpty().withMessage('El nombre del producto es obligatorio.'),
    body('cantidad')
        .isInt({ min: 0 }).withMessage('La cantidad debe ser un número entero mayor o igual a 0.'),
    body('precio')
        .isFloat({ min: 0 }).withMessage('El precio debe ser un número mayor o igual a 0.'),
    validateResults
];

module.exports = {
    validateUser,
    validateInventory
};