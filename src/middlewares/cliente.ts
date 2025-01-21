import { PrismaClient } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';
import { body, param, validationResult } from 'express-validator';

const prisma = new PrismaClient();

export const validarUpdateCliente = () => [
    // Validaciones existentes
    param('id').isInt().withMessage('ID de cliente debe ser un número entero'),
    body('Persona.nombre').optional().isString().isLength({ min: 2, max: 100 }).withMessage('Nombre debe tener entre 2 y 100 caracteres'),
    body('Persona.apellido').optional().isString().isLength({ min: 2, max: 100 }).withMessage('Apellido debe tener entre 2 y 100 caracteres'),
    body('Persona.dni')
        .optional().isString().isLength({ min: 8, max: 8 }).withMessage('DNI debe tener 8 caracteres')
        .isInt().withMessage('El DNI solo debe contener números')
        .custom(async (dni: string, { req }) => {
            const personaExistente = await prisma.persona.findFirst({
                where: {
                    dni,
                    Cliente: { id_cliente: { not: parseInt(req.params?.id || '') } }
                }
            });
            if (personaExistente) {
                throw new Error('El DNI ya está registrado');
            }
            return true;
        }),
    body('Usuario.contrasena').optional().isString().isLength({ min: 6 }).withMessage('Contraseña debe tener al menos 6 caracteres'),
    body('Usuario.activo').optional().isBoolean().withMessage('Activo debe ser un valor booleano'),

    // Validación personalizada para el email
    body('Usuario.email')
        .optional()
        .isEmail().withMessage('Email debe ser válido')
        .custom(async (email: string, { req }) => {
            const id_cliente = parseInt(req.params?.id || '');
            const usuarioExistente = await prisma.usuario.findFirst({
                where: {
                    email: email,
                    Persona: {
                        Cliente: {
                            id_cliente: { not: id_cliente }
                        }
                    }
                }
            });

            if (usuarioExistente) {
                throw new Error('El email ya está en uso por otro cliente');
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

export const validarCreateCliente = () => [
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
        .optional().isString().isLength({ min: 8, max: 8 }).withMessage('DNI debe tener 8 caracteres')
        .isInt().withMessage('El DNI solo debe contener números')
        .custom(async (dni: string) => {
            const personaExistente = await prisma.persona.findFirst({ where: { dni }, include: { Cliente: true } });
            if (personaExistente?.Cliente) {
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

    // Middleware para verificar los resultados de la validación
    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];