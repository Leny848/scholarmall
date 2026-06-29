export interface Scholarship {
  id: string;
  title: string;
  description: string;
  amount: string;
  deadline: string;
  eligibility: string;
  category: string;
  country: string;
  image_url: string;
  created_at: string;
}

export interface Application {
  id: string;
  scholarship_id: string;
  scholarship_title?: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  nationality: string;
  education_level: string;
  gpa: string;
  essay: string;
  resume_url: string;
  status: "pending" | "accepted" | "rejected";
  admin_message: string;
  created_at: string;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  created_at: string;
}
