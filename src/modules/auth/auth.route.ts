import { Router } from "express";
import { authController } from "./auth.controller";
// import { authController } from "./auth.controller";

const router = Router();

router.post("/login", authController.LoginControllerFunction)
export const authRoute = router;
