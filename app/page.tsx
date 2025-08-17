"use client";

import { Button } from "@/components/ui/button";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import React from "react";

const Home = () => {
  return (
    <div>
      Home{" "}
      <h1 className="font-[var(--font-baloo)] text-5xl text-yellow-600">
        টি-শার্টে গল্প, স্টাইলে বাংলা!
      </h1>
      <SignedOut>
        <SignInButton mode="modal" />
        <SignUpButton mode="modal">
          <Button>Sign Up</Button>
        </SignUpButton>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </SignedOut>
    </div>
  );
};

export default Home;
