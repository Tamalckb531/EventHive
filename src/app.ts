import express, { type Application, type Request, type Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import globalErrorHandler from "./middleware/globalErrorHandler";
import { authRoute } from "./modules/auth/auth.route";
import { eventRoute } from "./modules/event/event.route";
import { bookingRoute } from "./modules/booking/booking.route";
const app: Application = express();

const corsOptions = {
  origin: ["www.rankdevs.com"],
  optionsSuccessStatus: 200,
};

//? Abstract middlewares
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

//? routes
app.use("/api/v1/auth", authRoute)
app.use("/api/v1/events", eventRoute)
app.use("/api/v1/bookings", bookingRoute)

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Server is running fine :)",
    author: "Tamal",
  });
});

// Global Error Handler
app.use(globalErrorHandler);

export default app;