// /useAPI/tasksApi.ts
import axios from "axios";
import { User, Board, List, Card } from "@/types/tasks";
import { baseAPI } from "./api";

const BASE_API = `${baseAPI}/task`;

export async function fetchListsByUser(userId: number): Promise<List[]> {
  const { data } = await axios.get<List[]>(`${BASE_API}/lists/?user_id=${userId}`);
  return data;
}

export const tasksApi = axios.create({
  baseURL: `${BASE_API}/`,
  headers: { "Content-Type": "application/json" },
});

// -------- TYPES --------

// CardStatus (sync with Django Card.status choices)
export type TaskStatus = "Not Started" | "In Progress" | "Completed";

// -------- BOARDS --------

export const fetchBoards = async (): Promise<Board[]> => {
  const { data } = await tasksApi.get<Board[]>("boards/");
  return data;
};

export const addBoard = async (board: Partial<Board>): Promise<Board> => {
  const { data } = await tasksApi.post<Board>("boards/", board);
  return data;
};

export const updateBoard = async (
  id: number,
  board: Partial<Board>
): Promise<Board> => {
  const { data } = await tasksApi.patch<Board>(`boards/${id}/`, board);
  return data;
};

export const deleteBoard = async (id: number) => {
  await tasksApi.delete(`boards/${id}/`);
};

// -------- LISTS --------

export const fetchLists = async (
  boardId?: number
): Promise<List[]> => {
  let url = "lists/";
  if (boardId) url += `?board=${boardId}`;
  const { data } = await tasksApi.get<List[]>(url);
  return data;
};

export const addList = async (list: Partial<List>): Promise<List> => {
  const { data } = await tasksApi.post<List>("lists/", list);
  return data;
};

export const updateList = async (
  id: number,
  list: Partial<List>
): Promise<List> => {
  const { data } = await tasksApi.patch<List>(`lists/${id}/`, list);
  return data;
};

export const deleteList = async (id: number) => {
  await tasksApi.delete(`lists/${id}/`);
};

// -------- CARDS (TASKS) --------

interface FetchCardsParams {
  listId?: number;
  userId?: number;
  status?: TaskStatus;
  boardId?: number;
}

export async function fetchCardsByUser(userId: number): Promise<Card[]> {
  const { data } = await axios.get<Card[]>(`${baseAPI}/cards/?user_id=${userId}`);
  return data;
}

export const fetchCards = async (
  params: FetchCardsParams = {}
): Promise<Card[]> => {
  let url = "cards/?";
  if (params.listId) url += `list=${params.listId}&`;
  if (params.userId) url += `user_id=${params.userId}&`;
  if (params.status) url += `status=${encodeURIComponent(params.status)}&`;
  if (params.boardId) url += `board_id=${params.boardId}&`;
  url = url.replace(/&$/, "");
  const { data } = await tasksApi.get<Card[]>(url);
  return data;
};

export const addCard = async (card: Partial<Card>): Promise<Card> => {
  const { data } = await tasksApi.post<Card>("cards/", card);
  return data;
};

export const updateCard = async (
  id: number,
  card: Partial<Card>
): Promise<Card> => {
  const { data } = await tasksApi.patch<Card>(`cards/${id}/`, card);
  return data;
};

export const deleteCard = async (id: number) => {
  await tasksApi.delete(`cards/${id}/`);
};

// Assign task to one or more users (assuming assignees is a list field)
export const assignTaskToUser = async (
  cardId: number,
  userIds: number[]
): Promise<Card> => {
  const { data } = await tasksApi.patch<Card>(`cards/${cardId}/`, {
    assignees: userIds,
  });
  return data;
};

// Update status
export const updateTaskStatus = async (
  cardId: number,
  status: TaskStatus
): Promise<Card> => {
  const { data } = await tasksApi.patch<Card>(`cards/${cardId}/`, { status });
  return data;
};

// -------- USERS --------

export const fetchUsers = async (): Promise<User[]> => {
  const { data } = await tasksApi.get<User[]>("users/");
  return data;
};
