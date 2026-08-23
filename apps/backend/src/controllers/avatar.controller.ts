import { CreateAvatarSchema } from "@repo/types";
import type { Request, Response } from "express";

import { HttpStatus } from "../../utils/statusCode";
import { generateAvatarProfiles } from "../services/imageGeneration.service";

export const avatar = async (req: Request, res: Response) => {
  try {
    const parsedata = CreateAvatarSchema.safeParse(req.body);

    // Validate request
    if (!parsedata.success) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: "Invalid avatar data",
        errors: parsedata.error.issues.map((issue) => ({
          field: issue.path.length
            ? issue.path.join(".")
            : "body",
          message: issue.message,
        })),
      });
    }

    const { name, imageUrl } = parsedata.data;

    // Download original image
    const imageResponse = await fetch(imageUrl);

    if (!imageResponse.ok) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: "Unable to download image from the provided URL",
      });
    }

    // IMPORTANT:
    // Read response only once
    const imageBlob = await imageResponse.blob();

    console.log("Image type:", imageBlob.type);
    console.log("Image size:", imageBlob.size);

    // Generate front, left and right profiles
    const profiles = await generateAvatarProfiles(imageBlob);

    return res.status(HttpStatus.OK).json({
      success: true,

      avatar: {
        name,
        originalImage: imageUrl,
        profiles,
      },
    });
  } catch (error) {
    console.error("Avatar generation error:", error);

    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to generate avatar",
      error: error instanceof Error
        ? error.message
        : String(error),
    });
  }
};