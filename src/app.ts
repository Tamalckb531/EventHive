import express, { type Application, type Request, type Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app: Application = express();

const corsOptions = {
  origin: ["www.rankdevs.com"],
  optionsSuccessStatus: 200,
};

//? Abstract middlewares
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Server is running fine :)",
    author: "Tamal",
  });
});

export default app;