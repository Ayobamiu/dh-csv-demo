import React from "react";
import { FileText, FolderOpen } from "lucide-react";
import { PatientData } from "../app/utils/types";
import { formatDate } from "@/app/utils/formatter";

interface DocumentCardListProps {
  documents: PatientData[];
}

const DocumentCardList: React.FC<DocumentCardListProps> = ({ documents }) => {
  if (documents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center text-gray-500 border border-dashed rounded-2xl">
        <FolderOpen className="w-12 h-12 mb-4 text-gray-400" />
        <h3 className="text-lg font-medium text-gray-700">
          No documents uploaded yet
        </h3>
        <p className="text-sm mt-1">Upload a CSV to get started.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {documents.map((doc) => (
        <div
          key={doc.id}
          className="flex items-center gap-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition p-4"
        >
          <div className="bg-blue-100 text-blue-600 p-3 rounded-xl">
            <FileText className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-gray-800 truncate">
              {doc.fileName}
            </h3>
            <p className="text-sm text-gray-500">
              Uploaded on {formatDate(doc.created)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DocumentCardList;
