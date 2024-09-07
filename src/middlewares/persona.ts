import { Request, Response, NextFunction } from 'express';

const validatePersonaData = (req: Request, res: Response, next: NextFunction) => {
    const { email, nombre, apellido, dni } = req.body;

    // Verificar que los campos requeridos estén presentes
    if (!email || !nombre || !apellido || !dni) {
        return res.status(400).json({ error: 'Todos los campos (email, nombre, apellido, dni) son obligatorios' });
    }

    // Validar formato del email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'El formato del email es inválido' });
    }

    // Validar longitud del DNI
    if (dni.length > 10) {
        return res.status(400).json({ error: 'El DNI no puede tener más de 10 caracteres' });
    }

    // Si todas las validaciones pasan, continuar con la siguiente función
    next();
};

export default validatePersonaData;
