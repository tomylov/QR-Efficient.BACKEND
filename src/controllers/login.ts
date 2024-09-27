import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const loginController = {
    loginUsuarios: async (req: Request, res: Response) => {
        const { email, contrasena } = req.body;

        try {
            // Buscar al usuario por email
            const usuario = await prisma.usuario.findUnique({
                where: { email },
            });

            // Si el usuario no existe o está inactivo
            if (!usuario || !usuario.activo) {
                return res.status(401).json({ message: 'Credenciales incorrectas o cuenta inactiva' });
            }

            // Comparar la contraseña
            const validPassword = await bcrypt.compare(contrasena, usuario.contrasena);
            if (!validPassword) {
                return res.status(401).json({ message: 'Credenciales incorrectas' });
            }

/*             // Generar un token JWT
            const token = jwt.sign(
                { id_usuario: usuario.id_usuario, email: usuario.email },
                process.env.JWT_SECRET || 'secretKey',
                { expiresIn: '1h' }
            ); */

            // Enviar el token y los datos del usuario
            res.json({
                //token,
                usuario: {
                    id_usuario: usuario.id_usuario,
                    email: usuario.email,
                    id_persona: usuario.id_persona,
                    grupoId: usuario.grupoId,
                },
            });
        } catch (error) {
            res.status(500).json({ message: 'Error en el servidor', error });
        }

    }
}

export default loginController;