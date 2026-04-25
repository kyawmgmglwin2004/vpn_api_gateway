import { Router } from "express";
import users from "./features/users/users_route.js";

const router = Router();

router.use("/users", users);


export default router;