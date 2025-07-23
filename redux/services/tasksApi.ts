import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Task, TaskComment } from "@/types/tasks";
import { baseAPI } from '@/useAPI/api';

export const tasksApi = createApi({
  reducerPath: 'tasksApi',
  baseQuery: fetchBaseQuery({
    baseUrl: baseAPI + '/task/',
    prepareHeaders: (headers, { getState }) => {
      const user = (getState() as any).auth?.user;
      if (user && user.token) {
        headers.set('authorization', `Bearer ${user.token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Task', 'TaskComment'],
  endpoints: (builder) => ({
    getTasks: builder.query<Task[], { user_id?: number } | void>({
      query: (params) =>
        params?.user_id ? `tasks/?user_id=${params.user_id}` : 'tasks/',
      providesTags: ['Task'],
    }),
    getTask: builder.query<Task, number>({
      query: (id) => `tasks/${id}/`,
      providesTags: (result, error, id) => [{ type: 'Task', id }],
    }),
    addTask: builder.mutation<Task, Partial<Task>>({
      query: (body) => ({
        url: 'tasks/',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Task'],
    }),
    updateTask: builder.mutation<Task, { id: number; data: Partial<Task> }>({
      query: ({ id, data }) => ({
        url: `tasks/${id}/`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Task', id }],
    }),
    deleteTask: builder.mutation<void, number>({
      query: (id) => ({
        url: `tasks/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Task'],
    }),
    assignTaskToUser: builder.mutation<Task, { cardId: number; userIds: number[] }>({
      query: ({ cardId, userIds }) => ({
        url: `tasks/${cardId}/assign/`,
        method: "POST",
        body: { user_ids: userIds },
      }),
      invalidatesTags: (result, error, { cardId }) => [{ type: 'Task', id: cardId }],
    }),
    getTaskComments: builder.query<TaskComment[], number>({
      query: (taskId) => `card-comments/?card=${taskId}`,
      providesTags: (result, error, taskId) => [{ type: 'TaskComment', id: taskId }],
    }),
    addTaskComment: builder.mutation<TaskComment, { card: number; text: string; amount?: number }>({
      query: (body) => ({
        url: 'card-comments/',
        method: 'POST',
        body,
      }),
      invalidatesTags: (result, error, { card }) => [{ type: 'TaskComment', id: card }],
    }),
    deleteTaskComment: builder.mutation<void, number>({
      query: (id) => ({
        url: `card-comments/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['TaskComment'],
    }),
  }),
});

export const {
  useGetTasksQuery,
  useGetTaskQuery,
  useAddTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  useAssignTaskToUserMutation,
  useGetTaskCommentsQuery,
  useAddTaskCommentMutation,
  useDeleteTaskCommentMutation,
} = tasksApi;
