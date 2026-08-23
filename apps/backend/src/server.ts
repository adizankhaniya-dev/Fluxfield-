import express from "express";
import authrouter from "./routes/auth.routes";
import avatarrouter from "./routes/avatar.routes";
import { PORT } from "./config/env";
const app = express();
app.use(express.json());

app.use("/auth", authrouter);
app.use("/api", avatarrouter);

app.listen(PORT, () => {
  console.log(`[Server] is running on: http://localhost:${PORT}`);
});
