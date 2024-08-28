import { Router } from "express";
import restauranteController from "../../controllers/restaurante";
import validateRestaurante from "../../middlewares/restaurante";



const router = Router();
router.get('/', restauranteController.getRestaurantes);
router.get('/:id', restauranteController.getRestaurantesId);
router.post('/', validateRestaurante, restauranteController.createRestaurante);
router.put('/:id', restauranteController.updateRestaurante);

export default router;