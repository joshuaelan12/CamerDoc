
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { collection, query, where, onSnapshot, doc, getDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { NavItem, Appointment, UserData } from "@/types";
import { useAuth } from "@/hooks/use-auth";
import {
  Calendar,
  HeartPulse,
  LayoutDashboard,
  MessageSquare,
  ScrollText,
  PlusCircle,
  Stethoscope,
  Loader2,
  User,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const navItems: NavItem[] = [
  { href: "/patient/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/patient/find-a-doctor", label: "Find a Doctor", icon: Stethoscope, match: "/patient/find-a-doctor" },
  { href: "/patient/appointments", label: "Appointments", icon: Calendar, match: "/patient/appointments" },
  { href: "/patient/history", label: "Medical History", icon: ScrollText, match: "/patient/history" },
  { href: "/patient/profile", label: "Profile", icon: User, match: "/patient/profile" },
  { href: "/patient/messages", label: "Messages", icon: MessageSquare, match: "/patient/messages" },
  { href: "/symptom-checker", label: "Symptom Checker", icon: HeartPulse },
];

type EnrichedAppointment = Appointment & {
  doctor: UserData | null;
};

export default function PatientAppointmentsPage() {
  const { userData } = useAuth();
  const [upcomingAppointments, setUpcomingAppointments] = useState<EnrichedAppointment[]>([]);
  const [pastAppointments, setPastAppointments] = useState<EnrichedAppointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userData) return;

    const appointmentsQuery = query(
      collection(db, "appointments"),
      where("patientId", "==", userData.uid)
    );

    const unsubscribe = onSnapshot(appointmentsQuery, async (snapshot) => {
      setLoading(true);
      const now = new Date();
      const upcoming: EnrichedAppointment[] = [];
      const past: EnrichedAppointment[] = [];

      const appointmentPromises = snapshot.docs.map(async (appointmentDoc) => {
        const appointmentData = { id: appointmentDoc.id, ...appointmentDoc.data() } as Appointment;
        
        let doctorData: UserData | null = null;
        if (appointmentData.doctorId) {
            const doctorRef = doc(db, "users", appointmentData.doctorId);
            const doctorSnap = await getDoc(doctorRef);
            if (doctorSnap.exists()) {
                doctorData = doctorSnap.data() as UserData;
            }
        }

        const enrichedAppointment: EnrichedAppointment = { ...appointmentData, doctor: doctorData };

        if (appointmentData.startTime.toDate() > now) {
          upcoming.push(enrichedAppointment);
        } else {
          past.push(enrichedAppointment);
        }
      });
      
      await Promise.all(appointmentPromises);

      setUpcomingAppointments(upcoming.sort((a,b) => a.startTime.toMillis() - b.startTime.toMillis()));
      setPastAppointments(past.sort((a,b) => b.startTime.toMillis() - a.startTime.toMillis()));
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userData]);


  return (
    <DashboardLayout navItems={navItems} userName={userData?.fullName || 'Patient'} userRole="Patient">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold font-headline">My Appointments</h1>
        <Button asChild>
          <Link href="/patient/find-a-doctor">
            <PlusCircle className="mr-2 h-4 w-4" />
            Book New Appointment
          </Link>
        </Button>
      </div>

       <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-lg">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming">
            {loading ? (
                <div className="flex justify-center items-center h-48">
                    <Loader2 className="animate-spin text-primary" />
                </div>
            ) : upcomingAppointments.length > 0 ? (
                <div className="grid gap-4 mt-4 md:grid-cols-2">
                    {upcomingAppointments.map((appt) => (
                        <Card key={appt.id}>
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    <span>{appt.doctor?.fullName || 'Unknown Doctor'}</span>
                                     <Badge variant="secondary">{appt.doctor?.specialization || 'N/A'}</Badge>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="flex items-center gap-2 text-muted-foreground">
                                    <Calendar className="h-5 w-5" />
                                    <span>{appt.startTime.toDate().toLocaleString([], { dateStyle: 'full', timeStyle: 'short' })}</span>
                                </p>
                                 <p className="flex items-center gap-2 text-muted-foreground">
                                    <MessageSquare className="h-5 w-5" />
                                    <span>WhatsApp</span>
                                </p>
                                <Button className="w-full" asChild>
                                  <a href={`https://wa.me/${appt.doctor?.phone}`} target="_blank" rel="noopener noreferrer">
                                    Message on WhatsApp
                                  </a>
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card className="mt-4">
                    <CardContent className="pt-6 text-center text-muted-foreground">
                        <p>You have no upcoming appointments.</p>
                    </CardContent>
                </Card>
            )}
        </TabsContent>
         <TabsContent value="past">
             {loading ? (
                <div className="flex justify-center items-center h-48">
                    <Loader2 className="animate-spin text-primary" />
                </div>
             ) : pastAppointments.length > 0 ? (
                <div className="grid gap-4 mt-4 md:grid-cols-2">
                    {pastAppointments.map((appt) => (
                        <Card key={appt.id} className="opacity-70">
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    <span>{appt.doctor?.fullName || 'Unknown Doctor'}</span>
                                     <Badge variant="outline">{appt.status}</Badge>
                                </CardTitle>
                                 <p className="text-sm text-muted-foreground">{appt.doctor?.specialization || 'N/A'}</p>
                            </CardHeader>
                            <CardContent className="space-y-4">
                               <p className="flex items-center gap-2 text-muted-foreground">
                                    <Calendar className="h-5 w-5" />
                                    <span>{appt.startTime.toDate().toLocaleString([], { dateStyle: 'full', timeStyle: 'short' })}</span>
                                </p>
                               <Button variant="outline" className="w-full" disabled>View Consultation Notes</Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card className="mt-4">
                    <CardContent className="pt-6 text-center text-muted-foreground">
                        <p>You have no past appointments.</p>
                    </CardContent>
                </Card>
            )}
        </TabsContent>

       </Tabs>
    </DashboardLayout>
  );
}

    