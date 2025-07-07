// src/redux/services/testimonialsApi.ts

import { baseAPI } from '@/useAPI/api'; // Make sure the path is correct for your project
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  quote: string;
  avatar: string;
  stars: number;
  // created_at?: string; // Optional, add if you use it
}

export const testimonialsApi = createApi({
  reducerPath: 'testimonialsApi',
  baseQuery: fetchBaseQuery({ baseUrl: baseAPI }),
  endpoints: (builder) => ({
    getTestimonials: builder.query<Testimonial[], void>({
      query: () => "testimonials/testimonials/", // relative to baseAPI, no leading slash!
    }),
  }),
});

export const { useGetTestimonialsQuery } = testimonialsApi;
