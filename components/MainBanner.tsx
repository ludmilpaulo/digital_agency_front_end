/** @jsxImportSource @emotion/react */
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "@/redux/store";
import { fetchCarousel } from "@/redux/slices/carouselSlice";

const MainBanner: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items: carouselData, loading } = useSelector(
    (state: RootState) => state.carousel
  );

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Fetch carousel data on mount
  useEffect(() => {
    dispatch(fetchCarousel());
  }, [dispatch]);

  // Auto-slide logic
  useEffect(() => {
    if (carouselData.length === 0) return;
    const intervalId = setInterval(() => {
      const totalImages = carouselData[currentSlideIndex]?.image.length || 1;
      const nextImageIndex = (currentImageIndex + 1) % totalImages;
      const nextSlideIndex =
        nextImageIndex === 0
          ? (currentSlideIndex + 1) % carouselData.length
          : currentSlideIndex;

      setCurrentImageIndex(nextImageIndex);
      setCurrentSlideIndex(nextSlideIndex);
    }, 3000); // Every 3 seconds

    return () => clearInterval(intervalId);
  }, [carouselData, currentImageIndex, currentSlideIndex]);

  if (loading) {
    return (
      <section className="relative w-full h-screen flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </section>
    );
  }

  if (!carouselData?.length) {
    return null;
  }

  const currentImageSrc =
    carouselData[currentSlideIndex].image[currentImageIndex]?.image ||
    "/default.jpg";

  return (
    <section className="relative w-full h-screen overflow-hidden">
      <div className="w-full h-full">
        <Image
          src={currentImageSrc}
          alt="Banner Image"
          layout="fill"
          objectFit="cover"
          priority={true}
          {...(currentImageSrc.endsWith('.gif') ? { unoptimized: true } : {})}
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-center p-4">
            <h2 className="text-white text-3xl lg:text-5xl font-bold">
              {carouselData[currentSlideIndex].title}
            </h2>
            <p className="text-white text-xl lg:text-2xl mt-2">
              {carouselData[currentSlideIndex].sub_title}
            </p>
            <Link href="/appointment">
              <span className="mt-4 inline-block bg-red-500 text-white uppercase font-bold py-2 px-4 rounded-lg hover:bg-red-700 transition-colors">
                Book an Appointment!
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MainBanner;
