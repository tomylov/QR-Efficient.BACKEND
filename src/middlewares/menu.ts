import { PrismaClient } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';

const prisma = new PrismaClient();

const validateMenu = async (req: Request, res: Response, next: NextFunction) => {
    const { descripcion, precio, activo, id_restaurante, id_categoria } = req.body;

    // Validar que 'descripcion' esté presente y sea una cadena de texto
    if (!descripcion || typeof descripcion !== 'string') {
        return res.status(400).json({ error: 'La descripción es requerida y debe ser una cadena de texto' });
    }

    // Validar que 'precio' esté presente, sea un número y positivo
    if (precio === undefined || typeof precio !== 'number' || precio <= 0) {
        return res.status(400).json({ error: 'El precio es requerido, debe ser un número y mayor que 0' });
    }

    // Validar que 'activo' sea un booleano si está presente
    if (activo !== undefined && typeof activo !== 'boolean') {
        return res.status(400).json({ error: 'El estado activo debe ser un valor booleano' });
    }

    // Validar que 'id_restaurante' esté presente y sea un número
    if (!id_restaurante || typeof id_restaurante !== 'number') {
        return res.status(400).json({ error: 'El id_restaurante es requerido y debe ser un número' });
    }

    // Validar que el restaurante exista
    const restauranteExistente = await prisma.restaurante.findUnique({
        where: { id_restaurante: id_restaurante },
    });

    if (!restauranteExistente) {
        return res.status(404).json({ error: 'Restaurante no encontrado' });
    }

    // Validar que 'id_categoria' esté presente y sea un número
    if (!id_categoria || typeof id_categoria !== 'number') {
        return res.status(400).json({ error: 'El id_categoria es requerido y debe ser un número' });
    }

    // Validar que la categoría exista
    const categoriaExistente = await prisma.categoria.findUnique({
        where: { id_categoria: id_categoria },
    });

    if (!categoriaExistente) {
        return res.status(404).json({ error: 'Categoría no encontrada' });
    }


    next(); // Si todas las validaciones pasan, continuar con el siguiente middleware o controlador
};

export default validateMenu;