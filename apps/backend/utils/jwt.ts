import jwt from "jsonwebtoken";
import { JWT_SECRAT } from "../src/config/env";

export const genrateToken = (id: string) => {
  return jwt.sign(
    {
      id: id,
    },
    JWT_SECRAT as string,
  );
};

export const verifyToken = (token: string) => {

}