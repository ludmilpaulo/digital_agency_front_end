
import { Invite } from '@/types/invite';
import api, { baseAPI } from '@/useAPI/api';

export const getSentInvites = async (): Promise<Invite[]> => {
  const res = await api.get(`${baseAPI}/doc/invites/`);
  return res.data;
};

export const resendInvite = async (inviteId: number): Promise<void> => {
  await api.post(`${baseAPI}/doc/invites/${inviteId}/resend/`);
};

// inviteService.ts
export const sendInvite = async (payload: { email: string; documentId: number; user_id: number }) => {
  return await api.post(`${baseAPI}/doc/send-invite/`, payload);
};
