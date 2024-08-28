import { Router } from "express";
import restaurante from "./Restaurante/restaurante";
import menu from "./Menu/menu";


const router = Router();
router.use('/restaurante', restaurante);
router.use('/menu', menu);

export default router;