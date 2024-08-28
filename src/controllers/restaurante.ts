import { Request, Response } from "express";
import { PrismaClient, Restaurante } from "@prisma/client";
import { parse } from "path";

const prisma = new PrismaClient();

const restauranteController = {
    getRestaurantes: async (req: Request, res: Response) => {
        try {
            const restaurantes: Restaurante[] = await prisma.restaurante.findMany();
            res.json(restaurantes);
        }
        catch (error) {
            res.status(500).json({ error: 'Error al obtener los restaurantes' });
        }
    },

    getRestaurantesId: async (req: Request, res: Response) => {
        const id = parseInt(req.params.id);
        try {
            const restaurante: Restaurante | null = await prisma.restaurante.findUnique({
                where: {
                    id_restaurante: id
                }
            });
            if (!restaurante) {
                return res.status(404).json({ error: 'Restaurante no encontrado' });
            }
            res.json(restaurante);
        }
        catch (error) {
            res.status(500).json({ error: 'Error al obtener el restaurante' });
        }
    },

    createRestaurante: async (req: Request, res: Response) => {
        try {
            const nuevoRestaurante: Restaurante = await prisma.restaurante.create({
                data: {
                    ...req.body
                },
            });
            res.status(201).json('Restaurante creado con exito ' + nuevoRestaurante.nombre);
        }
        catch (error) {
            res.status(500).json({ error: 'Error al crear el restaurante' });
        }
    },

    updateRestaurante: async (req: Request, res: Response) => {
        const id = parseInt(req.params.id);
        try {
            const restauranteExistente = await prisma.restaurante.findUnique({
                where: { id_restaurante: Number(id) },
            });

            if (!restauranteExistente) {
                return res.status(404).json({ error: 'Restaurante no encontrado' });
            }

            const updateRestaurante: Restaurante = await prisma.restaurante.update({
                where: { id_restaurante: id },
                data: {
                    ...req.body
                },
            });
            res.json('Restaurante actualizado con exito' + updateRestaurante.nombre);
        }
        catch (error) {
            res.status(500).json({ error: 'Error al actualizar el restaurante' });
        }
    }
}

export default restauranteController;