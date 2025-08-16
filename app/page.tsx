"use client";

import { Button } from "@/components/ui/button";
import React from "react";

const Home = () => {
  return (
    <div>
      Home
      <Button onClick={() => alert("test")}>Test</Button>
    </div>
  );
};

export default Home;
