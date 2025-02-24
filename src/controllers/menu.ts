import { Request, Response } from "express";
import { Menu, PrismaClient } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

const prisma = new PrismaClient();

const registrarAuditoria = async (data: {
    id_menu: number;
    id_persona: number;
    tipo_accion: string;
    precio_anterior?: Decimal;
    precio_nuevo?: Decimal;
}) => {
    try {
        await prisma.auditoria_Menu.create({
            data,
        });
    } catch (error) {
        // Se puede registrar el error en un log para revisión
        console.error("Error al registrar auditoría:", error);
    }
};

const menuController = {
    getMenusRestaurante: async (req: Request, res: Response) => {
        const id = parseInt(req.params.id);
        try {
            const menus: Menu[] = await prisma.menu.findMany({
                where: {
                    id_restaurante: id
                },
                include: {
                    categoria: true
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
        const { descripcion, activo, precio, foto, id_categoria, id_restaurante } = req.body;
        try {
            const nuevoMenu: Menu = await prisma.menu.create({
                data: {
                    descripcion: descripcion,
                    activo: activo,
                    precio: precio,
                    foto: foto,
                    id_categoria: id_categoria,
                    id_restaurante: id_restaurante
                },
            });

            await registrarAuditoria({
                id_menu: nuevoMenu.id_menu,
                id_persona: req.body.id_persona,
                tipo_accion: "CREATE",
                precio_nuevo: nuevoMenu.precio,
            });

            res.status(201).json('Menu creado con exito ' + nuevoMenu.descripcion);
        }
        catch (error) {
            res.status(500).json({ error: 'Error al crear el Menu' });
        }
    },

    updateMenu: async (req: Request, res: Response) => {
        const id = parseInt(req.params.id);
        const { descripcion, activo, precio, foto, id_categoria, id_restaurante } = req.body;
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
                    descripcion: descripcion,
                    activo: activo,
                    precio: precio,
                    foto: foto,
                    id_categoria: id_categoria,
                    id_restaurante: id_restaurante
                },
            });

            if (MenuExistente.activo === false && updateMenu.activo === true) {
                await registrarAuditoria({
                    id_menu: id,
                    id_persona: req.body.id_persona,
                    tipo_accion: "ACTIVAR",
                    precio_anterior: MenuExistente.precio,
                    precio_nuevo: updateMenu.precio,
                });
            } else {
                await registrarAuditoria({
                    id_menu: id,
                    id_persona: req.body.id_persona,
                    tipo_accion: "UPDATE",
                    precio_anterior: MenuExistente.precio,
                    precio_nuevo: updateMenu.precio,
                });
            };

            res.json('Menu actualizado con exito' + updateMenu.descripcion);
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ error: error });
        }
    },

    deleteMenu: async (req: Request, res: Response) => {
        const id = parseInt(req.params.id);
        const { id_persona } = req.query;
        try {
            const menuExistente = await prisma.menu.findUnique({
                where: { id_menu: id },
            });

            if (!menuExistente) {
                return res.status(404).json({ error: 'Menu no encontrado' });
            }

            await prisma.menu.update({
                where: { id_menu: id },
                data: {
                    activo: false
                }
            });

            await registrarAuditoria({
                id_menu: id,
                id_persona: parseInt(id_persona as string),
                tipo_accion: "DESACTIVAR",
                precio_anterior: menuExistente.precio,
            });

            res.json('Menu eliminado con exito');
        }
        catch (error) {
            res.status(500).json({ error: 'Error al eliminar el Menu' });
        }
    }
}

export default menuController;