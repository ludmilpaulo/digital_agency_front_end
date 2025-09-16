"use client";
import React, { useState, useMemo, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "@/redux/slices/authSlice";

import {
  useGetTasksQuery,
  useDeleteTaskMutation,
  useUpdateTaskMutation,
} from "@/redux/services/tasksApi";
import { useGetBoardsQuery } from "@/redux/services/boardsApi";
import { useGetUsersQuery } from "@/redux/services/usersApi";

import AddTaskModal from "./tasks/AddTaskModal";
import { Card, User, Task, Board } from "@/types/tasks";
import { format, isToday, isThisWeek, parseISO } from "date-fns";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { Plus, UserCircle2, Flag, Trash2, CheckCircle, ChevronDown, ChevronUp } from "lucide-react";
import clsx from "clsx";
import TaskNotes from "./tasks/TaskNotes";

type MyTasksProps = {
  /** Optional tasks to render; if provided, MyTasks will not fetch */
  tasks?: Task[];
};

// Helper color maps
const statusColors: Record<Task["status"], string> = {
  "Not Started": "bg-gray-300 text-gray-700",
  "In Progress": "bg-blue-200 text-blue-800",
  "Completed": "bg-green-200 text-green-800",
  "Failed": "bg-red-200 text-red-800",
  "Reassigned": "bg-orange-200 text-orange-800",
};
const priorityColors: Record<string, string> = {
  Low: "bg-gray-100 text-gray-500",
  Medium: "bg-blue-100 text-blue-600",
  High: "bg-orange-100 text-orange-600",
  Urgent: "bg-red-100 text-red-600",
};

// Group tasks by due date
function groupTasks(tasks: Task[]) {
  const today: Task[] = [];
  const week: Task[] = [];
  const others: Task[] = [];
  for (const task of tasks) {
    if (!task.due_date) {
      others.push(task);
    } else if (isToday(parseISO(task.due_date))) {
      today.push(task);
    } else if (isThisWeek(parseISO(task.due_date), { weekStartsOn: 1 })) {
      week.push(task);
    } else {
      others.push(task);
    }
  }
  return { today, week, others };
}

export default function MyTasks({ tasks: tasksProp }: MyTasksProps) {
  const user = useSelector(selectUser);

  const { data: users = [] } = useGetUsersQuery();
  const { data: boards = [] } = useGetBoardsQuery({});

  const [showAdd, setShowAdd] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [assignee, setAssignee] = useState<number | "all" | "">("all");
  const [search, setSearch] = useState("");
  const [showOnlyMine, setShowOnlyMine] = useState(true);

  // If parent passed tasks, skip fetching
  const shouldSkipFetch = !!tasksProp || !user;

  const { data: tasksQuery = [], isLoading } = useGetTasksQuery(
    showOnlyMine && user ? { user_id: user.user_id || user.id } : undefined,
    { skip: shouldSkipFetch }
  );

  // Choose source of truth
  const baseTasks: Task[] = tasksProp ?? tasksQuery;

  const [deleteTask] = useDeleteTaskMutation();
  const [updateTask] = useUpdateTaskMutation();

  // FILTERS
  const filtered = useMemo(() => {
    return baseTasks.filter(
      (t) =>
        (!search || t.title.toLowerCase().includes(search.toLowerCase())) &&
        (assignee === "all" ||
          !assignee ||
          t.assignees?.some((u: User) => u.id === assignee))
    );
  }, [baseTasks, search, assignee]);

  // GROUP
  const { today, week, others } = useMemo(() => groupTasks(filtered), [filtered]);

  // DnD state
  const [dragged, setDragged] = useState<{ today: Task[]; week: Task[]; others: Task[] }>({
    today,
    week,
    others,
  });

  // Keep DnD in sync when data changes
  useEffect(() => {
    setDragged({ today, week, others });
  }, [today, week, others]);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const srcSection = result.source.droppableId as keyof typeof dragged;
    const destSection = result.destination.droppableId as keyof typeof dragged;

    const srcTasks = [...dragged[srcSection]];
    const destTasks = srcSection === destSection ? srcTasks : [...dragged[destSection]];

    const [moved] = srcTasks.splice(result.source.index, 1);
    destTasks.splice(result.destination.index, 0, moved);

    setDragged({
      ...dragged,
      [srcSection]: srcSection === destSection ? destTasks : srcTasks,
      [destSection]: destTasks,
    });

    // TODO: persist reordering via API if needed
    // updateTask({ id: moved.id, data: { order: result.destination.index } });
  };

  const handleMarkComplete = async (id: number) => {
    await updateTask({ id, data: { status: "Completed" } });
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      await deleteTask(id);
    }
  };

  function TaskCard({
    task,
    index,
    expanded,
    onToggle,
  }: {
    task: Task;
    index: number;
    expanded: boolean;
    onToggle: () => void;
  }) {
    return (
      <Draggable draggableId={String(task.id)} index={index}>
        {(provided) => (
          <div
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            className={clsx(
              "bg-white border rounded-xl shadow group transition-all mb-2",
              expanded ? "ring-2 ring-blue-200" : "hover:border-blue-400"
            )}
          >
            <div
              className="flex items-center justify-between px-4 py-2 cursor-pointer"
              onClick={onToggle}
            >
              <div className="flex flex-col gap-1">
                <div className="font-bold text-blue-900 flex items-center gap-2 text-base">
                  <span>{task.title}</span>
                  <span
                    className={clsx(
                      "rounded px-2 py-0.5 text-xs font-medium ml-1",
                      statusColors[task.status]
                    )}
                  >
                    {task.status}
                  </span>
                  {task.priority && (
                    <span
                      className={clsx(
                        "rounded px-2 py-0.5 text-xs font-medium",
                        priorityColors[task.priority || "Medium"]
                      )}
                    >
                      <Flag size={14} className="inline-block mr-1" />
                      {task.priority}
                    </span>
                  )}
                </div>
                {task.due_date && (
                  <div className="text-xs text-gray-500">
                    Due: {format(parseISO(task.due_date), "PPPP")}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                {task.status !== "Completed" && (
                  <button
                    title="Mark Complete"
                    className="rounded-full p-2 hover:bg-green-100 transition"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMarkComplete(task.id);
                    }}
                  >
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </button>
                )}
                <button
                  title="Delete"
                  className="rounded-full p-2 hover:bg-red-100 transition"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(task.id);
                  }}
                >
                  <Trash2 className="w-5 h-5 text-red-600" />
                </button>
                <button
                  className="ml-2 text-blue-600 hover:text-blue-900 transition"
                  aria-label="Expand"
                >
                  {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
              </div>
            </div>
            {expanded && (
              <div className="px-4 pb-3 pt-1 border-t animate-fadeIn">
                {task.description && (
                  <div className="text-sm mb-2 text-gray-700">{task.description}</div>
                )}
                <div className="flex items-center gap-2 mb-2">
                  {task.assignees?.length ? (
                    task.assignees.map((u: User) => (
                      <span
                        key={u.id}
                        className="flex items-center gap-1 bg-blue-50 px-2 rounded-full text-xs font-semibold text-blue-700 border"
                      >
                        <UserCircle2 size={15} className="inline-block" />
                        {u.username}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-gray-400">No assignee</span>
                  )}
                </div>
                <TaskNotes cardId={task.id} />
              </div>
            )}
          </div>
        )}
      </Draggable>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-2 py-8 relative">
      {/* Floating Add Task Button */}
      <button
        className="fixed bottom-8 right-8 bg-blue-700 hover:bg-blue-900 text-white px-5 py-3 rounded-full shadow-lg flex items-center gap-2 z-40 transition"
        onClick={() => setShowAdd(true)}
        title="Add new task"
      >
        <Plus size={22} /> <span className="font-semibold text-base">Add Task</span>
      </button>

      <AddTaskModal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        users={users}
        boards={boards as unknown as Board[]}
        onCreated={() => {
          // optionally refetch or toast
        }}
      />

      <div className="flex flex-col md:flex-row gap-4 md:gap-0 items-center justify-between mb-6">
        <h2 className="text-3xl font-extrabold text-blue-900 tracking-tight">My Tasks</h2>
        <div className="flex gap-2 w-full md:w-auto">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded px-3 py-2 text-sm bg-blue-50 w-full md:w-72 shadow"
            placeholder="Search by title..."
          />
          <select
            className="border rounded px-2 py-2 text-sm bg-white"
            value={assignee}
            onChange={(e) =>
              setAssignee(e.target.value === "all" ? "all" : Number(e.target.value))
            }
          >
            <option value="all">All Assignees</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.username}
              </option>
            ))}
          </select>
          <button
            className={clsx(
              "px-4 py-2 rounded border font-semibold",
              showOnlyMine
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-blue-700 border-blue-400"
            )}
            onClick={() => setShowOnlyMine((v) => !v)}
          >
            {showOnlyMine ? "Show All Tasks" : "Show Only My Tasks"}
          </button>
        </div>
      </div>

      {(!tasksProp && isLoading) && (
        <div className="text-blue-700 font-medium text-center p-6">Loading tasks…</div>
      )}

      <DragDropContext onDragEnd={onDragEnd}>
        {/* Today */}
        <Droppable droppableId="today">
          {(provided) => (
            <section className="mb-8" ref={provided.innerRef} {...provided.droppableProps}>
              <div className="flex items-center gap-2 mb-2 font-bold text-blue-700 text-lg">
                <span>Today</span>
                <span className="bg-blue-100 text-blue-600 px-2 rounded text-xs">
                  {dragged.today.length}
                </span>
              </div>
              <div className="space-y-3">
                {dragged.today.length === 0 && (
                  <div className="text-xs text-gray-400 pl-2">No tasks for today.</div>
                )}
                {dragged.today.map((task, i) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    index={i}
                    expanded={expandedId === task.id}
                    onToggle={() => setExpandedId(expandedId === task.id ? null : task.id)}
                  />
                ))}
                {provided.placeholder}
              </div>
            </section>
          )}
        </Droppable>

        {/* Week */}
        <Droppable droppableId="week">
          {(provided) => (
            <section className="mb-8" ref={provided.innerRef} {...provided.droppableProps}>
              <div className="flex items-center gap-2 mb-2 font-bold text-blue-700 text-lg">
                <span>This Week</span>
                <span className="bg-blue-100 text-blue-600 px-2 rounded text-xs">
                  {dragged.week.length}
                </span>
              </div>
              <div className="space-y-3">
                {dragged.week.length === 0 && (
                  <div className="text-xs text-gray-400 pl-2">No tasks this week.</div>
                )}
                {dragged.week.map((task, i) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    index={i}
                    expanded={expandedId === task.id}
                    onToggle={() => setExpandedId(expandedId === task.id ? null : task.id)}
                  />
                ))}
                {provided.placeholder}
              </div>
            </section>
          )}
        </Droppable>

        {/* Others */}
        <Droppable droppableId="others">
          {(provided) => (
            <section ref={provided.innerRef} {...provided.droppableProps}>
              <div className="flex items-center gap-2 mb-2 font-bold text-blue-700 text-lg">
                <span>Other Tasks</span>
                <span className="bg-blue-100 text-blue-600 px-2 rounded text-xs">
                  {dragged.others.length}
                </span>
              </div>
              <div className="space-y-3">
                {dragged.others.length === 0 && (
                  <div className="text-xs text-gray-400 pl-2">Nothing else pending!</div>
                )}
                {dragged.others.map((task, i) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    index={i}
                    expanded={expandedId === task.id}
                    onToggle={() => setExpandedId(expandedId === task.id ? null : task.id)}
                  />
                ))}
                {provided.placeholder}
              </div>
            </section>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
