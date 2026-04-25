import { Router } from "express";
import authJwt from "../../middlewears/authJwt.js";
import usersController from "./users_controller.js";

const router = Router();

router.post("/login", usersController.userLogin);
router.post("/register", usersController.userRegister);
router.get("/info", authJwt.verifyAnyToken, usersController.getUserInfo);

export default router;