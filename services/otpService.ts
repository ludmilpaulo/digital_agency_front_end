import api from "@/useAPI/api";

;


export const sendOtp = async (email: string) => {
  const response = await api.post("send-otp/", { email });
  return response.data;
};

export const verifyOtp = async (email: string, code: string) => {
  const response = await api.post("verify-otp/", { email, code });
  return response.data;
};
