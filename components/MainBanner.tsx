/** @jsxImportSource @emotion/react */
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "@/redux/store";
import { fetchCarousel } from "@/redux/slices/carouselSlice";
import { motion } from "framer-motion";
import { FaChevronDown } from "react-icons/fa";

const MainBanner: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items: carouselData, loading } = useSelector(
    (state: RootState) => state.carousel
  );
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  useEffect(() => {
    dispatch(fetchCarousel());
  }, [dispatch]);

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
    }, 4000);
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
      {/* Background Image */}
      <div className="w-full h-full absolute inset-0 -z-10">
        <Image
          src={currentImageSrc}
          alt="Banner Image"
          fill
          className="object-cover object-center"
          priority
          {...(currentImageSrc.endsWith('.gif') ? { unoptimized: true } : {})}
        />
        {/* Gradient Overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/80 z-10" />
      </div>

      {/* Carousel Content */}
      <div className="relative z-20 flex flex-col justify-center items-center h-full">
        {/* Headline and Subtitle with Animation */}
        <motion.div
          className="text-center px-6"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-white text-4xl lg:text-6xl font-extrabold drop-shadow-lg">
            {carouselData[currentSlideIndex].title}
          </h1>
          <motion.p
            className="text-blue-200 text-lg lg:text-2xl mt-3 font-medium"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            {carouselData[currentSlideIndex].sub_title}
          </motion.p>
          {/* Agency-wide subtitle */}
          <motion.div
            className="text-blue-300 text-base lg:text-xl mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            Mobile Apps • Web Solutions • Digital Marketing • Automation
          </motion.div>
        </motion.div>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-col md:flex-row gap-4 items-center">
          <Link href="/appointment">
            <span className="bg-blue-500 hover:bg-blue-600 text-white text-lg font-bold px-7 py-3 rounded-full shadow transition-all">
              Book an Appointment
            </span>
          </Link>
          <Link href="/contact">
            <span className="bg-white/80 hover:bg-white text-blue-700 border border-blue-600 font-bold text-lg px-7 py-3 rounded-full shadow transition-all">
              Have an Idea? Let&#39;s Build It!
            </span>
          </Link>
        </div>

        {/* Slide Indicators */}
        <div className="mt-8 flex justify-center gap-2">
          {carouselData.map((_, idx) => (
            <button
              key={idx}
              className={`w-3 h-3 rounded-full border-2 transition-all duration-200 ${
                idx === currentSlideIndex
                  ? "bg-blue-500 border-blue-300 scale-125"
                  : "bg-white/60 border-white/50"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
              onClick={() => {
                setCurrentSlideIndex(idx);
                setCurrentImageIndex(0);
              }}
            />
          ))}
        </div>

        {/* Scroll Down Indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center">
          <FaChevronDown className="text-white text-2xl animate-bounce" />
          <span className="text-xs text-blue-100 mt-1">Scroll Down</span>
        </div>
      </div>
    </section>
  );
};

export default MainBanner;
