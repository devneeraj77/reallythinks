"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

interface InstaStoryShareProps {
  message: string;
  username: string;
}

export default function InstaStoryShare({ message, username }: InstaStoryShareProps) {
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
    gradient.addColorStop(0, "#3C6E71");
    gradient.addColorStop(1, "#284B63");

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
    function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, lineHeight: number) {
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
    ctx.font = "italic 50px Arial";
    ctx.fillStyle = "#242424";
    wrappedText.forEach((line, i) => {
      ctx.fillText(line, canvas.width / 2, textStartY + i * 70);
    });

    // Branding text
    ctx.font = "30px Arial";
    ctx.fillStyle = "#ffffff";
    ctx.fillText("Reply anonymously", canvas.width / 2, boxY + boxHeight + 100);

    // Convert canvas to image URL
    setImageUrl(canvas.toDataURL("image/png"));
  }, [message, username]);

  const handleShare = () => {
    if (!imageUrl) return;

    // Convert Image URL to Blob
    fetch(imageUrl)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], "insta-story.png", { type: "image/png" });
        const data = new FormData();
        data.append("file", file);

        // Open Instagram Story with the image
        const instaUrl = "https://www.instagram.com/create/story/";
        const link = document.createElement("a");
        link.href = instaUrl;
        link.target = "_blank";
        link.click();
      })
      .catch((err) => console.error("Error creating image blob:", err));
  };

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <h2 className="text-lg font-semibold">📸 Share on Instagram Story</h2>

      <canvas ref={canvasRef} className="hidden" />

      {imageUrl && (
        <Image src={imageUrl} alt="Instagram Story Preview" className="mt-4 rounded-lg shadow-lg w-60" />
      )}

      <button
        onClick={handleShare}
        className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition"
      >
        Share on Instagram Story
      </button>
    </div>
  );
}
