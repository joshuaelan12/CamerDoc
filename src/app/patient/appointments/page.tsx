
"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { NavItem } from "@/types";
import { useAuth } from "@/hooks/use-auth";
import {
  Calendar,
  HeartPulse,
  LayoutDashboard,
  MessageSquare,
  ScrollText,
  PlusCircle,
  Video,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const navItems: NavItem[] = [
  { href: "/patient/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/patient/appointments", label: "Appointments", icon: Calendar, match: "/patient/appointments" },
  { href: "/patient/history", label: "Medical History", icon: ScrollText, match: "/patient/history" },
  { href: "/patient/messages", label: "Messages", icon: MessageSquare, match: "/patient/messages" },
  { href: "/symptom-checker", label: "Symptom Checker", icon: HeartPulse },
];

const upcomingAppointments = [
    {
        id: '1',
        doctorName: 'Dr. John Doe',
        specialization: 'Cardiology',
        date: '2024-07-25T14:00:00',
        type: 'Video Call',
    }
];

const pastAppointments = [
    {
        id: '2',
        doctorName: 'Dr. Jane Smith',
        specialization: 'Dermatology',
        date: '2024-06-10T10:30:00',
        type: 'Video Call',
        status: 'Completed'
    }
];

export default function PatientAppointmentsPage() {
  const { userData } = useAuth();

  return (
    <DashboardLayout navItems={navItems} userName={userData?.fullName || 'Patient'} userRole="Patient">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold font-headline">My Appointments</h1>
        <Button disabled>
            <PlusCircle className="mr-2 h-4 w-4" />
            Book New Appointment (Coming Soon)
        </Button>
      </div>

       <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-lg">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming">
            {upcomingAppointments.length > 0 ? (
                <div className="grid gap-4 mt-4 md:grid-cols-2">
                    {upcomingAppointments.map((appt) => (
                        <Card key={appt.id}>
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    <span>{appt.doctorName}</span>
                                     <Badge variant="secondary">{appt.specialization}</Badge>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="flex items-center gap-2 text-muted-foreground">
                                    <Calendar className="h-5 w-5" />
                                    <span>{new Date(appt.date).toLocaleString([], { dateStyle: 'full', timeStyle: 'short' })}</span>
                                </p>
                                 <p className="flex items-center gap-2 text-muted-foreground">
                                    <Video className="h-5 w-5" />
                                    <span>{appt.type}</span>
                                </p>
                                <Button className="w-full">Join Video Call</Button>
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
            {pastAppointments.length > 0 ? (
                <div className="grid gap-4 mt-4 md:grid-cols-2">
                    {pastAppointments.map((appt) => (
                        <Card key={appt.id} className="opacity-70">
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    <span>{appt.doctorName}</span>
                                     <Badge variant="outline">{appt.status}</Badge>
                                </CardTitle>
                                 <p className="text-sm text-muted-foreground">{appt.specialization}</p>
                            </CardHeader>
                            <CardContent className="space-y-4">
                               <p className="flex items-center gap-2 text-muted-foreground">
                                    <Calendar className="h-5 w-5" />
                                    <span>{new Date(appt.date).toLocaleString([], { dateStyle: 'full', timeStyle: 'short' })}</span>
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
