import { PrismaClient } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';
import { body, param, validationResult } from 'express-validator';

const prisma = new PrismaClient();

export const validateMenu = [
    // Validaciones existentes
    body('descripcion').notEmpty().withMessage('La descripción es requerida').
        isString().isLength({ min: 2, max: 100 }).withMessage('Descripción debe tener entre 2 y 100 caracteres'),
    body('activo').notEmpty().withMessage('La activo es requerido')
        .isBoolean().withMessage('Activo debe ser un valor booleano'),
    body('precio')
        .notEmpty().withMessage('El precio es requerido')
        .isDecimal({ decimal_digits: '0,2' }).withMessage('El precio debe tener como máximo 2 decimales'),
    body('id_categoria').notEmpty().withMessage('La categoría es obligatoria')
        .isInt().withMessage('ID de categoría debe ser un número entero'),
    body('id_restaurante').notEmpty().withMessage('El menu debe estar asignado a un restaurante es requerida')
        .isInt().withMessage('ID de restaurante debe ser un número entero'),

    // Middleware para verificar los resultados de la validación
    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

export default validateMenu;