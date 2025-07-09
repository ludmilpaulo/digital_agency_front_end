import { Group } from "@/types/groups";
import api from "@/useAPI/api";


export const fetchGroups = () => api.get<Group[]>('/account/groups/');
export const createGroup = (data: Omit<Group, 'id'>) => api.post<Group>('/account/groups/', data);
export const updateGroup = (id: number, data: Partial<Group>) => api.put<Group>(`/account/groups/${id}/`, data);
export const deleteGroup = (id: number) => api.delete<void>(`/account/groups/${id}/`);
