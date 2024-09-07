import { Router } from "express";
import personaController from "../../controllers/persona";
import validatePersonaData from "../../middlewares/persona";

const router = Router();
router.get('/', personaController.getPersonas);
router.get('/:id', personaController.getPersonaId);
router.post('/', validatePersonaData, personaController.createPersona);
router.put('/:id', personaController.updatePersona);

export default router;