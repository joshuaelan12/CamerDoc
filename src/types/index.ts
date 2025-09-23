
import type { LucideIcon } from "lucide-react";

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
  // Patient specific
  dateOfBirth?: any; // Allow for serverTimestamp
  gender?: string;
  location?: string;
  phone?: string;
}
