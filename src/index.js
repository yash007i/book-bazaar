import express, { urlencoded } from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./db/index.js";

const app = express();
dotenv.config({
  path: "./.env",
});
app.use(express.json());
app.use(
  urlencoded({
    extended: true,
  })
);

app.use(
  cors({
    origin: `http://localhost:${process.env.FRONTEND_PORT}`,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hello Guys Welcome To CodeMind");
});

const PORT = process.env.PORT || 9012;
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on PORT : ${PORT}.`);
  });
});
