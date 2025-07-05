import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { baseAPI } from '@/useAPI/api';
import { Post, Comment} from '@/types/blog';


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
      query: (postId) => `blog/${postId}/comments/`,
      providesTags: (result, error, postId) => [{ type: 'Comment', id: postId }],
    }),
    addComment: builder.mutation<Comment, { postId: number; data: Partial<Comment> }>({
      query: ({ postId, data }) => ({
        url: `posts/${postId}/comments/`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (result, error, { postId }) => [{ type: 'Comment', id: postId }],
    }),
    // For admin: update, delete, schedule etc
  }),
});

export const {
  useGetPostsQuery,
  useGetPostQuery,
  useGetCommentsQuery,
  useAddCommentMutation,
} = blogApi;
