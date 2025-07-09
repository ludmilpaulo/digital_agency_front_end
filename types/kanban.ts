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
