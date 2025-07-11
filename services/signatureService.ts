import api from "@/useAPI/api";


export interface SignaturePayload {
  documentId: number;
  signatureImage: Blob;
  x: number;
  y: number;
  pageNumber: number;
  userId: number;
  renderWidth: number;
  renderHeight: number;
}
export interface SignatureResponse {
  id: number;
  document: number;
  signature_url: string;
  x: number;
  y: number;
  page_number: number;
  signed_at: string;
}

export const submitSignature = async (payload: SignaturePayload): Promise<SignatureResponse> => {
  const formData = new FormData();
  formData.append("document", payload.documentId.toString());
  formData.append("signature_image", payload.signatureImage, "signature.png");
  formData.append("x", payload.x.toString());
  formData.append("y", payload.y.toString());
  formData.append("page_number", payload.pageNumber.toString());
  formData.append("user_id", payload.userId.toString());


  const response = await api.post<SignatureResponse>("/doc/signatures/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data;
};
