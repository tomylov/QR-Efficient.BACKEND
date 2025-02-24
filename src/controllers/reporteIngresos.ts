// controllers/dashboardController.ts
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dashboardController = {
    getMetricas: async (req: Request, res: Response) => {
        const { fechaInicio, fechaFin, id_restaurante } = req.query;
        try {
            const fechaFinDate = new Date(fechaFin as string);
            const fechaInicioDate = new Date(fechaInicio as string);
            fechaInicioDate.setHours(0, 0, 0, 0);
            fechaFinDate.setHours(23, 59, 59, 999);

            const [ventasTotales, mesasAtendidas, productosVendidos] = await Promise.all([
                prisma.cuenta.aggregate({
                    where: {
                        Comandas: {
                            some: {
                                id_estado_comanda: {
                                    not: 5
                                }
                            }
                        },
                        fecha_cierre: {
                            gte: fechaInicioDate,
                            lte: fechaFinDate
                        },
                        MesaAtendida: {
                            Mesa: {
                                id_restaurante: parseInt(id_restaurante as string)
                            }
                        },
                    },
                    _sum: {
                        total: true
                    }
                }),

                prisma.cuenta.count({
                    where: {
                        fecha_cierre: {
                            gte: fechaInicioDate,
                            lte: fechaFinDate
                        },
                        MesaAtendida: {
                            Mesa: {
                                id_restaurante: parseInt(id_restaurante as string)
                            }
                        },
                        Comandas: {
                            some: {
                                id_estado_comanda: {
                                    not: 5
                                }
                            }
                        }
                    }
                }),

                prisma.detalle_comanda.aggregate({
                    where: {
                        Comanda: {
                            id_estado_comanda: {
                                not: 5
                            },
                            Cuenta: {
                                fecha_cierre: {
                                    gte: fechaInicioDate,
                                    lte: fechaFinDate
                                },
                                MesaAtendida: {
                                    Mesa: {
                                        id_restaurante: parseInt(id_restaurante as string)
                                    }
                                }
                            }
                        }
                    },
                    _sum: {
                        cantidad: true
                    }
                })
            ]);

            res.json({
                ventasTotales: ventasTotales._sum.total || 0,
                mesasAtendidas,
                productosVendidos: productosVendidos._sum.cantidad || 0,
                ticketPromedio: ventasTotales._sum.total ?
                    Number(ventasTotales._sum.total) / mesasAtendidas : 0
            });


        } catch (error) {
            res.status(500).json({ error: "Error al obtener métricas" });
        }
    },

    getVentasDiarias: async (req: Request, res: Response) => {
        const { fechaInicio, fechaFin, id_restaurante } = req.query;
        try {
            const fechaFinDate = new Date(fechaFin as string);
            const fechaInicioDate = new Date(fechaInicio as string);
            fechaInicioDate.setHours(0, 0, 0, 0);
            fechaFinDate.setHours(23, 59, 59, 999);

            const ventasDiarias = await prisma.$queryRaw`
                SELECT cast(fecha as date), SUM(total) AS total
                FROM (
                    SELECT DISTINCT cu.id_cuenta,
                    cu.fecha_cierre AS fecha,
                    cu.total
                    FROM "Cuenta" cu
                    INNER JOIN public."Mesa_atendida" AS ma
                            ON cu.id_mesa_atendida = ma.id_mesa_atendida
                    INNER JOIN public."Comanda" AS co
                            ON cu.id_cuenta = co.id_cuenta
                    INNER JOIN public."Mesa" AS m
                            ON ma.id_mesa = m.numero
                    WHERE
                    cu.fecha_cierre BETWEEN ${fechaInicioDate} AND ${fechaFinDate}
                    AND m.id_restaurante = ${parseInt(id_restaurante as string)} and co.id_estado_comanda != 5
                ) AS sub
                GROUP BY cast(fecha as date);
            `;
            res.json(ventasDiarias);
        } catch (error) {
            res.status(500).json({ error: "Error al obtener ventas diarias" });
        }
    },

    getVentasCategoria: async (req: Request, res: Response) => {
        const { fechaInicio, fechaFin, id_restaurante } = req.query;
        try {
            const fechaFinDate = new Date(fechaFin as string);
            const fechaInicioDate = new Date(fechaInicio as string);
            fechaInicioDate.setHours(0, 0, 0, 0);
            fechaFinDate.setHours(23, 59, 59, 999);

            const ventasCategoria = await prisma.$queryRaw`
                SELECT
                    c.nombre AS categoria,
                    COALESCE(SUM(dc.cantidad * dc.precio_unitario), 0) AS total,
                    COALESCE(CAST(SUM(dc.cantidad) AS NUMERIC), 0) AS cantidad
                FROM
                    public."Categoria" AS c
                    LEFT JOIN public."Menu" AS m ON c.id_categoria = m.id_categoria
                    LEFT JOIN public."Detalle_comanda" AS dc ON m.id_menu = dc.id_menu
                    LEFT JOIN public."Comanda" AS co ON dc.id_comanda = co.id_comanda
                    LEFT JOIN public."Cuenta" AS cu ON co.id_cuenta = cu.id_cuenta
                    LEFT JOIN public."Mesa_atendida" AS ma ON cu.id_mesa_atendida = ma.id_mesa_atendida
                    LEFT JOIN public."Mesa" AS me ON ma.id_mesa = me.numero
                WHERE
                    (cu.fecha_cierre BETWEEN ${fechaInicioDate} AND ${fechaFinDate} OR cu.fecha_cierre IS NULL)
                    AND (me.id_restaurante = ${parseInt(id_restaurante as string)} OR me.id_restaurante IS NULL)
                    AND (id_estado_comanda != 5 OR id_estado_comanda IS NULL)
                GROUP BY
                    c.nombre
                ORDER BY
                    total DESC;
            `;

            res.json(ventasCategoria);


        } catch (error) {
            res.status(500).json({ error: "Error al obtener ventas por categoría" });
        }
    },

    getProductosVendidos: async (req: Request, res: Response) => {
        const { fechaInicio, fechaFin, id_restaurante } = req.query;
        const fechaFinDate = new Date(fechaFin as string);
        const fechaInicioDate = new Date(fechaInicio as string);

        fechaInicioDate.setHours(0, 0, 0, 0);
        fechaFinDate.setHours(23, 59, 59, 999);

        try {
            const productosVendidos = await prisma.detalle_comanda.groupBy({
                by: ['id_menu'],
                where: {
                    Comanda: {
                        id_estado_comanda: {
                            not: 5
                        },
                        Cuenta: {
                            fecha_cierre: {
                                gte: fechaInicioDate,
                                lte: fechaFinDate
                            },
                            MesaAtendida: {
                                Mesa: {
                                    id_restaurante: parseInt(id_restaurante as string)
                                }
                            }
                        }
                    }
                },
                _sum: {
                    cantidad: true
                },
                orderBy: {
                    _count: {
                        cantidad: 'desc'
                    }
                }
            });

            const menuInfo = await prisma.menu.findMany({
                where: {
                    id_restaurante: parseInt(id_restaurante as string)
                },
                include: {
                    categoria: true
                }
            });

            const resultado = menuInfo.map(menu => {
                if (productosVendidos.find(producto => producto.id_menu === menu.id_menu)) {
                    const producto = productosVendidos.find(producto => producto.id_menu === menu.id_menu);
                    return {
                        descripcion: menu.descripcion,
                        categoria: menu.categoria.nombre,
                        cantidad: producto?._sum.cantidad,
                        precio: menu.precio
                    };
                } else {
                    return {
                        descripcion: menu.descripcion,
                        categoria: menu.categoria.nombre,
                        cantidad: 0,
                        precio: menu.precio
                    };
                }

            });

            res.json(resultado);

        } catch (error) {
            res.status(500).json({
                error
                    : "Error al obtener productos más vendidos"
            });
        }
    },

    getDesempenoMeseros: async (req: Request, res: Response) => {
        const { fechaInicio, fechaFin, id_restaurante } = req.query;

        try {
            const fechaFinDate = new Date(fechaFin as string);
            const fechaInicioDate = new Date(fechaInicio as string);

            fechaInicioDate.setHours(0, 0, 0, 0);
            fechaFinDate.setHours(23, 59, 59, 999);

            const meseroStats = await prisma.$queryRaw`
            SELECT
                m.id_mesero as id_mesero,
                p.nombre || ' ' || p.apellido as nombre,
                SUM(DISTINCT c.total) as ventas,
                cast(COUNT(DISTINCT c.id_cuenta) as NUMERIC) as cuentas
            FROM "Mesero" m
                INNER JOIN "Persona" p ON m.id_persona = p.id_persona
                INNER JOIN "Usuario" u ON u.id_persona = m.id_persona
                INNER JOIN "Mesa_atendida" ma ON m.id_mesero = ma.id_mesero
                INNER JOIN "Cuenta" c ON c.id_mesa_atendida = ma.id_mesa_atendida
                INNER JOIN "Comanda" c2 ON c2.id_cuenta = c.id_cuenta
            WHERE
            c.fecha_cierre BETWEEN ${fechaInicioDate} AND ${fechaFinDate}
            AND m.id_restaurante = ${parseInt(id_restaurante as string)}
            AND id_estado_comanda != 5 AND u.activo = true
            GROUP BY m.id_mesero, p.id_persona
            order By ventas DESC;
            `;

            res.json(meseroStats);
        } catch (error) {
            res.status(500).json({ error: error });
        }
    }
};