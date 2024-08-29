import { Request, Response } from "express";
import { Categoria, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const categoriaController = {
    getCategorias: async (req: Request, res: Response) => {
        try {
            const categorias: Categoria[] = await prisma.categoria.findMany();
            res.json(categorias);
        }
        catch (error) {
            res.status(500).json({ error: 'Error al obtener las categorias' });
        }
    },

    getCategoriaId: async (req: Request, res: Response) => {
        const id = parseInt(req.params.id);
        try {
            const categoria: Categoria | null = await prisma.categoria.findUnique({
                where: {
                    id_categoria: id
                }
            });
            if (!categoria) {
                return res.status(404).json({ error: 'Categoria no encontrado' });
            }
            res.json(categoria);
        }
        catch (error) {
            res.status(500).json({ error: 'Error al obtener el categoria' });
        }
    },

    createCategoria: async (req: Request, res: Response) => {
        try {
            const nuevocategoria: Categoria = await prisma.categoria.create({
                data: {
                    ...req.body
                },
            });
            res.status(201).json('Categoria creado con exito ' + nuevocategoria.nombre);
        }
        catch (error) {
            res.status(500).json({ error: 'Error al crear el categoria' });
        }
    },

    updateCategoria: async (req: Request, res: Response) => {
        const id = parseInt(req.params.id);
        try {
            const categoriaExistente = await prisma.categoria.findUnique({
                where: { id_categoria: id },
            });

            if (!categoriaExistente) {
                return res.status(404).json({ error: 'Categoria no encontrado' });
            }

            const updatecategoria: Categoria = await prisma.categoria.update({
                where: { id_categoria: id },
                data: {
                    ...req.body
                },
            });
            res.json('Categoria actualizado con exito ' + updatecategoria.nombre);
        }
        catch (error) {
            res.status(500).json({ error: 'Error al actualizar el categoria' });
        }
    }
}

export default categoriaController;