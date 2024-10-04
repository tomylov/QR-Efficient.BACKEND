import { Router } from "express";
import loginController from "../../controllers/login";
import loginValidator from "../../middlewares/login";



const router = Router();
router.post('/', loginValidator, loginController.loginUsuarios);

export default router;