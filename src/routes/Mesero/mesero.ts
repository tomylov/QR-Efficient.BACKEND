import { Router } from "express";
import meseroController from "../../controllers/mesero";
import { validarActualizacionMesero, validarCreacionMesero } from "../../middlewares/mesero";

const router = Router();
router.get('/restaurante/:id', meseroController.getMeserosRestaurante);
router.get('/grupos', meseroController.getGrupos);
router.get('/:id', meseroController.getMeseroId);
router.post('/', validarCreacionMesero, meseroController.createmesero);
router.put('/:id', validarActualizacionMesero, meseroController.updatemesero);
router.delete('/:id', meseroController.deleteMesero);

export default router;