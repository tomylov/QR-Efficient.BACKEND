import { Router } from "express";
import cuentaController from "../../controllers/cuenta";

const router = Router();
router.put('/:id', cuentaController.closeCuenta);

export default router;