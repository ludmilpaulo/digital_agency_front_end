import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { baseAPI } from '@/useAPI/api';
import { Post, Comment } from '@/types/blog';

export const blogApi = createApi({
  reducerPath: 'blogApi',
  baseQuery: fetchBaseQuery({ baseUrl: baseAPI + '/blog/' }),
  tagTypes: ['Post', 'Comment'],
  endpoints: (builder) => ({
    getPosts: builder.query<Post[], void>({
      query: () => 'blogs/',
      providesTags: ['Post'],
    }),
    getPost: builder.query<Post, number | string>({
      query: (id) => `blogs/${id}/`,
      providesTags: ['Post'],
    }),
    getComments: builder.query<Comment[], number | string>({
      query: (postId) => `comments/?post=${postId}`,
      providesTags: (result, error, postId) => [{ type: 'Comment', id: postId }],
    }),
    addComment: builder.mutation<Comment, { post: number; name: string; email: string; content: string }>({
      query: (body) => ({
        url: 'comments/',
        method: 'POST',
        body,
      }),
      invalidatesTags: (result, error, { post }) => [{ type: 'Comment', id: post }],
    }),
  }),
});

export const {
  useGetPostsQuery,
  useGetPostQuery,
  useGetCommentsQuery,
  useAddCommentMutation,
} = blogApi;
