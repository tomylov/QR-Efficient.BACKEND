import { Router } from "express";
import meseroController from "../../controllers/mesa";
import { validarActualizacionMesero, validarCreacionMesero } from "../../middlewares/mesero";

const router = Router();
router.get('/restaurante/:id', meseroController.getMesasRestaurante);
router.post('/', meseroController.createMesaAtendida);
router.put('/:id', meseroController.updateMesaAtendida);

export default router;