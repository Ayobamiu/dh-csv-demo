"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FolderOpen } from "lucide-react";
import { Button } from "antd";
import { SyncOutlined } from "@ant-design/icons";

import PatientTable from "@/components/PatientTable";
import FileUpload from "@/components/FileUpload";

import { PatientData } from "./utils/types";
import { api } from "./utils/api";

const Home = () => {
  const [patientData, setPatientData] = useState<PatientData | null>(null);

  const [syncing, setSyncing] = useState(false);

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
    if (confirm("Are you sure you want to reset the data?")) {
      localStorage.removeItem("patientData");
      setPatientData(null);
    }
  };

  const handleSync = async () => {
    if (!patientData) return;

    setSyncing(true);
    toast.loading("Syncing to CRM...", { id: "crmSync" });

    try {
      await api.syncToCRM(patientData);
      toast.success("Synced to CRM successfully!", { id: "crmSync" });
    } catch (error) {
      toast.error("Sync failed. Please try again.", { id: "crmSync" });
    } finally {
      setSyncing(false);
    }
  };

  const uploadTitle = patientData !== null ? "Change CSV" : "Upload CSV";

  return (
    <div className="min-h-screen ">
      <div className="container mx-auto p-4 pt-8">
        <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
          <header className="">
            <h1 className="text-3xl font-bold text-black mb-2">
              Patient Data Management
            </h1>
            <p className="text-gray-600">
              Upload, edit and manage patient records
            </p>
          </header>
          <div className="flex gap-4 ">
            <FileUpload
              onFileProcessed={handleFileProcessed}
              title={uploadTitle}
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
              disabled={
                !patientData || patientData.data.length === 0 || syncing
              }
              size="large"
              icon={<SyncOutlined spin={syncing} />}
              type="primary"
              onClick={handleSync}
            >
              {syncing ? "Syncing..." : "Sync to CRM"}
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
};
export default Home;
