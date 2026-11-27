import { Router } from "express";
import { USER_ROLE } from "../../utils/type";
import { auth } from "../../middleware/auth";
import { bookingsController } from "./booking.controller";

const router = Router();

router.post("/", auth("",USER_ROLE.organizer, USER_ROLE.attendee), bookingsController.BookingCreateControllerFunction)
router.get("/", auth("",USER_ROLE.organizer, USER_ROLE.attendee), bookingsController.BookingsGetControllerFunction)
router.get("/:id/cancel", auth("",USER_ROLE.organizer, USER_ROLE.attendee), bookingsController.BookingCancelControllerFunction)
export const bookingRoute = router;
