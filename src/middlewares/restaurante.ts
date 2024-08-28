import { Request, Response, NextFunction } from 'express';

const validateRestaurante = (req: Request, res: Response, next: NextFunction) => {
    const { nombre, direccion } = req.body;

    if (!nombre || !direccion) {
        return res.status(400).json({ error: 'Nombre y dirección son requeridos' });
    }

    if (typeof nombre !== 'string' || typeof direccion !== 'string') {
        return res.status(400).json({ error: 'Nombre y dirección deben ser cadenas de texto' });
    }

    next();
};

export default validateRestaurante;