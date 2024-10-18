import { Router } from "express";
import menuController from "../../controllers/menu";
import validateMenu from "../../middlewares/menu";



const router = Router();
router.get('/restaurante/:id', menuController.getMenusRestaurante);
router.get('/:id', menuController.getMenuId);
router.post('/', validateMenu, menuController.createMenu);
router.put('/:id', validateMenu, menuController.updateMenu);
router.delete('/:id', menuController.deleteMenu);

export default router;