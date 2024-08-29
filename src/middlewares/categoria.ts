import { Categoria } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';

const validateCategoria = (req: Request, res: Response, next: NextFunction) => {
    const categoria: Categoria = req.body;

    if (!categoria.nombre) {
        return res.status(400).json({ error: 'Nombre es requerido' });
    }

    if (typeof categoria.nombre !== 'string') {
        return res.status(400).json({ error: 'Nombre deben ser un string' });
    }

    next();
};

export default validateCategoria;