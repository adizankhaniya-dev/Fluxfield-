import type { Request, Response } from "express";

import { CreateUserSchema, SigninSchema } from "@repo/types";
import { CreateUser, findById, getuserByEmail } from "@repo/db";
import { HttpStatus } from "../../utils/statusCode.js";
import { hashPassword, verifyPassword } from "../../utils/bcrypt.js";
import { genrateToken } from "../../utils/jwt.js";

export const signup = async (req: Request, res: Response) => {
  const parseData = CreateUserSchema.safeParse(req.body);
  try {
    if (!parseData.success) {
      res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        error: parseData.error.issues.map((issue) => ({
          field: issue.path.length > 0 ? issue.path.join(".") : "body",
          message: issue.message,
        })),
      });
      return;
    }

    const { email, password, name } = parseData.data;

    const userExist = await getuserByEmail(email);

    if (userExist) {
      res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        error: "Username is Already Exists",
      });
      return;
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await CreateUser(email, hashedPassword, name);

    const token = await genrateToken(newUser.id);
    res.status(HttpStatus.CREATED).json({
      success: true,
      message: "User is Created Successfully",
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        token: token,
      },
    });
  } catch (error) {
    console.error("Signup Error:", error);
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ success: false, error: "Internal server error" });
    return;
  }
};

export const signin = async (req: Request, res: Response) => {
  const parseData = SigninSchema.safeParse(req.body);
  try {
    if (!parseData.success) {
      res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        error: parseData.error.issues.map((issue) => {
          filed: issue.path.length > 0 ? issue.path.join(".") : "body";
          message: issue.message;
        }),
      });
      return;
    }

    const { email, password } = parseData.data;

    const user = await getuserByEmail(email);

    if (!user) {
      res.status(HttpStatus.UNAUTHORIZED).json({
        success: false,
        error: "Invalid email or password",
      });
      return;
    }

    const isPasswordValid = await verifyPassword(password, user.password);

    if (!isPasswordValid) {
      res.status(HttpStatus.UNAUTHORIZED).json({
        success: false,
        error: "Invalid email or password",
      });
      return;
    }

    const token = genrateToken(user.id);

    res.status(HttpStatus.OK).json({
      success: true,
      message: "User logged in successfully",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        token: token,
      },
    });
  } catch (error) {
    console.error("Signin Error:", error);
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ success: false, error: "Internal server error" });
    return;
  }
};
