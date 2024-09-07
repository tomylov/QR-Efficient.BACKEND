import { Request, Response } from "express";
import { Persona, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const personaController = {
    getPersonas: async (req: Request, res: Response) => {
        try {
            const personas: Persona[] = await prisma.persona.findMany();
            res.json(personas);
        }
        catch (error) {
            res.status(500).json({ error: 'Error al obtener las personas' });
        }
    },

    getPersonaId: async (req: Request, res: Response) => {
        const id = parseInt(req.params.id);
        try {
            const persona: Persona | null = await prisma.persona.findUnique({
                where: {
                    id_persona: id
                }
            });
            if (!persona) {
                return res.status(404).json({ error: 'persona no encontrado' });
            }
            res.json(persona);
        }
        catch (error) {
            res.status(500).json({ error: 'Error al obtener el persona' });
        }
    },

    createPersona: async (req: Request, res: Response) => {
        try {
            const nuevopersona: Persona = await prisma.persona.create({
                data: {
                    ...req.body
                },
            });
            res.status(201).json('persona creado con exito ' + nuevopersona.nombre);
        }
        catch (error) {
            res.status(500).json({ error: 'Error al crear el persona' });
        }
    },

    updatePersona: async (req: Request, res: Response) => {
        const id = parseInt(req.params.id);
        try {
            const personaExistente = await prisma.persona.findUnique({
                where: { id_persona: id },
            });

            if (!personaExistente) {
                return res.status(404).json({ error: 'persona no encontrado' });
            }

            const updatePersona: Persona = await prisma.persona.update({
                where: { id_persona: id },
                data: {
                    ...req.body
                },
            });
            res.json('persona actualizado con exito ' + updatePersona.nombre);
        }
        catch (error) {
            res.status(500).json({ error: 'Error al actualizar el persona' });
        }
    }
}

export default personaController;