import { Router } from "express";
import { authController } from "./auth.controller";

const router = Router();

router.post("/login", authController.LoginControllerFunction)
router.post("/signup", authController.SignupControllerFunction)
export const authRoute = router;
