import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Board, List, Card } from "@/types/kanban";
import { baseAPI } from "@/useAPI/api";

export const boardsApi = createApi({
  reducerPath: "boardsApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${baseAPI}/task/` }),
  tagTypes: ["Boards"],
  endpoints: (builder) => ({
    getBoards: builder.query<Board[], { user_id?: number; manager_id?: number; search?: string }>({
      query: (params) => ({
        url: `boards/`,
        params: params,
      }),
      providesTags: ["Boards"],
    }),

    addBoard: builder.mutation<
        Board,
        {
          name: string;
          description: string;
          development_link?: string;
          repository_link?: string;
          client_link?: string;
          sample_link?: string;
          managers_ids: number[];
          users_ids: number[];
          budget?: number;
          deadline?: string;
          start_date?: string;
          end_date?: string;
          status?: string;
        }
      >({
        query: (body) => ({
          url: `boards/`,
          method: "POST",
          body,
        }),
        invalidatesTags: ["Boards"],
      }),

    editBoard: builder.mutation<
        Board,
        {
          id: number;
          name: string;
          description: string;
          development_link?: string;
          repository_link?: string;
          client_link?: string;
          sample_link?: string;
          managers_ids: number[];
          users_ids: number[];
          budget?: number;
          deadline?: string;
          start_date?: string;
          end_date?: string;
          status?: string;
        }
      >({
        query: ({ id, ...body }) => ({
          url: `boards/${id}/`,
          method: "PUT",
          body,
        }),
        invalidatesTags: ["Boards"],
      }),

    deleteBoard: builder.mutation<void, number>({
      query: (id) => ({
        url: `boards/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Boards"],
    }),
    addList: builder.mutation<List, { name: string; board: number }>({
      query: (body) => ({
        url: `lists/`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Boards"],
    }),
    deleteList: builder.mutation<void, number>({
      query: (id) => ({
        url: `lists/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Boards"],
    }),
    addCard: builder.mutation<
      Card,
      {
        title: string;
        description: string;
        list: number;
        status?: string;
        assignees_ids?: number[];
      }
    >({
      query: (body) => ({
        url: `cards/`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Boards"],
    }),
    deleteCard: builder.mutation<void, number>({
      query: (id) => ({
        url: `cards/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Boards"],
    }),
  }),
});

// Exports
export const {
  useGetBoardsQuery,
  useAddBoardMutation,
  useEditBoardMutation,
  useDeleteBoardMutation,
  useAddListMutation,
  useDeleteListMutation,
  useAddCardMutation,
  useDeleteCardMutation,
} = boardsApi;
