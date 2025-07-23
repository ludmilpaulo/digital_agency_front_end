import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseAPI } from "@/useAPI/api";

export const expensesApi = createApi({
  reducerPath: "expensesApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${baseAPI}/task/` }),
  tagTypes: ["BoardExpense"],
  endpoints: (builder) => ({
    getBoardExpenses: builder.query<any[], { boardId: number }>({
      query: ({ boardId }) => `board-expenses/?board=${boardId}`,
      providesTags: ["BoardExpense"],
    }),
    addBoardExpense: builder.mutation<any, { board: number; card: number; amount: number; note: string }>({
      query: (body) => ({
        url: "board-expenses/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["BoardExpense"],
    }),
  }),
});

export const { useGetBoardExpensesQuery, useAddBoardExpenseMutation } = expensesApi;
