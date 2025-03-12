"use client";
import React from "react";
import { Spotlight } from "@/components/ui/spotlight-new";
import { Chip } from "@heroui/chip";
import { Button } from "@heroui/button";

export function SpotlightNewDemo() {
  return (
    <div className="h-[40rem] w-full  flex md:items-center md:justify-center bg-[#212922] antialiased bg-grid-white/[0.02] relative overflow-hidden">
      <Spotlight />
      <div className=" p-4 max-w-7xl  mx-auto relative  w-full pt-20 md:pt-0">
        <h1 className="text-4xl md:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50">
          Stay Anonymous! <br /> Express Freely, make an impact.
          {/* Anonymous <br /> Speak your mind, stay anonymous, make an impact. */}
        </h1>
        <p className="mt-4 font-normal text-base text-neutral-300 max-w-4xl text-center mx-auto">
          Ever had a thought too weird to say out loud? A secret itching to
          escape? Welcome to reallythinks, where you send messages into the
          abyss—no names, no faces, just raw, unfiltered words. Will they be
          read? Will they be ignored? That&apos;s the mystery. That&apos;s the
          thrill.
        </p>
        {/* <div className="max-w-full text-center my-10 py-6">
          <Button variant="flat" color="success" className="">
            hello
          </Button>
        </div> */}
      </div>
    </div>
  );
}
