
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
  createdAt: Date;
  // Doctor specific
  specialization?: string;
  hospitalAffiliation?: string;
  verificationStatus?: 'pending' | 'approved' | 'rejected';
  // Patient specific
  dateOfBirth?: Date;
  gender?: string;
  location?: string;
  phone?: string;
}
