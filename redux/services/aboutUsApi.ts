import { baseAPI } from "@/useAPI/api";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Types
export interface AboutUsData {
  id: number;
  title: string;
  logo: string;
  about: string;
  address: string;
  phone: string;
  email: string;
  whatsapp: string;
  backgroundImage: string;
  backgroundApp: string;
  born_date: string;
  // ... other fields as needed
}

export interface WhyChooseUsData {
  id: number;
  title: string;
  content: string;
}

export interface TeamData {
  id: number;
  name: string;
  title: string;
  bio: string;
  image: string | null; // null if not set
  github?: string | null;
  linkedin?: string | null;
  facebook?: string | null;
  twitter?: string | null;
  instagram?: string | null;
  email?: string | null; // For "Contact" button, optional
  tags?: string[];       // Skill/expertise tags
}

export interface TimelineData {
  id: number;
  year: string;
  title: string;
  desc: string;
}

export interface PartnerData {
  id: number;
  name: string;
  img: string;
  url: string;
}

export interface TestimonialData {
  id: number;
  name: string;
  role: string;
  quote: string;
  avatar?: string;
  stars: number;
}

// API Service
export const aboutUsApi = createApi({
  reducerPath: "aboutUsApi",
  baseQuery: fetchBaseQuery({ baseUrl: baseAPI }),
  endpoints: (builder) => ({
    getAboutUs: builder.query<AboutUsData, void>({
      query: () => "/info/aboutus/",
      transformResponse: (response: any) => Array.isArray(response) ? response[0] : response,
    }),
    getWhyChooseUs: builder.query<WhyChooseUsData[], void>({
      query: () => "/info/whychooseus/",
    }),
    getTeams: builder.query<TeamData[], void>({
      query: () => "/info/teams/",
    }),
    getTimeline: builder.query<TimelineData[], void>({
      query: () => "/info/timeline/",
    }),
    getPartners: builder.query<PartnerData[], void>({
      query: () => "/info/partners/",
    }),
    getTestimonials: builder.query<TestimonialData[], void>({
      query: () => "/testimonials/testimonials/",
    }),
  }),
});

export const {
  useGetAboutUsQuery,
  useGetWhyChooseUsQuery,
  useGetTeamsQuery,
  useGetTimelineQuery,
  useGetPartnersQuery,
  useGetTestimonialsQuery,
} = aboutUsApi;
