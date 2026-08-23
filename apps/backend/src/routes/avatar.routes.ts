import express from "express";
import { avatar } from "../controllers/avatar.controller";

const route = express.Router();

route.post("/avatar", avatar);

export default route;
