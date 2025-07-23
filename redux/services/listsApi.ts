// redux/services/listsApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { List } from '@/types/tasks';
import { baseAPI } from '@/useAPI/api';

export const listsApi = createApi({
  reducerPath: 'listsApi',
  baseQuery: fetchBaseQuery({ baseUrl: baseAPI + '/task/' }),
  tagTypes: ['List'],
  endpoints: (builder) => ({
    getLists: builder.query<List[], { boardId?: number; userId?: number } | void>({
      query: (params) => {
        if (!params) return 'lists/';
        if (params?.boardId) return `lists/?board=${params.boardId}`;
        if (params?.userId) return `lists/?user_id=${params.userId}`;
        return 'lists/';
      },
      providesTags: ['List'],
    }),
    getList: builder.query<List, number>({
      query: (id) => `lists/${id}/`,
      providesTags: (result, error, id) => [{ type: 'List', id }],
    }),
    addList: builder.mutation<List, Partial<List>>({
      query: (body) => ({
        url: 'lists/',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['List'],
    }),
    updateList: builder.mutation<List, { id: number; data: Partial<List> }>({
      query: ({ id, data }) => ({
        url: `lists/${id}/`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['List'],
    }),
    deleteList: builder.mutation<void, number>({
      query: (id) => ({
        url: `lists/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['List'],
    }),
  }),
});

export const {
  useGetListsQuery,
  useGetListQuery,
  useAddListMutation,
  useUpdateListMutation,
  useDeleteListMutation,
} = listsApi;
