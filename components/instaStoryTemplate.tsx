"use client";

import { useEffect, useRef, useState } from "react";

interface InstaStoryShareProps {
  message: string;
  username: string;
}

export default function InstaStoryTemplate({ message, username }: InstaStoryShareProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size to Instagram Story format (1080x1920)
    canvas.width = 1080;
    canvas.height = 1920;

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, "#ff7eb3");
    gradient.addColorStop(1, "#ff758c");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw anonymous message box
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
    ctx.roundRect(100, 500, 880, 500, 40);
    ctx.fill();

    // Draw text message inside the box
    ctx.fillStyle = "#333";
    ctx.font = "bold 48px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const wrappedText = wrapText(ctx, message, 540, 580, 800, 60);
    wrappedText.forEach((line, i) => ctx.fillText(line, 800, 580 + i * 70));
    
    // Draw username below the message
    ctx.fillStyle = "#777";
    ctx.font = "bold 36px Arial";
    ctx.fillText(`- @${username}`, 540, 1100);

    // Draw reply sticker button
    ctx.fillStyle = "#ff5e99";
    ctx.roundRect(320, 1250, 440, 120, 50);
    ctx.fill();

    ctx.fillStyle = "#fff";
    ctx.font = "bold 42px Arial";
    ctx.fillText("Reply Anonymously", 540, 1310);

    // Convert canvas to image URL
    setImageUrl(canvas.toDataURL("image/png"));
  }, [message, username]);

  // Function to wrap text inside a box
  function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
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

  // Function to share story on Instagram
  const shareToInstagram = () => {
    if (!imageUrl) return;
    const blob = dataURItoBlob(imageUrl);
    const file = new File([blob], "story.png", { type: "image/png" });
    const data = new FormData();
    data.append("file", file);

    const url = "https://www.instagram.com/create/story/";
    const a = document.createElement("a");
    a.href = URL.createObjectURL(file);
    a.download = "story.png";
    a.click();

    setTimeout(() => {
      window.open(url, "_blank");
    }, 500);
  };

  // Convert Data URI to Blob
  function dataURItoBlob(dataURI: string) {
    const byteString = atob(dataURI.split(",")[1]);
    const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <canvas ref={canvasRef} className="hidden"></canvas>
      {imageUrl && <img src={imageUrl} alt="Instagram Story Preview" className="w-80 rounded-lg shadow-lg" />}
      <button
        onClick={shareToInstagram}
        className="bg-pink-500 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-pink-600 transition"
      >
        Share to Instagram Story
      </button>
    </div>
  );
}
