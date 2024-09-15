import { Request, Response } from "express";
import { Cliente, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const clienteController = {
    getClienteId: async (req: Request, res: Response) => {
        const id = parseInt(req.params.id);

        try {
            const cliente: Cliente = await prisma.cliente.findFirstOrThrow({
                where: {
                    id_cliente: id,
                },
                include: {
                    Persona: {
                        include: {
                            Usuario: true,
                        },
                    },
                },
            });

            if (!cliente) {
                return res.status(404).json({ error: "cliente no encontrado" });
            }

            res.json(cliente);

        } catch (error) {
            res.status(500).json({ error: "Error al obtener el cliente" });
        }
    },

    createCliente: async (req: Request, res: Response) => {
        const { usuario, persona } = req.body;
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

            await prisma.cliente.create({
                data: {
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

            res.status(201).json('cliente creado con exito ' + persona.nombre);
        }
        catch (error) {
            console.error('Error al crear cliente:', error);
        }
    },

    updateCliente: async (req: Request, res: Response) => {
        const id = parseInt(req.params.id);
        const { usuario, persona } = req.body;

        try {
            const clienteExistente = await prisma.cliente.findUnique({
                where: { id_cliente: id },
            });

            if (!clienteExistente) {
                return res.status(404).json({ error: 'cliente no encontrado' });
            }

            const clienteActualizado = await prisma.cliente.update({
                where: { id_cliente: id },
                data: {
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
                }
            });
            res.json('cliente actualizado con exito ' + clienteActualizado.id_cliente);
        }
        catch (error) {
            res.status(500).json({ error: 'Error al actualizar el cliente' });
        }
    }
}

export default clienteController;