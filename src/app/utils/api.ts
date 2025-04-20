import { PatientData } from "./types";
export const api = {
  syncToCRM: async (_: PatientData): Promise<{ success: boolean }> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate random failure
        const success = Math.random() > 0.2;
        if (success) {
          resolve({ success: true });
        } else {
          reject(new Error("Failed to sync with CRM."));
        }
      }, 1500);
    });
  },
};
