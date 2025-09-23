
import type { LucideIcon } from "lucide-react";
import type { Timestamp } from "firebase/firestore";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  match?: string;
};

export interface UserData {
  uid: string;
  fullName: string;
  email: string;
  role: "patient" | "doctor" | "admin";
  createdAt: any; // Allow for serverTimestamp
  // Doctor specific
  specialization?: string;
  hospitalAffiliation?: string;
  verificationStatus?: 'pending' | 'approved' | 'rejected';
  phone?: string;
  // Patient specific
  dateOfBirth?: any; // Allow for serverTimestamp
  gender?: string;
  location?: string;
}

export interface Appointment {
    id: string;
    doctorId: string;
    patientId: string;
    startTime: Timestamp;
    endTime: Timestamp;
    status: 'scheduled' | 'completed' | 'cancelled';
    createdAt: Timestamp;
}

    