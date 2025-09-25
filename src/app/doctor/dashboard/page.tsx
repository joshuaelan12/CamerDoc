
"use client";

import { useEffect, useState } from "react";
import { collection, query, where, onSnapshot, getDocs, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { NavItem } from "@/types";
import { useAuth } from "@/hooks/use-auth";
import {
  Calendar,
  LayoutDashboard,
  MessageSquare,
  Users,
  Hourglass,
  XCircle,
  Building,
  Stethoscope,
  CalendarClock,
  User,
  Newspaper,
  Loader2,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const navItems: NavItem[] = [
  { href: "/doctor/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/doctor/appointments", label: "Appointments", icon: Calendar, match: "/doctor/appointments" },
  { href: "/doctor/availability", label: "Availability", icon: CalendarClock, match: "/doctor/availability" },
  { href: "/doctor/patients", label: "Patients", icon: Users, match: "/doctor/patients" },
  { href: "/doctor/news", label: "News & Updates", icon: Newspaper, match: "/doctor/news" },
  { href: "/doctor/profile", label: "Profile", icon: User, match: "/doctor/profile" },
  { href: "/doctor/messages", label: "Messages", icon: MessageSquare, match: "/doctor/messages" },
];

type DashboardStats = {
  totalPatients: number;
  upcomingAppointments: number;
};


export default function DoctorDashboardPage() {
  const { userData } = useAuth();
  const verificationStatus = userData?.verificationStatus;
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  const isPending = verificationStatus === 'pending';
  const isRejected = verificationStatus === 'rejected';

  useEffect(() => {
    if (!userData?.uid) return;

    setLoading(true);

    const appointmentsQuery = query(
      collection(db, "appointments"),
      where("doctorId", "==", userData.uid)
    );

    const unsubscribe = onSnapshot(appointmentsQuery, (snapshot) => {
      const patientIds = new Set<string>();
      let upcomingCount = 0;
      const now = new Date();

      snapshot.forEach(doc => {
        const appt = doc.data();
        patientIds.add(appt.patientId);
        if (appt.startTime.toDate() > now) {
          upcomingCount++;
        }
      });
      
      setStats({
        totalPatients: patientIds.size,
        upcomingAppointments: upcomingCount,
      });

      setLoading(false);
    });

    return () => unsubscribe();
  }, [userData]);


  return (
    <DashboardLayout navItems={navItems} userName={userData?.fullName || 'Doctor'} userRole="Doctor">
      {isPending && (
        <Alert className="mb-4 bg-yellow-50 border-yellow-200 text-yellow-800 [&>svg]:text-yellow-600">
          <Hourglass className="h-4 w-4" />
          <AlertTitle>Verification Pending</AlertTitle>
          <AlertDescription>
            Your account is currently under review by an administrator. You will be notified once your verification is complete.
          </AlertDescription>
        </Alert>
      )}
      {isRejected && (
         <Alert variant="destructive" className="mb-4">
          <XCircle className="h-4 w-4" />
          <AlertTitle>Verification Rejected</AlertTitle>
          <AlertDescription>
            Unfortunately, your verification was not approved. Please contact support for more information.
          </AlertDescription>
        </Alert>
      )}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton className="h-8 w-16" /> : <div className="text-2xl font-bold">{stats?.upcomingAppointments ?? 0}</div> }
            <p className="text-xs text-muted-foreground">Total scheduled consultations</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
             {loading ? <Skeleton className="h-8 w-16" /> : <div className="text-2xl font-bold">{stats?.totalPatients ?? 0}</div> }
            <p className="text-xs text-muted-foreground">Patients you have seen</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Affiliation</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userData?.hospitalAffiliation || 'None'}</div>
            <p className="text-xs text-muted-foreground">Your hospital or clinic</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
