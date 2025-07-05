import { baseAPI } from '@/useAPI/api';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Plan {
  id: number;
  service: number;
  name: string;
  price: string;
  features: string[];
  cta: string;
  popular: boolean;
  order: number;
}

export interface Service {
  id: number;
  title: string;
  slug: string;
  image: string;
  description: string;
  icon: string;
  featured: boolean;
  order: number;
  plans: Plan[];
}

export const servicesApi = createApi({
  reducerPath: 'servicesApi',
  baseQuery: fetchBaseQuery({ baseUrl: baseAPI + '/' }),
  endpoints: (builder) => ({
    getServices: builder.query<Service[], void>({
      query: () => 'services/services/',
    }),
    getService: builder.query<Service, number | string>({
      query: (id) => `services/services/${id}/`,
    }),
    getPlans: builder.query<Plan[], void>({
      query: () => 'services/plans/',
    }),
  }),
});

export const { useGetServicesQuery, useGetServiceQuery, useGetPlansQuery } = servicesApi;
