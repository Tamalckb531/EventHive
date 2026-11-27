import { Router } from "express";
import { USER_ROLE } from "../../utils/type";
import { auth } from "../../middleware/auth";

const router = Router();

router.post("/", auth("caller is not an organizer",USER_ROLE.organizer), bookingController.BookingCreateControllerFunction)
export const bookingRoute = router;
