import { DocumentModel } from "./document.schema.js";

export default class DocumentRepository {
  async saveDocument(data) {
    return await DocumentModel.create(data);
  }

  async getDocumentsByUser(userId) {
    return await DocumentModel.find({ "uploadedBy.id": userId });
  }

  async searchDocuments(query, userId) {
    return await DocumentModel.find({
      "uploadedBy.id": userId,
    //   $or: [
    //     { fileName: { $regex: query, $options: "i" } },
    //     { fileText: { $regex: query, $options: "i" } },
    //   ],
    fileName: { $regex: query, $options: "i" }, // only search fileName
    });
  }

  async deleteDocument(fileName) {
    return await DocumentModel.findOneAndDelete({ fileName });
  }

  async getDocumentByName(fileName) {
    return await DocumentModel.findOne({ fileName });
  }
}
