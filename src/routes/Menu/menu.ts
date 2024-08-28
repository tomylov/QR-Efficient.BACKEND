import { Router } from "express";
import menuController from "../../controllers/menu";
import validateMenu from "../../middlewares/menu";



const router = Router();
router.get('/', menuController.getMenus);
router.get('/:id', menuController.getMenuId);
router.post('/', validateMenu, menuController.createMenu);
router.put('/:id', menuController.updateMenu);
router.delete('/:id', menuController.deleteMenu);

export default router;