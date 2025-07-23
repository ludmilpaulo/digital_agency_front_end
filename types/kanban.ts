export interface User {
  id: number;
  username: string;
  email: string;
}
export type TaskStatus = "Not Started" | "In Progress" | "Completed";
export interface Card {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  list: number;
  assignees: User[];
  image: string | null;
  start_date: string | null;
  due_date: string | null;
}
export interface List {
  id: number;
  name: string;
  board: number;
  cards: Card[];
}
export interface Board {
  id: number;
  name: string;
  description: string;
  users: User[];
  managers: User[];
  status: string;
  lists: List[];
}

export interface BoardFields {
  name: string;
  description: string;
  development_link: string;
  repository_link: string;
  client_link: string;
  sample_link: string;
  managers_ids: number[];
  users_ids: number[];
  budget: string;        // Always as string for form input, can parse to number before sending API
  budget_used: string;
  deadline: string;
  start_date: string;
  end_date: string;
  status: string;
}
