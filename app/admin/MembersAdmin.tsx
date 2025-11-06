"use client";
import React, { useState, useMemo } from "react";
import { User } from "@/redux/services/usersApi";
import { Group, GroupType } from "@/redux/services/groupsApi";
import { useGetUsersQuery } from "@/redux/services/usersApi";
import { useGetAllGroupsQuery } from "@/redux/services/groupsApi";
import { useGroupActions } from "./members/helpers";
import GroupsList from "./members/GroupsList";
import GroupPanel from "./members/GroupPanel";
import UsersWithoutGroup from "./members/UsersWithoutGroup";
import BulkAssignModal from "./members/BulkAssignModal";
import CreateUserModal from "./members/CreateUserModal";
import EditUserModal from "./members/EditUserModal";
import toast from "react-hot-toast";
import { baseAPI } from "@/useAPI/api";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const USERS_PER_PAGE = 10;
const GROUPS_PER_PAGE = 8;

export default function MembersAdmin() {
  const { data: users = [], isLoading: usersLoading, refetch: refetchUsers } = useGetUsersQuery();
  const { data: allGroupsData, isLoading: groupsLoading } = useGetAllGroupsQuery();
  const {
    assignUsersToGroup,
    updateGroupName,
    deleteGroupWithType,
    addGroup,
  } = useGroupActions();

  const [search, setSearch] = useState<string>("");
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userPage, setUserPage] = useState(1);
  const [groupPage, setGroupPage] = useState(1);

  // Reset page to 1 when search changes
  React.useEffect(() => {
    setUserPage(1);
  }, [search]);

  const allGroups: Group[] = useMemo(() => {
    if (!allGroupsData) return [];
    return [
      ...(allGroupsData.builtin_groups?.map(g => ({ ...g, type: "builtin" as GroupType })) ?? []),
      ...(allGroupsData.project_groups?.map(g => ({ ...g, type: "project" as GroupType })) ?? []),
    ];
  }, [allGroupsData]);

  const filteredUsers = useMemo(() => {
    const text = search.trim().toLowerCase();
    if (!text) return users;
    return users.filter(
      u =>
        u.username.toLowerCase().includes(text) ||
        (u.email?.toLowerCase() ?? "").includes(text)
    );
  }, [users, search]);

  const pagedUsers = filteredUsers.slice(
    (userPage - 1) * USERS_PER_PAGE,
    userPage * USERS_PER_PAGE
  );
  const totalUserPages = Math.max(1, Math.ceil(filteredUsers.length / USERS_PER_PAGE));

  const sortedGroups = allGroups
    .slice()
    .sort((a, b) => (b.users?.length ?? 0) - (a.users?.length ?? 0));
  const pagedGroups = sortedGroups.slice(
    (groupPage - 1) * GROUPS_PER_PAGE,
    groupPage * GROUPS_PER_PAGE
  );
  const totalGroupPages = Math.max(1, Math.ceil(sortedGroups.length / GROUPS_PER_PAGE));

  const selectedGroup = allGroups.find(g => g.id === selectedGroupId) ?? null;

  const usersNotInAnyGroup = users.filter(
    u => !allGroups.some(g => g.users?.includes(u.id))
  );

  // User CRUD operations
  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setShowEditUserModal(true);
  };

  const handleDeleteUser = async (user: User) => {
    if (!confirm(`Are you sure you want to delete user "${user.username}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`${baseAPI}/account/groups-users/${user.id}/`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      toast.success(`User "${user.username}" has been deleted`, { duration: 4000 });
      refetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user", { duration: 4000 });
    }
  };

  // Add group
  const [addingType, setAddingType] = useState<GroupType>("project");
  const [addingName, setAddingName] = useState<string>("");

  async function handleAddGroup() {
    if (!addingName.trim()) return;
    await addGroup(addingType, addingName.trim());
    setAddingName("");
  }

  // Edit group
  const [editingGroupId, setEditingGroupId] = useState<number | null>(null);
  const [editingGroupName, setEditingGroupName] = useState<string>("");

  function beginEditGroup(group: Group) {
    setEditingGroupId(group.id);
    setEditingGroupName(group.name);
  }
  async function saveEditGroup(group: Group) {
    if (!editingGroupName.trim()) return;
    await updateGroupName(group, editingGroupName.trim());
    setEditingGroupId(null);
    setEditingGroupName("");
  }
  function cancelEditGroup() {
    setEditingGroupId(null);
    setEditingGroupName("");
  }

  // Remove user from group
  async function handleRemoveUserFromGroup(userId: number, group: Group) {
    const filtered = (group.users ?? []).filter(uid => uid !== userId);
    await assignUsersToGroup(group, filtered);
  }

  // Drag user to group
  async function handleDropUserToGroup(userId: number, group: Group) {
    if ((group.users ?? []).includes(userId)) return;
    await assignUsersToGroup(group, [...(group.users ?? []), userId]);
  }

  // Bulk assign
  const [bulkSelectedUserIds, setBulkSelectedUserIds] = useState<number[]>([]);
  const [bulkSelectedGroupIds, setBulkSelectedGroupIds] = useState<number[]>([]);

  async function handleBulkAssign() {
    for (const groupId of bulkSelectedGroupIds) {
      const group = allGroups.find(g => g.id === groupId);
      if (!group) continue;
      await assignUsersToGroup(group, [
        ...(group.users ?? []),
        ...bulkSelectedUserIds.filter(uid => !(group.users ?? []).includes(uid)),
      ]);
    }
    setShowBulkModal(false);
    setBulkSelectedUserIds([]);
    setBulkSelectedGroupIds([]);
  }

  if (usersLoading || groupsLoading) return <div>Loading...</div>;

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col gap-6 md:flex-row">
        {/* Sidebar - Groups */}
        <div className="w-full md:w-1/3">
          <div className="mb-4 flex flex-col sm:flex-row gap-2">
            <select
              value={addingType}
              onChange={e => setAddingType(e.target.value as GroupType)}
              className="border px-2 py-1 rounded"
            >
              <option value="project">Project Group</option>
              <option value="builtin">System Group</option>
            </select>
            <input
              className="border px-2 py-1 rounded flex-1"
              value={addingName}
              onChange={e => setAddingName(e.target.value)}
              placeholder="New group name"
              onKeyDown={e => e.key === "Enter" && handleAddGroup()}
            />
            <button
              className="bg-blue-600 text-white px-3 rounded"
              onClick={handleAddGroup}
              disabled={!addingName.trim()}
            >
              Add
            </button>
          </div>
          <GroupsList
            groups={pagedGroups}
            users={users}
            selectedGroupId={selectedGroupId}
            onSelect={setSelectedGroupId}
            onDelete={(group: Group) => deleteGroupWithType(group)}
            editingGroupId={editingGroupId}
            editingGroupName={editingGroupName}
            onEdit={beginEditGroup}
            onEditChange={setEditingGroupName}
            onEditSave={saveEditGroup}
            onEditCancel={cancelEditGroup}
          />
          {/* Pagination */}
          <div className="flex gap-2 justify-center mt-4">
            <button
              className="px-2 py-1 rounded text-blue-700 border"
              disabled={groupPage === 1}
              onClick={() => setGroupPage(p => Math.max(1, p - 1))}
            >
              Prev
            </button>
            <span className="text-sm pt-1">
              Page {groupPage}/{totalGroupPages}
            </span>
            <button
              className="px-2 py-1 rounded text-blue-700 border"
              disabled={groupPage === totalGroupPages}
              onClick={() => setGroupPage(p => Math.min(totalGroupPages, p + 1))}
            >
              Next
            </button>
          </div>
        </div>
        {/* Main content - Group members + Users */}
        <div className="flex-1 min-w-0">
          {showCreateUserModal && (
            <CreateUserModal
              onClose={() => setShowCreateUserModal(false)}
              onSuccess={() => {
                refetchUsers();
                setShowCreateUserModal(false);
              }}
              groups={allGroups}
              assignUsersToGroup={assignUsersToGroup}
            />
          )}
          {showEditUserModal && editingUser && (
            <EditUserModal
              user={editingUser}
              onClose={() => {
                setShowEditUserModal(false);
                setEditingUser(null);
              }}
              onSuccess={() => {
                refetchUsers();
                setShowEditUserModal(false);
                setEditingUser(null);
              }}
              groups={allGroups}
              assignUsersToGroup={assignUsersToGroup}
            />
          )}
          {showBulkModal && (
            <BulkAssignModal
              users={users}
              groups={allGroups}
              selectedUserIds={bulkSelectedUserIds}
              setSelectedUserIds={setBulkSelectedUserIds}
              selectedGroupIds={bulkSelectedGroupIds}
              setSelectedGroupIds={setBulkSelectedGroupIds}
              onClose={() => setShowBulkModal(false)}
              onAssign={handleBulkAssign}
            />
          )}
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="search"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search users by username/email"
                  className="border px-3 py-2 pr-10 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {search && (
                  <button
                    onClick={() => setSearch('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    title="Clear search"
                  >
                    ✕
                  </button>
                )}
              </div>
              {search && (
                <div className="text-sm text-gray-600 mt-1">
                  Found {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''} matching &quot;{search}&quot;
                  {filteredUsers.length > 0 && ` (showing page ${userPage} of ${totalUserPages})`}
                </div>
              )}
            </div>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-semibold flex items-center gap-2 shadow-md"
              onClick={() => setShowCreateUserModal(true)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              Create New User
            </button>
            <button
              className="bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800 transition font-semibold flex items-center gap-2 shadow-md"
              onClick={() => setShowBulkModal(true)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Bulk Assign
            </button>
          </div>
          <UsersWithoutGroup
            users={usersNotInAnyGroup}
            allGroups={allGroups}
            assignUsers={async ({ groupId, userIds }: { groupId: number; userIds: number[] }) => {
              const group = allGroups.find(g => g.id === groupId);
              if (!group) return;
              await assignUsersToGroup(group, [
                ...(group.users ?? []),
                ...userIds.filter(uid => !(group.users ?? []).includes(uid)),
              ]);
            }}
          />
          <div className="flex flex-wrap gap-5">
            {selectedGroup
              ? (
                <GroupPanel
                  key={selectedGroup.id}
                  group={selectedGroup}
                  members={users.filter(u => selectedGroup.users?.includes(u.id))}
                  onRemoveUser={(uid, g) => handleRemoveUserFromGroup(uid, g)}
                  onDropUser={(uid, g) => handleDropUserToGroup(uid, g)}
                  selected
                  onEditGroup={beginEditGroup}
                  onDeleteGroup={g => deleteGroupWithType(g)}
                  onEditUser={handleEditUser}
                  onDeleteUser={handleDeleteUser}
                  onSelect={() => setSelectedGroupId(selectedGroup.id)}
                />
              ) : (
                pagedGroups.map(g => (
                  <GroupPanel
                    key={g.id}
                    group={g}
                    members={users.filter(u => g.users?.includes(u.id))}
                    onRemoveUser={(uid, group) => handleRemoveUserFromGroup(uid, group)}
                    onDropUser={(uid, group) => handleDropUserToGroup(uid, group)}
                    selected={false}
                    onEditGroup={beginEditGroup}
                    onDeleteGroup={group => deleteGroupWithType(group)}
                    onEditUser={handleEditUser}
                    onDeleteUser={handleDeleteUser}
                    onSelect={() => setSelectedGroupId(g.id)}
                  />
                ))
              )}
          </div>
          <div className="mt-10 mb-2 flex items-center justify-between">
            <h3 className="font-bold text-blue-700 text-xl">
              {search ? 'Filtered Users' : 'All Users'}
              <span className="text-sm font-normal text-gray-600 ml-2">
                ({filteredUsers.length} total)
              </span>
            </h3>
          </div>
          <div className="bg-white rounded-xl shadow p-4 overflow-x-auto">
            <div className="w-full min-w-[320px]">
              {pagedUsers.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-gray-400 text-lg">
                    {search ? `No users found matching "${search}"` : 'No users found.'}
                  </div>
                  {search && (
                    <button
                      onClick={() => setSearch('')}
                      className="mt-3 text-blue-600 hover:text-blue-800 underline"
                    >
                      Clear search
                    </button>
                  )}
                </div>
              ) : (
                pagedUsers.map(u => (
                  <div key={u.id} className="flex items-center border-b py-1 gap-2">
                    <span className="font-medium">{u.username}</span>
                    <span className="text-xs text-gray-400">{u.email}</span>
                    <span className="flex gap-1 flex-wrap ml-2">
                      {allGroups.filter(g => g.users?.includes(u.id)).map(g => (
                        <span
                          key={g.id}
                          className={`inline-block bg-blue-200 text-blue-800 rounded px-2 py-0.5 text-xs font-semibold`}
                        >{g.name}</span>
                      ))}
                    </span>
                  </div>
                ))
              )}
            </div>
            {/* Pagination */}
            <div className="flex gap-2 justify-center mt-2">
              <button
                className="px-2 py-1 rounded text-blue-700 border"
                disabled={userPage === 1}
                onClick={() => setUserPage(p => Math.max(1, p - 1))}
              >
                Prev
              </button>
              <span className="text-sm pt-1">
                Page {userPage}/{totalUserPages}
              </span>
              <button
                className="px-2 py-1 rounded text-blue-700 border"
                disabled={userPage === totalUserPages}
                onClick={() => setUserPage(p => Math.min(totalUserPages, p + 1))}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </DndProvider>
  );
}
