import { check } from 'express-validator';

export const loginValidator = [
    check('email').isEmail().withMessage('Debe ser un correo válido'),
    check('contrasena').notEmpty().withMessage('La contraseña es requerida'),
];

export default loginValidator;