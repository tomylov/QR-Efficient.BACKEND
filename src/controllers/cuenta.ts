import { Request, Response } from "express";
import { Cuenta, PrismaClient } from "@prisma/client";
import MesaAtendidaController from "./mesa";

const prisma = new PrismaClient();

const cuentaController = {
    closeCuenta: async (req: Request, res: Response) => {
        const id = parseInt(req.params.id);
        try {
            const { total } = req.body;
            const cuenta: Cuenta | null = await prisma.cuenta.findUnique({
                where: {
                    id_cuenta: id,
                }
        });

            if (!cuenta) {
                return res.status(404).json({ error: 'Cuenta no encontrada' });
            }

            if (cuenta.id_estado_cuenta === 2) {
                return res.status(400).json({ error: 'La cuenta ya se encuentra cerrada' });
            }

            await prisma.cuenta.update({
                where: {
                    id_cuenta: cuenta.id_cuenta,
                },
                data: {
                    id_estado_cuenta: 2,
                    total: total,
                    fecha_cierre: new Date(),
                }
            });

            await prisma.mesa_atendida.update({
                where: {
                    id_mesa_atendida: cuenta.id_mesa_atendida,
                },
                data: {
                    id_estado_mesa: 1,
                }
            });

            return res.status(200).json({ message: 'Cuenta cerrada correctamente' });

        } catch (error) {
            res.status(500).json({ error: 'Error al cerrar la cuenta' });
        }
    },

}
export default cuentaController;