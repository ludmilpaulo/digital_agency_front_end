// src/redux/services/usersApi.ts
import { baseAPI } from "@/useAPI/api";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Match this to your Django User serializer!
export interface UserProfile {
  role: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  groups?: string[];
  is_staff?: boolean;
  is_active?: boolean;
  profile?: UserProfile;
}

export const usersApi = createApi({
  reducerPath: "usersApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseAPI}/account/`, // <-- change to your actual user API base path
    prepareHeaders: (headers, { getState }) => {
      const token =
        (getState() as any).auth?.token || localStorage.getItem("token");
      if (token) {
        headers.set("authorization", `Token ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getUsers: builder.query<User[], void>({
      query: () => "users/", // Django endpoint, e.g. /api/users/
    }),
    getUser: builder.query<User, number>({
      query: (id) => `users/${id}/`,
    }),
  }),
});

export const { useGetUsersQuery, useGetUserQuery } = usersApi;
