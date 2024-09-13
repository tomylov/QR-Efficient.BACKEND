import { Request, Response } from "express";
import { Mesero, Prisma, PrismaClient, Usuario } from "@prisma/client";

const prisma = new PrismaClient();

const meseroController = {
    getMeserosRestaurante: async (req: Request, res: Response) => {
        const id = parseInt(req.params.id);
        try {
            const meseros: Mesero[] = await prisma.mesero.findMany({
                where: {
                    id_restaurante: id
                },
                include: {
                    Persona: {
                        include: {
                            Usuario: true,
                        },
                    },
                },
            });

            if (!meseros || meseros.length === 0) {
                return res.status(404).json({ error: "No se encontraron meseros para este restaurante" });
            }

            res.json(meseros);
        }
        catch (error) {
            res.status(500).json({ error: "Error al obtener los meseros" });
        }
    },

    getMeseroId: async (req: Request, res: Response) => {
        const id = parseInt(req.params.id);

        try {
            const mesero: Mesero = await prisma.mesero.findFirstOrThrow({
                where: {
                    id_mesero:id,
                },
                include: {
                    Persona: {
                        include: {
                            Usuario: true,
                        },
                    },
                },
            });

            if (!mesero) {
                return res.status(404).json({ error: "Mesero no encontrado" });
            }

            res.json(mesero);

        } catch (error) {
            res.status(500).json({ error: "Error al obtener el mesero" });
        }

    },

    createmesero: async (req: Request, res: Response) => {
        const { usuario, persona, id_restaurante } = req.body;
        try {
            const nuevaPersona = await prisma.persona.create({
                data: {
                    email: usuario.email,
                    nombre: persona.nombre,
                    apellido: persona.apellido,
                    dni: persona.dni,
                }
            });
            const nuevoUsuario = await prisma.usuario.create({
                data: {
                    email: usuario.email,
                    contrasena: usuario.contrasena,
                    activo: true,
                    Persona: {
                        connect: { id_persona: nuevaPersona.id_persona }
                    }
                }
            });

            await prisma.mesero.create({
                data: {
                    Restaurante: {
                        connect: { id_restaurante: id_restaurante }
                    },
                    Persona: {
                        connect: { id_persona: nuevaPersona.id_persona }
                    }
                },
                include: {
                    Persona: {
                        include: {
                            Usuario: true
                        }
                    }
                }
            });

            res.status(201).json('Mesero creado con exito ' + persona.nombre);
        }
        catch (error) {
            console.error('Error al crear mesero:', error);
        }
    },

    updatemesero: async (req: Request, res: Response) => {
        const id = parseInt(req.params.id);
        const { usuario, persona, id_restaurante } = req.body;

        try {
            const meseroExistente = await prisma.mesero.findUnique({
                where: { id_mesero: id },
            });

            if (!meseroExistente) {
                return res.status(404).json({ error: 'mesero no encontrado' });
            }

            const meseroActualizado = await prisma.mesero.update({
                where: { id_mesero: id },
                data: {
                    Restaurante: id_restaurante ? {
                        connect: { id_restaurante: id_restaurante }
                    } : undefined,
                    Persona: persona ? {
                        update: {
                            nombre: persona.nombre,
                            apellido: persona.apellido,
                            dni: persona.dni,
                            Usuario: usuario ? {
                                update: {
                                    email: usuario.email,
                                    contrasena: usuario.contrasena,
                                    activo: usuario.activo
                                }
                            } : undefined
                        }
                    } : undefined
                },
                include: {
                    Persona: {
                        include: {
                            Usuario: true
                        }
                    },
                    Restaurante: true
                }
            });
            res.json('mesero actualizado con exito ' + meseroActualizado.id_mesero);
        }
        catch (error) {
            res.status(500).json({ error: 'Error al actualizar el mesero' });
        }
    }
}

export default meseroController;