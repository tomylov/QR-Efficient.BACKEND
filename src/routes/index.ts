import { Router } from "express";
import restaurante from "./Restaurante/Restaurante";


const router = Router();
router.use('/restaurante', restaurante);

export default router;