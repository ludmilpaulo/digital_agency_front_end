/** @jsxImportSource @emotion/react */
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { CarouselData } from "@/useAPI/information";
import Image from "next/image";

interface CarouselImage {
  image: string;
}

interface CarouselData {
  id: number;
  image: CarouselImage[];
  title: string;
  sub_title: string;
}

const MainBanner: React.FC = () => {
  const [carouselData, setCarouselData] = useState<CarouselData[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  useEffect(() => {
    const fetchCarouselData = async () => {
      try {
        const data = await CarouselData();
        setCarouselData(data);
      } catch (error) {
        console.error("Error fetching carousel data:", error);
      }
    };

    fetchCarouselData();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (carouselData.length > 0) {
        const totalImagesInCurrentSlide =
          carouselData[currentSlideIndex].image.length;
        const nextImageIndex =
          (currentImageIndex + 1) % totalImagesInCurrentSlide;
        const nextSlideIndex =
          nextImageIndex === 0
            ? (currentSlideIndex + 1) % carouselData.length
            : currentSlideIndex;

        setCurrentImageIndex(nextImageIndex);
        setCurrentSlideIndex(nextSlideIndex);
      }
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(intervalId); // Cleanup the interval on component unmount
  }, [carouselData, currentImageIndex, currentSlideIndex]);

  return (
    <section className="relative w-full h-screen overflow-hidden">
      {carouselData.length > 0 && (
        <div className="w-full h-full">
          <Image
            src={carouselData[currentSlideIndex].image[currentImageIndex].image}
            alt="Banner Image"
            layout="fill"
            objectFit="cover"
            priority={true}
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
      )}
    </section>
  );
};

export default MainBanner;
