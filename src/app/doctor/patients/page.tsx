
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { NavItem } from "@/types";
import { useAuth } from "@/hooks/use-auth";
import { getPatientsForDoctor, type PatientWithLastAppointment } from "./actions";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import {
  Calendar,
  LayoutDashboard,
  MessageSquare,
  Users,
  CalendarClock,
  User,
  Newspaper,
  BookUser,
} from "lucide-react";

const navItems: NavItem[] = [
  { href: "/doctor/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/doctor/appointments", label: "Appointments", icon: Calendar, match: "/doctor/appointments" },
  { href: "/doctor/availability", label: "Availability", icon: CalendarClock, match: "/doctor/availability" },
  { href: "/doctor/patients", label: "Patients", icon: Users, match: "/doctor/patients" },
  { href: "/doctor/news", label: "News & Updates", icon: Newspaper, match: "/doctor/news" },
  { href: "/doctor/profile", label: "Profile", icon: User, match: "/doctor/profile" },
  { href: "/doctor/messages", label: "Messages", icon: MessageSquare, match: "/doctor/messages" },
];

export default function DoctorPatientsPage() {
  const { userData } = useAuth();
  const [patients, setPatients] = useState<PatientWithLastAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const patientAvatar = PlaceHolderImages.find((img) => img.id === "avatar-2");

  useEffect(() => {
    async function loadPatients() {
      if (userData?.uid) {
        setLoading(true);
        const fetchedPatients = await getPatientsForDoctor(userData.uid);
        setPatients(fetchedPatients);
        setLoading(false);
      }
    }
    loadPatients();
  }, [userData]);

  return (
    <DashboardLayout navItems={navItems} userName={userData?.fullName || 'Doctor'} userRole="Doctor">
      <h1 className="text-2xl font-bold mb-4 font-headline">My Patients</h1>
      <Card>
        <CardHeader>
          <CardTitle>Patient List</CardTitle>
          <CardDescription>A list of all patients you have had appointments with.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead className="hidden md:table-cell">Email</TableHead>
                <TableHead className="hidden lg:table-cell">Last Appointment</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="space-y-1">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-3 w-32 md:hidden" />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-40" /></TableCell>
                    <TableCell className="hidden lg:table-cell"><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell className="text-right">
                       <Skeleton className="h-8 w-20 ml-auto" />
                    </TableCell>
                  </TableRow>
                ))
              ) : patients.length > 0 ? (
                patients.map((patient) => (
                  <TableRow key={patient.uid}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                           {patientAvatar && <AvatarImage src={patientAvatar.imageUrl} alt={patient.fullName} data-ai-hint={patientAvatar.imageHint}/>}
                          <AvatarFallback>{patient.fullName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{patient.fullName}</p>
                          <p className="text-sm text-muted-foreground md:hidden">{patient.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{patient.email}</TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {patient.lastAppointment ? new Date(patient.lastAppointment).toLocaleDateString() : "N/A"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button variant="outline" size="sm" asChild>
                           <Link href={`/doctor/messages?patientId=${patient.uid}`}>
                            <MessageSquare className="mr-2 h-3.5 w-3.5" />
                            Message
                           </Link>
                        </Button>
                        <Button variant="ghost" size="sm" disabled>
                          <BookUser className="mr-2 h-3.5 w-3.5" />
                          History
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    You have no patients yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
