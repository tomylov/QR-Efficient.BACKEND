import { Request, Response } from "express";
import { Mesero, Prisma, PrismaClient, Usuario } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const meseroController = {
    getMeserosRestaurante: async (req: Request, res: Response) => {
        const id = parseInt(req.params.id);
        try {
            const meseros = await prisma.mesero.findMany({
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
            const resultado = meseros.map(mesero => ({
                id_restaurante: mesero.id_restaurante,
                id_mesero: mesero.id_mesero,
                id_persona: mesero.id_persona,
                persona: {
                    email: mesero.Persona?.email || "",
                    nombre: mesero.Persona?.nombre || "",
                    apellido: mesero.Persona?.apellido || "",
                    dni: mesero.Persona?.dni || ""
                },
                usuario: {
                    email: mesero.Persona?.Usuario?.email || "",
                    contrasena: mesero.Persona?.Usuario?.contrasena || "",
                    activo: mesero.Persona?.Usuario?.activo,
                    grupoId: mesero.Persona?.Usuario?.grupoId || null
                }
            }));

            res.json(resultado);
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
            const hashedPassword = await bcrypt.hash(usuario.contrasena, 10);
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
                    contrasena: hashedPassword,
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
            const datosActualizacion = {
                Restaurante: id_restaurante ? {
                    connect: { id_restaurante: id_restaurante }
                } : undefined,
                Persona: persona ? {
                    update: {
                        nombre: persona.nombre,
                        apellido: persona.apellido,
                        dni: persona.dni,
                        email: persona.email,
                        Usuario: usuario ? {
                            update: {
                                email: usuario.email,
                                activo: usuario.activo,
                                ...(usuario.contrasena ? { contrasena: await bcrypt.hash(usuario.contrasena, 10) } : {})
                            }
                        } : undefined
                    }
                } : undefined
            };

            const meseroActualizado = await prisma.mesero.update({
                where: { id_mesero: id },
                data: datosActualizacion,
                include: {
                    Persona: {
                        include: {
                            Usuario: true
                        }
                    },
                    Restaurante: true
                }
            });

            res.json('mesero actualizado con éxito ' + meseroActualizado.Persona.dni);
        }
        catch (error) {
            res.status(500).json({ error: 'Error al actualizar el mesero' });
        }
    }
}

export default meseroController;