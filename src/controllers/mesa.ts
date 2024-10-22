import { Request, Response } from "express";
import { Mesa_atendida, Prisma, PrismaClient, Usuario } from "@prisma/client";
import bcrypt from "bcrypt";

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
                MesaAtendida: mesas.MesasAtendidas.length > 0 ? {
                    id_mesa_atendida: mesas.MesasAtendidas[0].id_mesa_atendida,
                    fecha_inicio: `${mesas.MesasAtendidas[0].fecha_inicio.toDateString()} ${mesas.MesasAtendidas[0].fecha_inicio.getUTCHours()}:${mesas.MesasAtendidas[0].fecha_inicio.getMinutes()}`,
                    descripcion: mesas.MesasAtendidas[0].Estado_mesa.descripcion,
                    nombre: `${mesas.MesasAtendidas[0].Mesero.Persona.nombre} ${mesas.MesasAtendidas[0].Mesero.Persona.apellido}`
                } :
                    {
                        id_mesa_atendida: mesas.numero,
                        fecha_inicio: null,
                        descripcion: 'Mesa cerrada',
                        nombre: 'Sin asignar'
                    }
            }));

            res.json(mesas);
        }
        catch (error) {
            res.status(500).json({ error: "Error al obtener los Mesas" });
        }
    }
}

export default MesaAtendidaController;