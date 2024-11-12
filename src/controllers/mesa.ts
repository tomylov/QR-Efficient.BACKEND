import { Request, Response } from "express";
import { Mesa_atendida, Prisma, PrismaClient, Usuario } from "@prisma/client";

const prisma = new PrismaClient();

const MesaAtendidaController = {
    getMesasRestaurante: async (req: Request, res: Response) => {
        const id = parseInt(req.params.id);
        try {
            const Mesas_atendidas = await prisma.mesa.findMany({
                where: {
                    id_restaurante: id
                },
                select: {
                    numero: true,
                    descripcion: true,
                    MesasAtendidas: {
                        select: {
                            id_mesa_atendida: true,
                            fecha_inicio: true,
                            Estado_mesa: {
                                select: {
                                    descripcion: true
                                }
                            },
                            Mesero: {
                                select: {
                                    Persona: {
                                        select: {
                                            apellido: true,
                                            nombre: true
                                        }
                                    }
                                }
                            }
                        },
                        where: {
                            id_estado_mesa: {
                                not: 3
                            }
                        }
                    }
                }
            });

            if (!Mesas_atendidas || Mesas_atendidas.length === 0) {
                return res.status(404).json({ error: "No se encontraron Mesas para este restaurante" });
            }

            const mesas = Mesas_atendidas.map(mesas => ({
                numero: mesas.numero,
                descripcion: mesas.descripcion,
                MesaAtendida: mesas.MesasAtendidas.length > 0 ? {
                    id_mesa_atendida: mesas.MesasAtendidas[0].id_mesa_atendida,
                    fecha_inicio: mesas.MesasAtendidas[0].fecha_inicio,
                    descripcion: mesas.MesasAtendidas[0].Estado_mesa.descripcion,
                    nombre: `${mesas.MesasAtendidas[0].Mesero.Persona.nombre} ${mesas.MesasAtendidas[0].Mesero.Persona.apellido}`
                } :
                    {
                        id_mesa_atendida: mesas.numero,
                        fecha_inicio: null,
                        descripcion: 'Cerrada',
                        nombre: 'Sin asignar'
                    }
            }));

            res.json(mesas);
        }
        catch (error) {
            res.status(500).json({ error: "Error al obtener los Mesas" });
        }
    },

    createMesaAtendida: async (req: Request, res: Response) => {
        const { id_mesa, id_mesero } = req.body;
        try {
            const mesa = await prisma.mesa.findUnique({
                where: {
                    numero: id_mesa
                }
            });

            if (!mesa) {
                return res.status(404).json({ error: "Mesa no encontrada" });
            }

            const mesa_atendida = await prisma.mesa_atendida.create({
                data: {
                    id_mesa: id_mesa,
                    id_mesero: id_mesero,
                    id_estado_mesa: 1,
                    fecha_inicio: new Date()
                }
            });

            res.json("Mesa creada con exito "+ mesa_atendida);
        }
        catch (error) {
            res.status(500).json({ error: "Error al crear la Mesa" });
        }
    },

    updateMesaAtendida: async (req: Request, res: Response) => {
        const { id_estado_mesa, fecha_cierre } = req.body;
        const id = parseInt(req.params.id);
        try {
            const mesa_atendida = await prisma.mesa_atendida.update({
                where: {
                    id_mesa_atendida: id
                },
                data: {
                    id_estado_mesa: id_estado_mesa,
                    fecha_cierre: fecha_cierre
                }
            });

            res.json("Mesa editada con exito"+mesa_atendida);
        }
        catch (error) {
            res.status(500).json({ error: "Error al actualizar la Mesa" });
        }
    },
}

export default MesaAtendidaController;