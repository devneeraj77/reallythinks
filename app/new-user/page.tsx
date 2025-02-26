"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { UserSignupSchema } from "@/lib/schemas/userSchema";
import Link from "next/link";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";

export default function SignUpPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const errors: any[] = [];

  if (password.length < 4) {
    errors.push("Password must be 4 characters or more.");
  }
  if ((password.match(/[A-Z]/g) || []).length < 1) {
    errors.push("Password must include at least 1 upper case letter");
  }
  if ((password.match(/[^a-z]/gi) || []).length < 1) {
    errors.push("Password must include at least 1 symbol.");
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");

    try {
      // Validate user input using Zod schema before sending to the server
      UserSignupSchema.parse({ username, email, password, name });

      const response = await fetch("/auth/new-user", {
        method: "POST",
        body: JSON.stringify({ username, email, password, name }),
      });

      if (response.ok) {
        router.push("/signin");
      } else {
        setError("User already exists or invalid input");
      }
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        setError(validationError.errors.map((err) => err.message).join(", "));
      }
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm border-1">
        <h2 className="text-2xl font-semibold mb-4 text-[#5B8266]">Sign Up</h2>
        {error && <p className="text-red-500 text-xs mb-4">{error}</p>}
        <form
          onSubmit={onSubmit}
          className="space-y-4 flex flex-col gap-2 max-w-md"
        >
          <div>
            <Input
              isRequired
              label="Name"
              value={name}
              onValueChange={setName}
              labelPlacement="outside"
              name="name"
              type="text"
              placeholder="Enter your name"
              errorMessage={error && !name ? "Please enter your name" : ""}
              classNames={{ input: "border-[#3E6259]" }}
            />
          </div>

          <div>
            <Input
              isRequired
              label="Username"
              value={username}
              onValueChange={setUsername}
              labelPlacement="outside"
              name="username"
              type="text"
              placeholder="Enter your username"
              errorMessage={error && !username ? "Please enter a username" : ""}
              classNames={{ input: "border-[#3E6259]" }}
            />
          </div>

          <div>
            <Input
              isRequired
              errorMessage={({ validationDetails }) => {
                if (validationDetails.valueMissing) {
                  return "Please enter your email";
                }
                if (validationDetails.typeMismatch) {
                  return "Please enter a valid email address";
                }
              }}
              label="Email"
              value={email}
              onValueChange={setEmail}
              labelPlacement="outside"
              name="email"
              type="email"
              placeholder="Enter your email"
              classNames={{ input: "border-[#3E6259]" }}
            />
          </div>

          <div>
            <Input
              isRequired
              errorMessage={() => (
                <ul>
                  {errors.map((error, i) => (
                    <li key={i}>{error}</li>
                  ))}
                </ul>
              )}
              isInvalid={errors.length > 0}
              label="Password"
              value={password}
              onValueChange={setPassword}
              labelPlacement="outside"
              name="password"
              type="password"
              placeholder="Enter your password"
              classNames={{ input: "border-[#3E6259]" }}
            />
          </div>

          <Button
            type="submit"
            className="bg-[#212922] text-[#5B8266]"
            variant="flat"
          >
            Sign Up
          </Button>
        </form>
        <p className="mt-4 text-sm text-center">
          Already have an account?{" "}
          <Link
            href="/auth/signin"
            className="text-[#5B8266] active:hover:text-[#212922] underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
