export interface User {
  id: string;
  email: string;
  name: string;
  role: "user" | "admin";
  created_at: Date;
}

export interface EmergencyForm {
  id: string;
  user_id: string;
  title: string;
  blood_type?: string;
  allergies?: string;
  medications?: string;
  emergency_contacts: EmergencyContact[];
  documents: Document[];
  status: "active" | "inactive" | "archived";
  created_at: Date;
  updated_at: Date;
}

export interface EmergencyContact {
  id?: string;
  name: string;
  relationship: string;
  phone: string;
  email?: string;
}

export interface Document {
  id?: string;
  name: string;
  type: string;
  data: string; // base64 encoded
  uploaded_at?: Date;
}

export interface AnalyticsLog {
  id: string;
  user_id: string;
  action: string;
  created_at: Date;
}

export interface Report {
  total: number;
  bloodTypeDistribution: Array<{
    blood_type: string;
    count: number;
  }>;
  recentForms: Array<{
    id: string;
    title: string;
    created_at: string;
  }>;
}
