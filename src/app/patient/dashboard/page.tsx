
"use client";

import { useEffect, useState } from "react";
import { collection, query, where, onSnapshot, getDoc, doc, orderBy, limit, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { NavItem, Appointment, UserData } from "@/types";
import { useAuth } from "@/hooks/use-auth";
import {
  Calendar,
  HeartPulse,
  LayoutDashboard,
  MessageSquare,
  ScrollText,
  Stethoscope,
  User,
  Newspaper,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

const navItems: NavItem[] = [
  { href: "/patient/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/patient/find-a-doctor", label: "Find a Doctor", icon: Stethoscope, match: "/patient/find-a-doctor" },
  { href: "/patient/appointments", label: "Appointments", icon: Calendar, match: "/patient/appointments" },
  { href: "/patient/history", label: "Medical History", icon: ScrollText, match: "/patient/history" },
  { href: "/patient/news", label: "News & Updates", icon: Newspaper, match: "/patient/news" },
  { href: "/patient/profile", label: "Profile", icon: User, match: "/patient/profile" },
  { href: "/patient/messages", label: "Messages", icon: MessageSquare, match: "/patient/messages" },
  { href: "/symptom-checker", label: "Symptom Checker", icon: HeartPulse },
];

type EnrichedAppointment = Appointment & {
  doctor: UserData | null;
};

export default function PatientDashboardPage() {
  const { userData } = useAuth();
  const [loading, setLoading] = useState(true);
  const [upcomingAppointment, setUpcomingAppointment] = useState<EnrichedAppointment | null>(null);
  const [lastCheckup, setLastCheckup] = useState<EnrichedAppointment | null>(null);
  const [messageCount, setMessageCount] = useState(0);

  useEffect(() => {
    if (!userData?.uid) return;
    
    setLoading(true);

    const appointmentsQuery = query(
      collection(db, "appointments"),
      where("patientId", "==", userData.uid)
    );

    const unsubscribe = onSnapshot(appointmentsQuery, async (snapshot) => {
      const now = new Date();
      let upcoming: EnrichedAppointment[] = [];
      let past: EnrichedAppointment[] = [];
      const doctorIds = new Set<string>();

      for (const appointmentDoc of snapshot.docs) {
        const appointmentData = { id: appointmentDoc.id, ...appointmentDoc.data() } as Appointment;
        doctorIds.add(appointmentData.doctorId);

        let doctorData: UserData | null = null;
        const doctorRef = doc(db, "users", appointmentData.doctorId);
        const doctorSnap = await getDoc(doctorRef);
        if (doctorSnap.exists()) {
          doctorData = doctorSnap.data() as UserData;
        }

        const enrichedAppointment: EnrichedAppointment = { ...appointmentData, doctor: doctorData };

        if (appointmentData.startTime.toDate() > now) {
          upcoming.push(enrichedAppointment);
        } else {
          past.push(enrichedAppointment);
        }
      }
      
      upcoming.sort((a,b) => a.startTime.toMillis() - b.startTime.toMillis());
      past.sort((a,b) => b.startTime.toMillis() - a.startTime.toMillis());

      setUpcomingAppointment(upcoming[0] || null);
      setLastCheckup(past[0] || null);
      setMessageCount(doctorIds.size);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userData]);


  return (
    <DashboardLayout navItems={navItems} userName={userData?.fullName || 'Patient'} userRole="Patient">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Appointment</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-8 w-4/5" />
                <Skeleton className="h-4 w-3/5" />
              </div>
            ) : upcomingAppointment ? (
              <>
                <div className="text-2xl font-bold">Dr. {upcomingAppointment.doctor?.fullName}</div>
                <p className="text-xs text-muted-foreground">
                  {upcomingAppointment.startTime.toDate().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </p>
              </>
            ) : (
              <>
                <div className="text-2xl font-bold">No appointments</div>
                <p className="text-xs text-muted-foreground">
                   <Link href="/patient/find-a-doctor" className="text-primary hover:underline">Book a new one</Link>
                </p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversations</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
                <div className="space-y-2">
                    <Skeleton className="h-8 w-1/2" />
                    <Skeleton className="h-4 w-1/2" />
                </div>
            ) : (
              <>
                <div className="text-2xl font-bold">{messageCount} Doctors</div>
                <p className="text-xs text-muted-foreground">
                    <Link href="/patient/messages" className="text-primary hover:underline">Go to messages</Link>
                </p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Checkup</CardTitle>
            <ScrollText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
             {loading ? (
                <div className="space-y-2">
                    <Skeleton className="h-8 w-4/5" />
                    <Skeleton className="h-4 w-3/5" />
                </div>
            ) : lastCheckup ? (
              <>
                <div className="text-2xl font-bold">Dr. {lastCheckup.doctor?.fullName}</div>
                <p className="text-xs text-muted-foreground">
                    On {lastCheckup.startTime.toDate().toLocaleDateString()}
                </p>
              </>
            ) : (
                 <>
                    <div className="text-2xl font-bold">No history</div>
                    <p className="text-xs text-muted-foreground">Your past consultations will appear here</p>
                </>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
