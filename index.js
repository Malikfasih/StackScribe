import express from "express";
import authRouter from "./routes/auth.js";
import postRouter from "./routes/post.js";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.listen(8000, () => {
  console.log("Application is connected!");
});

app.use("/user", authRouter);
app.use("/posts", postRouter);
