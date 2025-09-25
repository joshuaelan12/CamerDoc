
"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { NavItem } from "@/types";
import { useAuth } from "@/hooks/use-auth";
import {
  Calendar,
  LayoutDashboard,
  MessageSquare,
  Users,
  CalendarClock,
  User,
  Newspaper,
  History,
} from "lucide-react";

const navItems: NavItem[] = [
  { href: "/doctor/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/doctor/appointments", label: "Appointments", icon: Calendar, match: "/doctor/appointments" },
  { href: "/doctor/availability", label: "Availability", icon: CalendarClock, match: "/doctor/availability" },
  { href: "/doctor/patients", label: "Patients", icon: Users, match: "/doctor/patients" },
  { href: "/doctor/news", label: "News & Updates", icon: Newspaper, match: "/doctor/news" },
  { href: "/doctor/activity", label: "Activity Log", icon: History, match: "/doctor/activity" },
  { href: "/doctor/profile", label: "Profile", icon: User, match: "/doctor/profile" },
  { href: "/doctor/messages", label: "Messages", icon: MessageSquare, match: "/doctor/messages" },
];

export default function DoctorProfilePage() {
  const { userData } = useAuth();

  return (
    <DashboardLayout navItems={navItems} userName={userData?.fullName || 'Doctor'} userRole="Doctor">
      <h1 className="text-2xl font-bold mb-4 font-headline">My Profile</h1>
       <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">This page will allow doctors to manage their profile information, including specialization, affiliation, and contact details. This feature is currently under development.</p>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}

    
