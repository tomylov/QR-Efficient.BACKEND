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
                        id_estado_cuenta: 1,
                        MesaAtendida: {
                            id_mesa: id_mesa,
                        },
                    },
                },
                include: {
                    Persona: true,
                    EstadoComanda: true,
                    DetallesComanda: {
                        include: {
                            Menu: true,
                        }
                    },
                },
            });


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
                        id_estado_cuenta: 1,
                        MesaAtendida: {
                            id_mesa: id,
                        },
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
                    Cuenta:{
                        include: {
                            MesaAtendida: true,
                        },
                    },
                },
            });

            if (comandas.length === 0) {
                res.status(404).json({ message: 'No hay comandas para esta mesa con cuenta abierta.' });
            }

            return res.status(200).json(comandas);

        } catch (error) {
            res.status(500).json({ error: 'Error al obtener los detalles de la comanda' });
        }
    },

    getComandasRestaurante: async (req: Request, res: Response) => {
        const id = parseInt(req.params.id);
        try {
            const comandas = await prisma.comanda.findMany({
                select: {
                    id_comanda: true,
                    id_estado_comanda: true,
                    id_cuenta: true,
                    observaciones: true,
                    total: true,
                    Cuenta: {
                        select: {
                            MesaAtendida: {
                                select: {
                                    Mesa: {
                                        select: {
                                            descripcion: true,
                                            numero: true,
                                        }
                                    }
                                }
                            }
                        }
                    },
                    DetallesComanda: {
                        select: {
                            precio_unitario: true,
                            cantidad: true,
                            Menu: {
                                select: {
                                    descripcion: true,
                                }
                            }
                        },
                    },
                },
                where: {
                    Cuenta: {
                        MesaAtendida: {
                            Mesa: {
                                id_restaurante: id,
                            },
                        },
                    },
                    id_estado_comanda: {
                        notIn: [1,5,6],
                    },
                },

            })

            if (comandas.length === 0) {
                res.status(204).json({ message: 'No hay comandas para este restaurante con cuenta abierta.' });
            }

            res.status(200).json(comandas);

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
            }

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