import { InferenceClient } from "@huggingface/inference";
import path from "node:path";
import { mkdir } from "node:fs/promises";

const hf = new InferenceClient(Bun.env.HF_TOKEN);

const MODEL = "black-forest-labs/FLUX.1-Kontext-dev";

const prompts = {
  front: `
    Create a FRONT-FACING portrait of the exact same person
    shown in the reference image.

    Preserve the person's identity, facial structure,
    hairstyle, hair color, skin tone, age and clothing.

    Face directly toward the camera.
    Show a clear front view.
    Neutral expression.
    Plain background.
    Photorealistic.

    Do not change the person's identity.
    Do not add accessories.
  `,

  left: `
    Create a LEFT SIDE PROFILE of the exact same person
    shown in the reference image.

    Preserve the person's identity, facial structure,
    hairstyle, hair color, skin tone, age and clothing.

    Rotate the person's head approximately 90 degrees
    to the LEFT.

    Show a clear left-side profile.
    Neutral expression.
    Plain background.
    Photorealistic.

    Do not change the person's identity.
    Do not add accessories.
  `,

  right: `
    Create a RIGHT SIDE PROFILE of the exact same person
    shown in the reference image.

    Preserve the person's identity, facial structure,
    hairstyle, hair color, skin tone, age and clothing.

    Rotate the person's head approximately 90 degrees
    to the RIGHT.

    Show a clear right-side profile.
    Neutral expression.
    Plain background.
    Photorealistic.

    Do not change the person's identity.
    Do not add accessories.
  `,
};

const generateImage = async (image: Blob, prompt: string): Promise<Blob> => {
  return hf.imageToImage({
    model: MODEL,
    inputs: image,
    parameters: { prompt },
  });
};

const saveImage = async (blob: Blob, filePath: string) => {
  const buffer = await blob.arrayBuffer();

  await Bun.write(filePath, buffer);
};

export const generateAvatarProfiles = async (image: Blob) => {
  const avatarId = crypto.randomUUID();

  // generated/avatars/<avatarId>
  const avatarDirectory = path.join(
    process.cwd(),
    "generated",
    "avatars",
    avatarId,
  );

  // Create directory
  await mkdir(avatarDirectory, {
    recursive: true,
  });

  console.log("Generating avatar:", avatarId);

  // Generate images
  const [front, left, right] = await Promise.all([
    generateImage(image, prompts.front),
    generateImage(image, prompts.left),
    generateImage(image, prompts.right),
  ]);

  // File paths
  const frontPath = path.join(avatarDirectory, "front.png");

  const leftPath = path.join(avatarDirectory, "left.png");

  const rightPath = path.join(avatarDirectory, "right.png");

  // Save images
  await Promise.all([
    saveImage(front, frontPath),
    saveImage(left, leftPath),
    saveImage(right, rightPath),
  ]);

  console.log("Avatar generated:", avatarId);

  return {
    avatarId,

    files: {
      front: `/generated/avatars/${avatarId}/front.png`,
      left: `/generated/avatars/${avatarId}/left.png`,
      right: `/generated/avatars/${avatarId}/right.png`,
    },
  };
};
