import { Request, Response } from "express";
import { Comanda, Cuenta, Detalle_comanda, PrismaClient } from "@prisma/client";
import MesaAtendidaController from "./mesa";

const prisma = new PrismaClient();

const comandaController = {
    getcomandaId: async (req: Request, res: Response) => {
        const id = parseInt(req.params.id);
        try {
            const comanda: Comanda | null = await prisma.comanda.findUnique({
                where: {
                    id_comanda: id,
                },
                include: {
                    DetallesComanda: true,
                    EstadoComanda: true,
                }
            });

            if (!comanda) {
                return res.status(404).json({ error: 'Comanda no encontrado' });
            }

            res.status(200).json(comanda);

        } catch (error) {
            res.status(500).json({ error: 'Error al obtener la comanda' });
        }
    },

    getComandasMesa: async (req: Request, res: Response) => {
        const id_mesa = parseInt(req.params.id);
        try {
            const comandas = await prisma.comanda.findMany({
                where: {
                    Cuenta: {
                        id_mesa_atendida: id_mesa,
                        id_estado_cuenta: 1,
                    },
                },
                include: {
                    Persona: true,
                    EstadoComanda: true,
                },
            });

            if (comandas.length === 0) {
                return res.status(404).json({ message: 'No hay comandas para esta mesa con cuenta abierta.' });
            }

            // Devolvemos las comandas
            return res.status(200).json(comandas);

        } catch (error) {
            res.status(500).json({ error: 'Error al obtener la comanda' });
        }
    },

    getComandasDetalleCuenta: async (req: Request, res: Response) => {
        const id = parseInt(req.params.id);
        try {
            const comandas = await prisma.comanda.findMany({
                where: {
                    Cuenta: {
                        id_mesa_atendida: id,
                        id_estado_cuenta: 1,
                    },
                    id_estado_comanda: {
                        not: 5,
                    },
                },
                include: {
                    DetallesComanda: {
                        include: {
                            Menu: true,
                        },
                    },
                },
            });
            console.log(comandas);

            if (comandas.length === 0) {
                return res.status(404).json({ message: 'No hay comandas para esta mesa con cuenta abierta.' });
            }

            return res.status(200).json(comandas);

        } catch (error) {
            res.status(500).json({ error: 'Error al obtener los detalles de la comanda' });
        }
    },

    createComanda: async (req: Request, res: Response) => {
        try {
            const {
                id_mesa_atendida,
                id_persona,
                observaciones,
                total,
                id_estado_comanda,
                detallesComanda
            } = req.body;

            let cuenta = await prisma.cuenta.findFirst({
                where: {
                    id_mesa_atendida: id_mesa_atendida,
                    id_estado_cuenta: 1,
                },
            });

            if (!cuenta) {
                cuenta = await prisma.cuenta.create({
                    data: {
                        id_mesa_atendida: id_mesa_atendida,
                        id_estado_cuenta: 1,
                        total: 0,
                    },
                });

                await prisma.mesa_atendida.update({
                    where: {
                        id_mesa_atendida: id_mesa_atendida
                    },
                    data: {
                        id_estado_mesa: 2,
                    }
                });
            }/* else{
                prisma.cuenta.update({
                    where: {
                        id_cuenta: cuenta.id_cuenta
                    },
                    data: {
                        total: cuenta.total + total,
                    }
                });
            } */

            const comanda = await prisma.comanda.create({
                data: {
                    id_cuenta: cuenta.id_cuenta,
                    id_estado_comanda: id_estado_comanda,
                    id_persona: id_persona,
                    observaciones: observaciones,
                    total: total,
                    DetallesComanda: {
                        createMany: {
                            data: detallesComanda
                        }
                    }
                },
                include: {
                    DetallesComanda: true,
                },
            });

            console.log(comanda);

            res.status(201).json('Comanda creada con exito');
        } catch (error) {
            return res.status(500).json({ error: error });
        }
    },

    updateDetalleComanda: async (req: Request, res: Response) => {
        const id = parseInt(req.params.id);
        try {
            const {
                id_estado_comanda,
                total,
                detallesComanda
            } = req.body;

            const comanda = await prisma.comanda.update({
                where: {
                    id_comanda: id
                },
                data: {
                    id_estado_comanda: id_estado_comanda,
                    total: total,
                    DetallesComanda: {
                        createMany: {
                            data: detallesComanda
                        }
                    }
                },
                include: {
                    DetallesComanda: true,
                },
            });

            res.status(200).json('Comanda actualizada con exito');
        } catch (error) {
            return res.status(500).json({ error: error });
        }
    },

    updateComanda: async (req: Request, res: Response) => {
        const id = parseInt(req.params.id);
        try {
            const {
                id_estado_comanda
            } = req.body;

            const comanda = await prisma.comanda.update({
                where: {
                    id_comanda: id
                },
                data: {
                    id_estado_comanda: id_estado_comanda
                }
            });

            res.status(200).json('Comanda actualizada con exito');
        } catch (error) {
            return res.status(500).json({ error: error });
        }
    },

    deleteComanda: async (req: Request, res: Response) => {
        const id = parseInt(req.params.id);
        try {
            const comanda = await prisma.comanda.update({
                where: {
                    id_comanda: id
                },
                data: {
                    id_estado_comanda: 5
                }
            });

            res.status(200).json('Comanda eliminada con exito');
        } catch (error) {
            return res.status(500).json({ error: error });
        }
    },

}

export default comandaController;