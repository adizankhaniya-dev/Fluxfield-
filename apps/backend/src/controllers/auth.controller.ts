import type { Request, Response } from "express";

import { CreateUserSchema } from "@repo/types";
import { HttpStatus } from "../../utils/statusCode.js";

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

    
  } catch (error) {}
};

export const signin = async (req: Request, res: Response) => {};
