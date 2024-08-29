import { Router } from "express";
import validateCategoria from "../../middlewares/categoria";
import categoriaController from "../../controllers/categoria";



const router = Router();
router.get('/', categoriaController.getCategorias);
router.get('/:id', categoriaController.getCategoriaId);
router.post('/', validateCategoria, categoriaController.createCategoria);
router.put('/:id', categoriaController.updateCategoria);

export default router;