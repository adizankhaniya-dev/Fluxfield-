import express from "express";
import authrouter from "./routes/auth.routes";
const app = express();
app.use(express.json());

app.post("/auth", authrouter);
