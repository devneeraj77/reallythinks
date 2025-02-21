"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image"; // Import Next.js Image component

interface InstaStoryTemplateProps {
  username: string;
  profileImage?: string; // Make optional
}

export default function InstaStoryTemplate({
  username,
  profileImage,
}: InstaStoryTemplateProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Default avatar if profileImage is missing

  const finalProfileImage = profileImage ;

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
    gradient.addColorStop(0, "#000000");
    gradient.addColorStop(1, "#3C6E71");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // "Send me anonymous messages!" text
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 70px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Send me", canvas.width / 2, 400);
    ctx.fillText("anonymous messages!", canvas.width / 2, 480);

    // Draw sticker-style link box
    const linkBoxWidth = 250;
    const linkBoxHeight = 250;
    const linkBoxX = canvas.width / 2 - linkBoxWidth / 2;
    const linkBoxY = 500;

    ctx.fillStyle = "white";
    ctx.roundRect(linkBoxX, linkBoxY, linkBoxWidth, linkBoxHeight, 250);
    ctx.fill();

    // Link text
    ctx.font = "bold 50px Arial";
    ctx.fillStyle = "#000000";
    ctx.fillText(`🔗 reallythinks.vercel.app/@${username}`, canvas.width / 2, linkBoxY + 75);

    // Draw arrows pointing to link
    const arrowY = linkBoxY + 150;
    ctx.font = "bold 80px Arial";
    ctx.fillText("⬆️ ⬆️ ⬆️", canvas.width / 2, arrowY);

    // Branding text
    ctx.font = "30px Arial";
    ctx.fillStyle = "#ffffff";
    ctx.fillText("ReallyThinks - Anonymous Q&A", canvas.width / 2, canvas.height - 100);

    // Convert canvas to image URL
    setImageUrl(canvas.toDataURL("image/png"));
  }, [username]);

  const handleDownload = () => {
    if (!imageUrl) return;
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = `insta-story-${username}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <h2 className="text-lg font-semibold">📸 Share on Instagram Story</h2>

      <canvas ref={canvasRef} className="hidden" />
      {/* Instagram Story Preview */}
      {imageUrl && (
        <Image
          src={imageUrl}
          alt="Instagram Story Preview"
          width={240}
          height={320}
          className="mt-4 rounded-lg shadow-lg"
        />
      )}

      <div className="mt-4 flex gap-4">
        <button
          onClick={() => imageUrl && window.open(imageUrl, "_blank")}
          className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition"
        >
          Open Image
        </button>
        <button
          onClick={handleDownload}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Download Image
        </button>
      </div>
    </div>
  );
}
