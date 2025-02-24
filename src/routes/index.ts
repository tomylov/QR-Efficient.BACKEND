import { Router } from "express";
import restaurante from "./Restaurante/restaurante";
import menu from "./Menu/menu";
import categoria from "./Categoria/categoria";
import persona from "./Persona/persona";
import mesero from "./Mesero/mesero";
import cliente from "./Cliente/cliente";
import login from "./Login/login";
import mesas from "./Mesas/mesas";
import comandas from "./Comanda/comanda";
import cuenta from "./Cuenta/Cuenta";
import reporte from "./Reporte/Reporte";
import auditoria from "./Auditoria/auditoria";

const router = Router();
router.use('/restaurante', restaurante);
router.use('/menu', menu);
router.use("/categoria", categoria);
router.use("/persona", persona);
router.use("/mesero", mesero);
router.use("/cliente", cliente);
router.use("/login", login);
router.use("/mesas", mesas);
router.use("/comanda", comandas);
router.use("/cuenta", cuenta);
router.use("/reporte", reporte);
router.use("/auditoria", auditoria);

export default router;