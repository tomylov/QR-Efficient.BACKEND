// routes/dashboard.routes.ts
import { Router } from 'express';
import { dashboardController } from '../../controllers/reporteIngresos';
const router = Router();

router.get('/metricas', dashboardController.getMetricas);
router.get('/ventas-diarias', dashboardController.getVentasDiarias);
router.get('/ventas-categoria', dashboardController.getVentasCategoria);
router.get('/productos-vendidos', dashboardController.getProductosVendidos);
router.get('/desempeno-meseros', dashboardController.getDesempenoMeseros);

export default router;