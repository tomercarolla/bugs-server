import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import path from "path";
import { authCtrl } from "./api/auth/index.js";
import { bugCtrl, userCtrl } from "./api/index.js";

const app = express();

const corsOptions = {
  origin: ["http://127.0.0.1:5173", "http://localhost:5173"],
  credentials: true,
};

// eslint-disable-next-line no-unused-vars
const port = process.env.PORT || 3030;

app.use(express.static("public"));
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use("/api/bug", bugCtrl);
app.use("/api/user", userCtrl);
app.use("/api/auth", authCtrl);

app.get("/**", (req, res) => {
  res.sendFile(path.resolve("public/index.html"));
});

app.listen(3030, () => console.info("Server is running on port 3030"));
