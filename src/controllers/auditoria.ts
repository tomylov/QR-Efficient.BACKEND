import { Request, Response } from "express";
import { PrismaClient, Usuario } from "@prisma/client";

const prisma = new PrismaClient();

const auditoriaController = {
    getAuditorias: async (req: Request, res: Response) => {
        const { fechaInicio, fechaFin, id_restaurante } = req.query;
        try {
            const auditorias = await prisma.auditoria_Menu.findMany({
                select: {
                    id_auditoria: true,
                    fecha_accion: true,
                    tipo_accion: true,
                    precio_anterior: true,
                    precio_nuevo: true,
                    id_menu: true,
                    id_persona: true,
                    Menu: {
                        select: {
                            descripcion: true,
                            categoria: {
                                select: {
                                    nombre: true,
                                },
                            },
                        },
                    },
                    Persona: {
                        select: {
                            nombre: true,
                            apellido: true,
                        },
                    }
                },
                where: {
                    fecha_accion: {
                        gte: new Date(fechaInicio as string),
                        lte: new Date(fechaFin as string),
                    },
                    Menu: {
                        id_restaurante: parseInt(id_restaurante as string)
                    }
                },
                orderBy: {
                    id_menu: 'desc',
                },
            });

            res.status(200).json(auditorias);
        }
            catch (error) {
            res.status(500).json({ error: error });
        }
    },
}

export default auditoriaController;