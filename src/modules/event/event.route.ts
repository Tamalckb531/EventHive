import { Router } from "express";
import { eventController } from "./event.controller";
import { USER_ROLE } from "../../utils/type";
import { auth } from "../../middleware/auth";

const router = Router();

router.post("/", auth("caller is not an organizer",USER_ROLE.organizer), eventController.EventCreateControllerFunction)
router.get("/", eventController.EventGetControllerFunction)
router.get("/:id", eventController.EventGetOneControllerFunction)
router.patch("/:id", auth("",USER_ROLE.organizer), eventController.EventUpdateControllerFunction)
export const eventRoute = router;
