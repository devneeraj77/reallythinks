import { NextResponse } from "next/server";
import { createCanvas } from "canvas";
import path from "path";
import fs from "fs";

// API Route to Generate Open Graph Image
export async function GET() {
  const canvas = createCanvas(1200, 630); // Open Graph image size (1200x630)
  const ctx = canvas.getContext("2d");

  // Set Background Color (Dark Greenish)
  ctx.fillStyle = "#3E6259";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Add Text to the Image
  ctx.fillStyle = "white";
  ctx.font = "bold 70px Arial";
  ctx.textAlign = "center";
  ctx.fillText("Send me", canvas.width / 2, 250);
  ctx.fillText("anonymous messages!", canvas.width / 2, 350);

  // Add Branding Text (Optional)
  ctx.font = "30px Arial";
  ctx.fillText(
    "ReallyThinks - Anonymous Q&A",
    canvas.width / 2,
    canvas.height - 100
  );

  // Save the image to /public folder
  const publicDir = path.resolve(process.cwd(), "public/");
  const imagePath = path.join(publicDir, "og.png");

  // Ensure /public folder exists, create it if it doesn't
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir);
  }

  // Write the image to the public folder as og.png
  const buffer = canvas.toBuffer("image/png");
  fs.writeFileSync(imagePath, buffer);

  // Return JSON Response (Optional)f
  return NextResponse.json({
    message: "OG image created successfully",
    imagePath: "/og.png",
  });
}
