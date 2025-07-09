// utils/mapTaskToCard.ts
import type { Task, Card } from "@/types/tasks";

export function mapTaskToCard(task: Task): Card {
  return {
    ...task, // spread all task fields first

    // Now override/normalize as needed:
    id: task.id,
    title: task.title,
    description: "", // fallback (or task.description if available)
    status: "Not Started", // fallback (replace if your task has a status)
    assignedTo: (task.assignees ?? []).map((u) => u.id),
    startDate: task.start_date ?? undefined,
    dueDate: task.due_date ?? undefined,
    image: null, // fallback (or use task.image if available)
  };
}

export function mapTasksToCards(tasks: Task[]): Card[] {
  return tasks.map(mapTaskToCard);
}
