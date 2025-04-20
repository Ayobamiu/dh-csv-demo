import { PatientData } from "./types";

export async function syncPatientsToCRM(
  patients: PatientData[]
): Promise<void> {
  // API call
  console.log("Syncing to CRM...", patients);
}
