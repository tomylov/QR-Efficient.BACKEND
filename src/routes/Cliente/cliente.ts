import { Router } from "express";
import clienteController from "../../controllers/cliente";
import { validarCreateCliente, validarUpdateCliente } from "../../middlewares/cliente";

const router = Router();
router.get('/:id', clienteController.getClienteId);
router.post('/', validarCreateCliente, clienteController.createCliente);
router.put('/:id', validarUpdateCliente, clienteController.updateCliente);

export default router;