import { PrismaClient } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';
import { body, param, validationResult } from 'express-validator';

const prisma = new PrismaClient();

export const validarActualizacionMesero = [
    // Validaciones existentes
    param('id').isInt().withMessage('ID de mesero debe ser un número entero'),
    body('persona.nombre').optional().isString().isLength({ min: 2, max: 100 }).withMessage('Nombre debe tener entre 2 y 100 caracteres'),
    body('persona.apellido').optional().isString().isLength({ min: 2, max: 100 }).withMessage('Apellido debe tener entre 2 y 100 caracteres'),
    body('persona.dni').optional().isString().isLength({ min: 8, max: 8 }).matches(/^[a-zA-Z0-9]+$/).withMessage('El DNI solo debe contener letras y números').withMessage('DNI debe tener entre 5 y 20 caracteres'),
    body('usuario.contrasena').optional().isString().isLength({ min: 6 }).withMessage('Contraseña debe tener al menos 6 caracteres'),
    body('usuario.activo').optional().isBoolean().withMessage('Activo debe ser un valor booleano'),
    body('id_restaurante').optional().isInt().withMessage('ID de restaurante debe ser un número entero'),

    // Validación personalizada para el email
    body('usuario.email')
        .optional()
        .isEmail().withMessage('Email debe ser válido')
        .custom(async (email: string, { req }) => {
            const id_mesero = parseInt(req.params?.id || '');
            const usuarioExistente = await prisma.usuario.findFirst({
                where: {
                    email: email,
                    Persona: {
                        Mesero: {
                            id_mesero: { not: id_mesero }
                        }
                    }
                }
            });

            if (usuarioExistente) {
                throw new Error('El email ya está en uso por otro mesero');
            }

            return true;
        }),

    // Middleware para verificar los resultados de la validación
    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

export const validarCreacionMesero = [
    // Validaciones para los datos de la persona
    body('persona.nombre')
        .notEmpty().withMessage('El nombre es requerido')
        .isString().withMessage('El nombre debe ser una cadena de texto')
        .isLength({ min: 2, max: 100 }).withMessage('El nombre debe tener entre 2 y 100 caracteres'),

    body('persona.apellido')
        .notEmpty().withMessage('El apellido es requerido')
        .isString().withMessage('El apellido debe ser una cadena de texto')
        .isLength({ min: 2, max: 100 }).withMessage('El apellido debe tener entre 2 y 100 caracteres'),

    body('persona.dni')
        .notEmpty().withMessage('El DNI es requerido')
        .isString().withMessage('El DNI debe ser una cadena de texto')
        .isLength({ min: 8, max: 8 }).withMessage('El DNI debe tener entre 5 y 20 caracteres')
        .custom(async (dni: string) => {
            const personaExistente = await prisma.persona.findFirst({ where: { dni } });
            if (personaExistente) {
                throw new Error('El DNI ya está registrado');
            }
            return true;
        }),

    // Validaciones para los datos del usuario
    body('usuario.email')
        .notEmpty().withMessage('El email es requerido')
        .isEmail().withMessage('El email debe ser válido')
        .custom(async (email: string) => {
            const usuarioExistente = await prisma.usuario.findUnique({ where: { email } });
            if (usuarioExistente) {
                throw new Error('El email ya está registrado');
            }
            return true;
        }),

    body('usuario.contrasena')
        .notEmpty().withMessage('La contraseña es requerida')
        .isString().withMessage('La contraseña debe ser una cadena de texto')
        .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),

    // Validación para el ID del restaurante
    body('id_restaurante')
        .notEmpty().withMessage('El ID del restaurante es requerido')
        .isInt().withMessage('El ID del restaurante debe ser un número entero')
        .custom(async (id_restaurante: number) => {
            const restauranteExistente = await prisma.restaurante.findUnique({ where: { id_restaurante } });
            if (!restauranteExistente) {
                throw new Error('El restaurante especificado no existe');
            }
            return true;
        }),

    // Middleware para verificar los resultados de la validación
    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];