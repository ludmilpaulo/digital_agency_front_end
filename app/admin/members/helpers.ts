// app/admin/members/helpers.ts
import { useCallback } from "react";
import {
  useAssignUsersToBuiltinGroupMutation,
  useAssignUsersToProjectGroupMutation,
  useUpdateBuiltinGroupMutation,
  useUpdateProjectGroupMutation,
  useDeleteBuiltinGroupMutation,
  useDeleteProjectGroupMutation,
  useAddBuiltinGroupMutation,
  useAddProjectGroupMutation,
  Group,
  GroupType,
} from "@/redux/services/groupsApi";

/**
 * Unified group actions for MembersAdmin.
 */
export function useGroupActions() {
  // RTK Query mutations for both group types
  const [assignToBuiltin] = useAssignUsersToBuiltinGroupMutation();
  const [assignToProject] = useAssignUsersToProjectGroupMutation();
  const [updateBuiltin] = useUpdateBuiltinGroupMutation();
  const [updateProject] = useUpdateProjectGroupMutation();
  const [deleteBuiltin] = useDeleteBuiltinGroupMutation();
  const [deleteProject] = useDeleteProjectGroupMutation();
  const [addBuiltin] = useAddBuiltinGroupMutation();
  const [addProject] = useAddProjectGroupMutation();

  // Assign users to group (handles both types)
  const assignUsersToGroup = useCallback(
    async (group: Group, userIds: number[]) => {
      if (group.type === "builtin") {
        await assignToBuiltin({ groupId: group.id, userIds }).unwrap();
      } else {
        await assignToProject({ groupId: group.id, userIds }).unwrap();
      }
    },
    [assignToBuiltin, assignToProject]
  );

  // Edit group name
  const updateGroupName = useCallback(
    async (group: Group, name: string) => {
      if (group.type === "builtin") {
        await updateBuiltin({ id: group.id, name }).unwrap();
      } else {
        await updateProject({ id: group.id, name }).unwrap();
      }
    },
    [updateBuiltin, updateProject]
  );

  // Delete group
  const deleteGroup = useCallback(
    async (id: number) => {
      // You must know type. In your UI you can pass type, or store both IDs per type.
      // Let's assume you always have the group object and pass its type instead.
      throw new Error(
        "deleteGroup requires group object, use deleteGroupWithType(group)"
      );
    },
    []
  );

  // Delete group with type
  const deleteGroupWithType = useCallback(
    async (group: Group) => {
      if (group.type === "builtin") {
        await deleteBuiltin(group.id).unwrap();
      } else {
        await deleteProject(group.id).unwrap();
      }
    },
    [deleteBuiltin, deleteProject]
  );

  // Add group
  const addGroup = useCallback(
    async (type: GroupType, name: string) => {
      if (type === "builtin") {
        await addBuiltin({ name }).unwrap();
      } else {
        await addProject({ name }).unwrap();
      }
    },
    [addBuiltin, addProject]
  );

  return {
    assignUsersToGroup,
    updateGroupName,
    deleteGroupWithType,
    addGroup,
  };
}
