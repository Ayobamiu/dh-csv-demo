"use client";

import React, { useState } from "react";
import { UploadOutlined } from "@ant-design/icons";
import { Button, Upload } from "antd";
import { v4 as uuidv4 } from "uuid";
import toast from "react-hot-toast";
import { PatientData, PatientRecord } from "../app/utils/types";
const expectedHeaders = [
  "EHR ID",
  "Patient Name",
  "Email",
  "Phone",
  "Referring Provider",
];

interface FileUploadInterface {
  onFileProcessed: (params: PatientData) => void;
  title: string;
}

const FileUpload = ({ onFileProcessed, title }: FileUploadInterface) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const processCSV = async (text: string, fileName: string) => {
    setIsProcessing(true);
    try {
      const result = parseCSV(text);
      // Validate headers
      const missingHeaders = expectedHeaders.filter(
        (header) => !Object.values(result.headerMap).includes(header)
      );

      if (missingHeaders.length > 0) {
        toast.error(`Missing required headers: ${missingHeaders.join(", ")}`);
        return;
      }

      if (result.data && result.data.length > 0) {
        onFileProcessed({
          data: result.data as unknown as PatientRecord[],
          fileName,
          created: Date.now(),
          headerMap: result.headerMap,
          id: uuidv4(),
        });
        toast.success(`${result.data.length} records loaded successfully`);
      } else {
        toast.error("No valid data found in the CSV file");
      }
    } catch (error) {
      toast.error("Failed to process the CSV file");
    } finally {
      setIsProcessing(false);
    }
  };

  const toCamelCase = (str: string) => {
    return str
      .toLowerCase()
      .replace(/[^a-zA-Z0-9 ]/g, "") // remove special characters
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) =>
        index === 0 ? word.toLowerCase() : word.toUpperCase()
      )
      .replace(/\s+/g, "");
  };

  const parseCSV = (csvText: string) => {
    const lines = csvText.split("\n").filter((line) => line.trim() !== "");

    const rawHeaders = lines[0].split(",").map((header) => header.trim());
    const camelCaseHeaders = rawHeaders.map(toCamelCase);

    const headerMap = camelCaseHeaders.reduce((acc, original, index) => {
      acc[original] = rawHeaders[index];
      return acc;
    }, {} as Record<string, string>); // e.g {"camelCaseHeaders":"Camel Case Headers"}

    const data = lines.slice(1).map((line) => {
      const values = line.split(",").map((value) => value.trim());
      const rowData: Record<string, string> = {};

      camelCaseHeaders.forEach((camelHeader, index) => {
        rowData[camelHeader] = values[index] || "";
      });

      return rowData;
    });

    return { data, headerMap };
  };

  const beforeUpload = (file: File) => {
    const reader = new FileReader();
    const isCSV = file.type === "text/csv";
    if (!isCSV) {
      toast.error(`${file.name} is not a csv file`);
      return false;
    }
    reader.onload = (e) => {
      setIsProcessing(true);
      const text = e.target?.result as string;
      processCSV(text, file.name);
    };

    reader.readAsText(file);

    reader.onloadend = () => {
      setIsProcessing(false);
    };

    return false;
  };

  return (
    <Upload
      beforeUpload={beforeUpload}
      showUploadList={false}
      disabled={isProcessing}
      accept=".csv"
    >
      <Button disabled={isProcessing} size="large" icon={<UploadOutlined />}>
        {isProcessing ? "Processing..." : title}
      </Button>
    </Upload>
  );
};

export default FileUpload;
