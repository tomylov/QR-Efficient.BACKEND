import { Router } from "express";
import restaurante from "./Restaurante/restaurante";
import menu from "./Menu/menu";
import categoria from "./Categoria/categoria";
import persona from "./Persona/persona";


const router = Router();
router.use('/restaurante', restaurante);
router.use('/menu', menu);
router.use("/categoria", categoria);
router.use("/persona",persona);

export default router;