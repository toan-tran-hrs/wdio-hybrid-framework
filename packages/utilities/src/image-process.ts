import sharp from "sharp";

export async function cropImage(originalImage: Buffer, x: number, y: number, width: number, height: number) {
  return await sharp(originalImage)
    .extract({ width: width, height: height, left: x, top: y })
    .png()
    .toBuffer();
}
