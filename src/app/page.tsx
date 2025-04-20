"use client";

import FileUpload from "@/components/FileUpload";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { PatientData } from "./utils/types";
import { FolderOpen } from "lucide-react";
import { SyncOutlined } from "@ant-design/icons";
import { Button } from "antd";
import PatientTable from "@/components/PatientTable";

export default function Home() {
  const [patientData, setPatientData] = useState<PatientData | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("patientData");
    if (saved) {
      setPatientData(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (patientData) {
      localStorage.setItem("patientData", JSON.stringify(patientData));
    }
  }, [patientData]);

  const handleFileProcessed = (data: PatientData) => {
    if (data.data && data.data.length > 0) {
      setPatientData(data);
    }
  };

  const clearData = () => {
    localStorage.removeItem("patientData");
    setPatientData(null);
  };

  const uplaodTitle = patientData !== null ? "Change CSV" : "Uplaod CSV";

  return (
    <div className="min-h-screen ">
      <Toaster />
      <div className="container mx-auto p-4 pt-8">
        <div className="flex justify-between items-center">
          <header className="mb-6">
            <h1 className="text-3xl font-bold text-black mb-2">
              Patient Data Management
            </h1>
            <p className="text-gray-600">
              Upload, edit and manage patient records
            </p>
          </header>
          <div className="flex gap-4">
            <FileUpload
              onFileProcessed={handleFileProcessed}
              title={uplaodTitle}
            />

            <Button
              size="large"
              onClick={clearData}
              icon={<SyncOutlined />}
              type="dashed"
            >
              Reset Data
            </Button>
            <Button
              // disabled={patientData === undefined}
              disabled
              size="large"
              icon={<SyncOutlined />}
              type="primary"
            >
              Sync to CRM
            </Button>
          </div>
        </div>

        {patientData ? (
          <PatientTable
            data={patientData.data}
            onDataUpdate={(updatedRows) => {
              const updatedPatientData = {
                ...patientData,
                data: updatedRows,
              };
              setPatientData(updatedPatientData);
            }}
            fileName={patientData.fileName}
          />
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center text-gray-500 border border-dashed rounded-2xl">
            <FolderOpen className="w-12 h-12 mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-700">
              No documents uploaded yet
            </h3>
            <p className="text-sm mt-1">Upload a CSV to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}
