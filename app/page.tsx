"use client";

import React, { useState, useEffect } from "react";
import MainBanner from "@/components/MainBanner";

const Home: React.FC = () => {
  return (
    <main className="flex flex-1 w-full">
      <MainBanner />
    </main>
  );
};

export default Home;
