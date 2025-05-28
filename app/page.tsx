"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
const MainBanner = dynamic(() => import("@/components/MainBanner"), { ssr: false });


const Home: React.FC = () => {
  return (
    <main className="flex flex-1 w-full">
      <MainBanner />
    </main>
  );
};

export default Home;
