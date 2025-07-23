// redux/services/cardsApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Card } from '@/types/tasks';
import { baseAPI } from '@/useAPI/api';

// If you want to define a comment type, do so here (optional)
export interface CardComment {
  id: number;
  card: number;
  user: { id: number; username: string };
  text: string;
  created: string;
}

export const cardsApi = createApi({
  reducerPath: 'cardsApi',
  baseQuery: fetchBaseQuery({ baseUrl: baseAPI + '/task/' }),
  tagTypes: ['Card', 'CardComment'],
  endpoints: (builder) => ({
    // --- Card CRUD ---
    getCards: builder.query<Card[], { listId?: number; userId?: number } | void>({
      query: (params) => {
        if (!params) return 'cards/';
        if (params?.userId) return `cards/?assignee_id=${params.userId}`;
        if (params?.listId) return `cards/?list=${params.listId}`;
        return 'cards/';
      },
      providesTags: ['Card'],
    }),
    getCard: builder.query<Card, number>({
      query: (id) => `cards/${id}/`,
      providesTags: (result, error, id) => [{ type: 'Card', id }],
    }),
    addCard: builder.mutation<Card, Partial<Card>>({
      query: (body) => ({
        url: 'cards/',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Card'],
    }),
    updateCard: builder.mutation<Card, { id: number; data: Partial<Card> }>({
      query: ({ id, data }) => ({
        url: `cards/${id}/`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Card', id },
        'Card'
      ],
    }),
    assignTaskToUser: builder.mutation<Card, { cardId: number; userIds: number[] }>({
      query: ({ cardId, userIds }) => ({
        url: `cards/${cardId}/`,
        method: 'PATCH',
        body: { assignees: userIds },
      }),
      invalidatesTags: (result, error, { cardId }) => [{ type: 'Card', id: cardId }],
    }),
    updateTaskStatus: builder.mutation<Card, { cardId: number; status: string }>({
      query: ({ cardId, status }) => ({
        url: `cards/${cardId}/`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: (result, error, { cardId }) => [{ type: 'Card', id: cardId }],
    }),
    deleteCard: builder.mutation<void, number>({
      query: (id) => ({
        url: `cards/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Card', id }, 'Card'],
    }),

    // --- Card Comment Endpoints ---
    getComments: builder.query<CardComment[], number>({
      query: (cardId) => `card-comments/?card=${cardId}`,
      providesTags: (result, error, cardId) => [{ type: 'CardComment', id: cardId }],
    }),
    addComment: builder.mutation<CardComment, { card: number; text: string }>({
      query: (body) => ({
        url: 'card-comments/',
        method: 'POST',
        body,
      }),
      invalidatesTags: (result, error, { card }) => [{ type: 'CardComment', id: card }],
    }),
  }),
});

export const {
  useGetCardsQuery,
  useGetCardQuery,
  useAddCardMutation,
  useUpdateCardMutation,
  useAssignTaskToUserMutation,
  useUpdateTaskStatusMutation,
  useDeleteCardMutation,

  // Comments:
  useGetCommentsQuery,
  useAddCommentMutation,
} = cardsApi;
