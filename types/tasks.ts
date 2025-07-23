export type TaskStatus = "To Do" | "Not Started" | "In Progress" | "Completed";

export interface User {
  id: number;
  username: string;
  email: string;
 // user_id: number;
}

export interface Card {
  id: number;
  title: string;
  description: string;
  status: "Not Started" | "In Progress" | "Completed";
  assignedTo?: number[];     // must match API
  startDate?: string;
  dueDate?: string;
  [key: string]: any; 
  image: string | null;
}

export interface List {
  id: number;
  name: string;
  board: number;
  cards?: Card[];
}

export interface Board {
  id: number;
  name: string;
  description: string;
  users: User[];
  managers: User[];
  status: string;
  lists: List[];
  development_link?: string;
  repository_link?: string;
  client_link?: string;
  sample_link?: string;
  budget?: number;
  budget_used?: number;
  deadline?: string;
  start_date?: string;
  end_date?: string;
}


export interface Task {
  id: number;
  title: string;
  description?: string;          // <--- add this!
  status: "Not Started" | "In Progress" | "Completed" | "Failed" | "Reassigned";
  list?: number | { id: number; name: string };
  assignees: User[];
  assignees_ids?: number[];      // <--- needed for create/update!
  image?: string | null;
  start_date?: string | null;
  due_date?: string | null;
  [key: string]: any;
}

// types/tasks.ts
export interface TaskComment {
  id: number;
  card: number;
  user: User;
  text: string;
  amount?: number | null;
  created?: string;
}
