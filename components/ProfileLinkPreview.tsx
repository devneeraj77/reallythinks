"use client";

import { IconLink, IconScreenshot } from "@tabler/icons-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

interface ProfileLinkPreviewProps {
    username: string;
    profileImage: string;
}

export default function ProfileLinkPreview({
    username,
    profileImage,
}: ProfileLinkPreviewProps) {
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

        // // Draw sticker-style link box
        // const ProfileBoxWidth = 400;
        // const ProfileBoxHeight = 400;
        // const ProfileBoxX = canvas.width / 2 - ProfileBoxWidth / 2;
        // const ProfileBoxY = 600;

        // ctx.fillStyle = "white";
        // ctx.fillText(`Link Sticker`, canvas.width / 2, ProfileBoxY + ProfileBoxHeight / 2);
        // ctx.fillStyle = "#397790";
        // ctx.fill();
        // ctx.roundRect(ProfileBoxX, ProfileBoxY, ProfileBoxWidth, ProfileBoxHeight, 300);




        // Link Sticker Box Properties
        const LinkBoxWidth = 500;
        const LinkBoxHeight = 180;
        const LinkBoxX = canvas.width / 2 - LinkBoxWidth / 2;
        const LinkBoxY = 1300;

        // "Link sticker" Text
        ctx.fillStyle = "white";
        ctx.roundRect(LinkBoxX, LinkBoxY, LinkBoxWidth, LinkBoxHeight, 50);
        ctx.fill();
        ctx.font = "bold 50px Arial";
        ctx.fillStyle = "#397790";
        ctx.textAlign = "center"; // Center text
        // ctx.textBaseline = "middle"; // Align vertically in the middle
        ctx.fillText(`Paste your`, canvas.width / 2, LinkBoxY + LinkBoxHeight / 2);
        ctx.fillText(`Link Sticker`, canvas.width / 2, LinkBoxY + LinkBoxHeight / 2 + 50);

        // Branding text
        ctx.font = "30px Arial";
        ctx.fillStyle = "#ffffff";
        ctx.fillText("ReallyThinks - Anonymous Q&A", canvas.width / 2, canvas.height - 100);


        // Convert canvas to image URL
        setImageUrl(canvas.toDataURL("image/png"));
    }, [username, profileImage]);

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
            <h2 className="text-lg font-semibold  flex gap-2 justiy-center align-center"><IconScreenshot /> Share on Instagram Story</h2>

            <canvas ref={canvasRef} className="hidden" />


            {imageUrl && (
                <Image src={imageUrl} height={200} width={200} alt="Instagram Story Preview" className="mt-4 rounded-lg shadow-lg w-60" />
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
