import { Router } from "express";
import meseroController from "../../controllers/mesero";
import { validarActualizacionMesero, validarCreacionMesero } from "../../middlewares/mesero";

const router = Router();
router.get('/restaurante/:id', meseroController.getMeserosRestaurante);
router.get('/:id', meseroController.getMeseroId);
router.post('/', validarCreacionMesero, meseroController.createmesero);
router.put('/:id', validarActualizacionMesero, meseroController.updatemesero);

export default router;