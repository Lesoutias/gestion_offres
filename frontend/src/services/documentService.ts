import { apiClient } from "./api";
import { DocumentResponse, DocumentType } from "../types";

class DocumentService {
  async uploadDocument(
    applicationId: number,
    file: File,
    document_type: DocumentType,
  ): Promise<DocumentResponse> {
    try {
      const response = await apiClient.uploadFile<DocumentResponse>(
        `/applications/${applicationId}/documents`,
        file,
        { document_type },
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getDocuments(applicationId: number): Promise<DocumentResponse[]> {
    try {
      const response = await apiClient.get<DocumentResponse[]>(
        `/applications/${applicationId}/documents`,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async deleteDocument(documentId: number): Promise<void> {
    try {
      await apiClient.delete(`/documents/${documentId}`);
    } catch (error) {
      throw error;
    }
  }
}

export const documentService = new DocumentService();
export default documentService;
