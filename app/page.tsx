"use client";

import AboutUs from "@/components/AboutUs";
import ClothingCategory from "@/components/ClothingCategory";
import Hero from "@/components/Hero";
import React from "react";

const Home = () => {
  return (
    <div>
      <Hero />
      <ClothingCategory />
      <AboutUs />
    </div>
  );
};

export default Home;
