import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Task } from '@/types/tasks';
import { baseAPI } from '@/useAPI/api';

export const tasksApi = createApi({
  reducerPath: 'tasksApi',
  baseQuery: fetchBaseQuery({ baseUrl: baseAPI + '/task/' }),
  tagTypes: ['Task'],
  endpoints: (builder) => ({
    // Pass user_id for backend filtering
    getTasks: builder.query<Task[], { user_id?: number } | void>({
      query: (params) => {
        if (params?.user_id) return `tasks/?user_id=${params.user_id}`;
        return 'tasks/';
      },
      providesTags: ['Task'],
    }),
    // add other endpoints if needed
  }),
});

export const { useGetTasksQuery } = tasksApi;
