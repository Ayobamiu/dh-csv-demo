export interface PatientData {
  data: PatientRecord[];
  fileName: string;
  created: number;
  id: string;
  headerMap: Record<string, string>;
}

export interface PatientRecord {
  ehrId: string;
  patientName: string;
  email?: string;
  phone?: string;
  referringProvider?: string;
  syncStatus?: "pending" | "synced" | "error";
  isValid?: boolean;
}
