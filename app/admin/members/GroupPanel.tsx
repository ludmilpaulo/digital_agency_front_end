import React, { useRef, useEffect } from "react";
import { useDrop } from "react-dnd";
import { Group } from "@/redux/services/groupsApi";
import { User } from "@/redux/services/usersApi";
import UserCard from "./UserCard";
import { FaTrashAlt, FaEdit } from "react-icons/fa";

interface Props {
  group: Group;
  members: User[];
  onRemoveUser: (userId: number, group: Group) => void | Promise<void>;
  onDropUser: (userId: number, group: Group) => void | Promise<void>;
  onEditGroup: (group: Group) => void;
  onDeleteGroup: (group: Group) => void;
  selected: boolean;
  onSelect: () => void;
}

const GroupPanel: React.FC<Props> = ({
  group,
  members = [],
  onRemoveUser,
  onDropUser,
  onEditGroup,
  onDeleteGroup,
  selected,
  onSelect,
}) => {
  const ref = useRef<HTMLDivElement | null>(null);

  const [{ isOver, canDrop }, drop] = useDrop<
    { userId: number },
    void,
    { isOver: boolean; canDrop: boolean }
  >({
    accept: "USER",
    drop: (item) => {
      void onDropUser(item.userId, group);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  // Attach the drop target to the DOM node via ref
  useEffect(() => {
    if (ref.current) {
      drop(ref.current);
    }
  }, [drop]);

  return (
    <div
      ref={ref}
      className={`w-full md:w-[320px] min-h-[260px] bg-white rounded-xl shadow border-2 mb-4 transition
        ${isOver && canDrop ? "border-blue-600 ring-2 ring-blue-200" : "border-blue-100"}
        flex flex-col relative ${selected ? "ring-4 ring-blue-300" : ""}`}
      onClick={onSelect}
      style={{ cursor: "pointer" }}
      data-group-id={group.id}
    >
      <div className="flex items-center justify-between border-b px-4 py-2 bg-blue-50 rounded-t-xl">
        <span className="font-bold text-blue-700 truncate">{group.name}</span>
        <div className="flex gap-1">
          <button
            className="text-blue-500 hover:text-blue-700"
            onClick={(e) => {
              e.stopPropagation();
              onEditGroup(group);
            }}
            title="Edit Group"
          >
            <FaEdit />
          </button>
          <button
            className="text-red-400 hover:text-red-700"
            onClick={(e) => {
              e.stopPropagation();
              onDeleteGroup(group);
            }}
            title="Delete Group"
          >
            <FaTrashAlt />
          </button>
        </div>
      </div>
      <div className="flex-1 p-3 flex flex-col gap-2">
        {(!members || members.length === 0) && (
          <div className="text-xs text-gray-400">No members in this group</div>
        )}
        {members?.map((user) => (
          <UserCard
            key={user.id}
            user={user}
            groups={[group]}
            draggable={false}
            onRemove={() => onRemoveUser(user.id, group)}
          />
        ))}
      </div>
      <span className="absolute bottom-2 right-4 text-xs text-gray-400">
        {members?.length ?? 0} member{members?.length === 1 ? "" : "s"}
      </span>
    </div>
  );
};

export default GroupPanel;
