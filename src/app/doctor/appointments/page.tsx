
"use client";

import { useEffect, useState } from "react";
import { collection, query, where, onSnapshot, doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { NavItem, Appointment, UserData } from "@/types";
import { useAuth } from "@/hooks/use-auth";
import {
  Calendar,
  LayoutDashboard,
  MessageSquare,
  Users,
  Loader2,
  User,
  CalendarClock,
  Newspaper,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlaceHolderImages } from "@/lib/placeholder-images";


const navItems: NavItem[] = [
  { href: "/doctor/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/doctor/appointments", label: "Appointments", icon: Calendar, match: "/doctor/appointments" },
  { href: "/doctor/availability", label: "Availability", icon: CalendarClock, match: "/doctor/availability" },
  { href: "/doctor/patients", label: "Patients", icon: Users, match: "/doctor/patients" },
  { href: "/doctor/news", label: "News & Updates", icon: Newspaper, match: "/doctor/news" },
  { href: "/doctor/profile", label: "Profile", icon: User, match: "/doctor/profile" },
  { href: "/doctor/messages", label: "Messages", icon: MessageSquare, match: "/doctor/messages" },
];

type EnrichedAppointment = Appointment & {
  patient: UserData | null;
};

export default function DoctorAppointmentsPage() {
  const { userData } = useAuth();
  const [upcomingAppointments, setUpcomingAppointments] = useState<EnrichedAppointment[]>([]);
  const [pastAppointments, setPastAppointments] = useState<EnrichedAppointment[]>([]);
  const [loading, setLoading] = useState(true);

  const userAvatar = PlaceHolderImages.find((img) => img.id === "avatar-1");

  useEffect(() => {
    if (!userData) return;

    const appointmentsQuery = query(
      collection(db, "appointments"),
      where("doctorId", "==", userData.uid)
    );

    const unsubscribe = onSnapshot(appointmentsQuery, async (snapshot) => {
      setLoading(true);
      const now = new Date();
      const upcoming: EnrichedAppointment[] = [];
      const past: EnrichedAppointment[] = [];

      const appointmentPromises = snapshot.docs.map(async (appointmentDoc) => {
        const appointmentData = { id: appointmentDoc.id, ...appointmentDoc.data() } as Appointment;
        
        let patientData: UserData | null = null;
        if (appointmentData.patientId) {
            const patientRef = doc(db, "users", appointmentData.patientId);
            const patientSnap = await getDoc(patientRef);
            if (patientSnap.exists()) {
                patientData = { uid: patientSnap.id, ...patientSnap.data() } as UserData;
            }
        }

        const enrichedAppointment: EnrichedAppointment = { ...appointmentData, patient: patientData };

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
    <DashboardLayout navItems={navItems} userName={userData?.fullName || 'Doctor'} userRole="Doctor">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold font-headline">My Appointments</h1>
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
                <div className="grid gap-4 mt-4 md:grid-cols-2 lg:grid-cols-3">
                    {upcomingAppointments.map((appt) => (
                        <Card key={appt.id}>
                            <CardHeader className="flex flex-row items-center gap-4">
                                <Avatar className="h-12 w-12">
                                    {userAvatar && <AvatarImage src={userAvatar.imageUrl} alt={appt.patient?.fullName || 'P'} data-ai-hint={userAvatar.imageHint}/>}
                                    <AvatarFallback>{appt.patient?.fullName.charAt(0) || 'P'}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <CardTitle>{appt.patient?.fullName || 'Unknown Patient'}</CardTitle>
                                    <CardDescription>{appt.patient?.email}</CardDescription>
                                </div>
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
                                  <a href={`https://wa.me/${appt.patient?.phone}`} target="_blank" rel="noopener noreferrer">
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
                <div className="grid gap-4 mt-4 md:grid-cols-2 lg:grid-cols-3">
                    {pastAppointments.map((appt) => (
                        <Card key={appt.id} className="opacity-70">
                            <CardHeader className="flex flex-row items-center gap-4">
                                <Avatar className="h-12 w-12">
                                     {userAvatar && <AvatarImage src={userAvatar.imageUrl} alt={appt.patient?.fullName || 'P'} data-ai-hint={userAvatar.imageHint}/>}
                                    <AvatarFallback>{appt.patient?.fullName.charAt(0) || 'P'}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <CardTitle>{appt.patient?.fullName || 'Unknown Patient'}</CardTitle>
                                    <CardDescription>
                                        <Badge variant="outline">{appt.status}</Badge>
                                    </CardDescription>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                               <p className="flex items-center gap-2 text-muted-foreground">
                                    <Calendar className="h-5 w-5" />
                                    <span>{appt.startTime.toDate().toLocaleString([], { dateStyle: 'full', timeStyle: 'short' })}</span>
                                </p>
                               <Button variant="outline" className="w-full">Add Consultation Notes</Button>
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

    