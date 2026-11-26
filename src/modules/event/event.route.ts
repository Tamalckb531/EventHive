import { Router } from "express";
import { eventController } from "./event.controller";

const router = Router();

router.post("/", eventController.EventCreateControllerFunction)
export const authRoute = router;
