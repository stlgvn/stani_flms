export type JobStatus = "queued" | "processing" | "done" | "failed" | "expired";
export type JobStrength = "light" | "medium" | "strong";

export interface Job {
  id: string;
  status: JobStatus;
  strength: JobStrength;
  original_name: string;
  output_path: string | null;
  progress: number;
  error: string | null;
  created_at: string;
  expires_at: string | null;
}

export const JOB_COLUMNS = "id,status,strength,original_name,output_path,progress,error,created_at,expires_at";
