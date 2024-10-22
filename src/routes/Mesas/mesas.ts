import { Router } from "express";
import meseroController from "../../controllers/mesa";
import { validarActualizacionMesero, validarCreacionMesero } from "../../middlewares/mesero";

const router = Router();
router.get('/restaurante/:id', meseroController.getMesasRestaurante);

export default router;