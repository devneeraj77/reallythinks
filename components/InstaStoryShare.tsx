"use client";

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

    // Set canvas size
    canvas.width = 1080;
    canvas.height = 1920;

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, "#ff7eb3");
    gradient.addColorStop(1, "#ff758c");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Message text
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 60px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Someone thinks about you!", canvas.width / 2, 400);

    ctx.font = "italic 50px Arial";
    ctx.fillText(`"${message}"`, canvas.width / 2, 600);

    ctx.font = "bold 40px Arial";
    ctx.fillText(`@${username}`, canvas.width / 2, 800);

    // Branding text
    ctx.font = "30px Arial";
    ctx.fillText("Reply anonymously on reallythinks.vercel.app", canvas.width / 2, 1200);

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
        <img src={imageUrl} alt="Instagram Story Preview" className="mt-4 rounded-lg shadow-lg w-60" />
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
