"use client";

import { IconScreenshot } from "@tabler/icons-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

interface InstaStoryShareProps {
  message: string;
  username: string;
}

export default function InstaStoryShare({
  message,
  username,
}: InstaStoryShareProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size (Instagram Story size)
    canvas.width = 1080;
    canvas.height = 1920;

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, "#3E6259");
    gradient.addColorStop(1, "#212922");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Title text
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 60px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Someone thinks about you!", canvas.width / 2, 400);

    // Message Box Properties
    const boxX = 100;
    const boxY = 500;
    const boxWidth = 880;
    const maxTextWidth = 780; // Keep text inside the box
    let boxHeight = 200; // Default height, adjusted based on text

    // Function to wrap text inside the message box
    function wrapText(
      ctx: CanvasRenderingContext2D,
      text: string,
      maxWidth: number,
      lineHeight: number
    ) {
      const words = text.split(" ");
      let line = "";
      const lines: string[] = [];

      words.forEach((word) => {
        const testLine = line + word + " ";
        const testWidth = ctx.measureText(testLine).width;
        if (testWidth > maxWidth && line !== "") {
          lines.push(line);
          line = word + " ";
        } else {
          line = testLine;
        }
      });

      lines.push(line);
      return lines;
    }

    const wrappedText = wrapText(ctx, message, maxTextWidth, 70);
    boxHeight = Math.max(400, wrappedText.length * 80 + 80); // Adjust box height based on text lines

    // Center the message vertically
    const textStartY = boxY + (boxHeight - wrappedText.length * 70) / 2 + 40;

    // Draw anonymous message box with adjusted height
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
    ctx.roundRect(boxX, boxY, boxWidth, boxHeight, 40);
    ctx.fill();

    // Message text inside the box (centered)
    ctx.font = "50px Arial";
    ctx.fillStyle = "#242424";
    wrappedText.forEach((line, i) => {
      ctx.fillText(line, canvas.width / 2, textStartY + i * 70);
    });

    // Branding text
    ctx.font = "30px Arial";
    ctx.fillStyle = "#ffffff";
    ctx.fillText("Reply anonymously", canvas.width / 2, boxY + boxHeight + 100);

    // Generate image URL and set it
    const finalImageUrl = canvas.toDataURL("image/png");
    setImageUrl(finalImageUrl);
  }, [message, username]);

  const handleShareAndDownload = () => {
    if (!imageUrl) return;

    // Open Instagram Story creation page
    const instaUrl = "https://www.instagram.com/create/story/";
    window.open(instaUrl, "_blank");

    // Download Image Automatically with username in filename
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = `insta-story-${username}.png`;
    link.click();
  };

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <h2 className="text-lg font-semibold flex gap-2 justiy-center align-center">
        {" "}
        <IconScreenshot /> Share on Instagram Story
      </h2>

      <canvas ref={canvasRef} className="hidden" />

      {imageUrl && (
        <Image
          src={imageUrl}
          height={500}
          width={200}
          alt={`Instagram Story Preview for ${username}`}
          className="mt-4 rounded-lg shadow-lg w-60"
        />
      )}

      {/* Single button to share & download */}
      {imageUrl && (
        <button
          onClick={handleShareAndDownload}
          className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition"
        >
          Share & Download Story
        </button>
      )}
    </div>
  );
}
