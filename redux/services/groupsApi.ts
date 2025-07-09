// src/redux/services/groupsApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseAPI } from "@/useAPI/api";

// Type definitions for both group types
export type GroupType = "builtin" | "project";

export interface Group {
  id: number;
  name: string;
  user_ids?: number[]; // Built-in Group uses user_set, ProjectGroup uses users
  users?: number[];
  type: GroupType;
}

// This shape matches your /groups/all/ endpoint
export interface AllGroupsResponse {
  builtin_groups: Group[];
  project_groups: Group[];
}

export const groupsApi = createApi({
  reducerPath: "groupsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseAPI}/account/`,
    prepareHeaders: (headers, { getState }) => {
      const token =
        (getState() as any)?.auth?.token || localStorage.getItem("token");
      if (token) headers.set("authorization", `Token ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Groups"],
  endpoints: (builder) => ({
    // Fetch both group types for unified UI
    getAllGroups: builder.query<AllGroupsResponse, void>({
      query: () => `groups/all/`,
      providesTags: ["Groups"],
    }),

    // Fetch only built-in groups (if you need separately)
    getBuiltinGroups: builder.query<Group[], void>({
      query: () => `builtin-groups/`,
      providesTags: ["Groups"],
    }),

    // Fetch only project groups
    getProjectGroups: builder.query<Group[], void>({
      query: () => `project-groups/`,
      providesTags: ["Groups"],
    }),

    // Add a group (choose type)
    addBuiltinGroup: builder.mutation<Group, { name: string }>(
      {
        query: (body) => ({
          url: `builtin-groups/`,
          method: "POST",
          body,
        }),
        invalidatesTags: ["Groups"],
      }
    ),
    addProjectGroup: builder.mutation<Group, { name: string }>(
      {
        query: (body) => ({
          url: `project-groups/`,
          method: "POST",
          body,
        }),
        invalidatesTags: ["Groups"],
      }
    ),

    // Update group (choose type)
    updateBuiltinGroup: builder.mutation<Group, { id: number; name: string }>(
      {
        query: ({ id, name }) => ({
          url: `builtin-groups/${id}/`,
          method: "PATCH",
          body: { name },
        }),
        invalidatesTags: ["Groups"],
      }
    ),
    updateProjectGroup: builder.mutation<Group, { id: number; name: string }>(
      {
        query: ({ id, name }) => ({
          url: `project-groups/${id}/`,
          method: "PATCH",
          body: { name },
        }),
        invalidatesTags: ["Groups"],
      }
    ),

    // Delete group (choose type)
    deleteBuiltinGroup: builder.mutation<void, number>({
      query: (id) => ({
        url: `builtin-groups/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Groups"],
    }),
    deleteProjectGroup: builder.mutation<void, number>({
      query: (id) => ({
        url: `project-groups/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Groups"],
    }),

    // Assign users to group (choose type)
    assignUsersToBuiltinGroup: builder.mutation<Group, { groupId: number; userIds: number[] }>({
      query: ({ groupId, userIds }) => ({
        url: `builtin-groups/${groupId}/assign_users/`,
        method: "POST",
        body: { user_ids: userIds },
      }),
      invalidatesTags: ["Groups"],
    }),
    assignUsersToProjectGroup: builder.mutation<Group, { groupId: number; userIds: number[] }>({
      query: ({ groupId, userIds }) => ({
        url: `project-groups/${groupId}/assign_users/`,
        method: "POST",
        body: { user_ids: userIds },
      }),
      invalidatesTags: ["Groups"],
    }),
  }),
});

export const {
  useGetAllGroupsQuery,
  useGetBuiltinGroupsQuery,
  useGetProjectGroupsQuery,
  useAddBuiltinGroupMutation,
  useAddProjectGroupMutation,
  useUpdateBuiltinGroupMutation,
  useUpdateProjectGroupMutation,
  useDeleteBuiltinGroupMutation,
  useDeleteProjectGroupMutation,
  useAssignUsersToBuiltinGroupMutation,
  useAssignUsersToProjectGroupMutation,
} = groupsApi;
