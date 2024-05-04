import api from "./api";
import { AboutUsData } from "./types";

export const fetchAboutUsData = async (): Promise<AboutUsData | null> => {
  try {
    const response = await api.get("/info/aboutus/");
    return response.data[0] || null;
  } catch (error) {
    console.error("Error fetching About Us data:", error);
    return null;
  }
};

export const CarouselData = async () => {
  try {
    const response = await api.get("/info/carousels/");
    return response.data;
  } catch (error) {
    console.error("Error fetching Carousel data:", error);
    return null;
  }
};
