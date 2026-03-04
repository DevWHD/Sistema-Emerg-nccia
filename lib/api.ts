export interface EmergencyForm {
  id: string;
  user_id: string;
  title: string;
  blood_type: string;
  allergies: string;
  medications: string;
  emergency_contacts: any[];
  documents: any[];
  status: string;
  created_at: string;
  updated_at: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
}

export interface Document {
  name: string;
  type: string;
  data: string; // base64
}

// Forms
export async function getForms(): Promise<EmergencyForm[]> {
  const res = await fetch("/api/forms");
  if (!res.ok) throw new Error("Erro ao buscar formulários");
  return res.json();
}

export async function getForm(id: string): Promise<EmergencyForm> {
  const res = await fetch(`/api/forms/${id}`);
  if (!res.ok) throw new Error("Erro ao buscar formulário");
  return res.json();
}

export async function createForm(data: Partial<EmergencyForm>) {
  const res = await fetch("/api/forms", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Erro ao criar formulário");
  return res.json();
}

export async function updateForm(id: string, data: Partial<EmergencyForm>) {
  const res = await fetch(`/api/forms/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Erro ao atualizar formulário");
  return res.json();
}

export async function deleteForm(id: string) {
  const res = await fetch(`/api/forms/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Erro ao deletar formulário");
  return res.json();
}

// Reports
export async function getReports(type?: string, startDate?: string, endDate?: string) {
  const params = new URLSearchParams();
  if (type) params.append("type", type);
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);

  const res = await fetch(`/api/reports?${params.toString()}`);
  if (!res.ok) throw new Error("Erro ao buscar relatórios");
  return res.json();
}
