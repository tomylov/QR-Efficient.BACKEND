import { Request, Response } from "express";
import { Menu, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const menuController = {
    getMenusRestaurante: async (req: Request, res: Response) => {
        const id = parseInt(req.params.id);
        try {
            const menus: Menu[] = await prisma.menu.findMany({
                where:{
                    id_restaurante: id
                },
                include:{
                    categoria:true
                }
            });
            res.json(menus);
        }
        catch (error) {
            res.status(500).json({ error: 'Error al obtener los Menus' });
        }
    },

    getMenuId: async (req: Request, res: Response) => {
        const id = parseInt(req.params.id);
        try {
            const menu: Menu | null = await prisma.menu.findUnique({
                where: {
                    id_menu: id
                }
            });
            if (!menu) {
                return res.status(404).json({ error: 'Menu no encontrado' });
            }
            res.json(menu);
        }
        catch (error) {
            res.status(500).json({ error: 'Error al obtener el menu' });
        }
    },

    createMenu: async (req: Request, res: Response) => {
        try {
            const nuevoMenu: Menu = await prisma.menu.create({
                data: {
                    ...req.body
                },
            });
            res.status(201).json('Menu creado con exito ' + nuevoMenu.descripcion);
        }
        catch (error) {
            res.status(500).json({ error: 'Error al crear el Menu' });
        }
    },

    updateMenu: async (req: Request, res: Response) => {
        const id = parseInt(req.params.id);
        try {
            const MenuExistente = await prisma.menu.findUnique({
                where: { id_menu: id },
            });

            if (!MenuExistente) {
                return res.status(404).json({ error: 'Menu no encontrado' });
            }

            const updateMenu: Menu = await prisma.menu.update({
                where: { id_menu: id },
                data: {
                    ...req.body
                },
            });
            res.json('Menu actualizado con exito' + updateMenu.descripcion);
        }
        catch (error) {
            res.status(500).json({ error: 'Error al actualizar el Menu' });
        }
    },

    deleteMenu: async (req: Request, res: Response) => {
        const id = parseInt(req.params.id);
        try {
            const menuExistente = await prisma.menu.findUnique({
                where: { id_menu: id },
            });

            if (!menuExistente) {
                return res.status(404).json({ error: 'Menu no encontrado' });
            }

            await prisma.menu.update({
                where: { id_menu: id },
                data:{
                    activo: false
                }
            });
            res.json('Menu eliminado con exito');
        }
        catch (error) {
            res.status(500).json({ error: 'Error al eliminar el Menu' });
        }
    }
}

export default menuController;