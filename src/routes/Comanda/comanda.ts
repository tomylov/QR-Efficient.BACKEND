import { Router } from "express";
import comandaController from "../../controllers/comanda";

const router = Router();
router.get('/mesa/:id', comandaController.getComandasMesa);
router.get('/mesa/detalle/:id', comandaController.getComandasDetalleCuenta);
router.post('/', comandaController.createComanda);
router.put('/:id', comandaController.updateComanda);
router.delete('/:id', comandaController.deleteComanda);

export default router;