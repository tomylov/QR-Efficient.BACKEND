import { Router } from "express";
import auditoriaController from "../../controllers/auditoria";

const router = Router();
router.get('/menu', auditoriaController.getAuditorias);

export default router;