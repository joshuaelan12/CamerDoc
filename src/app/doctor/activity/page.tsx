
"use client";

import { useEffect, useState } from "react";
import { collection, query, where, onSnapshot, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { NavItem, Availability } from "@/types";
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


export default function DoctorActivityPage() {
  const { userData } = useAuth();
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userData) return;

    const availabilityQuery = query(
      collection(db, "availabilities"),
      where("doctorId", "==", userData.uid)
    );

    const unsubscribe = onSnapshot(availabilityQuery, (snapshot) => {
      const availabilityData = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
              id: doc.id,
              ...data,
          } as Availability;
      });
      // Sort by date descending
      availabilityData.sort((a,b) => b.date.toMillis() - a.date.toMillis());
      setAvailabilities(availabilityData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userData]);


  return (
    <DashboardLayout navItems={navItems} userName={userData?.fullName || 'Doctor'} userRole="Doctor">
        <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold font-headline">My Activity</h1>
        </div>

        <Card>
            <CardHeader>
                <CardTitle>Availability Updates</CardTitle>
                <CardDescription>A log of your recent availability updates.</CardDescription>
            </CardHeader>
            <CardContent>
                 {loading ? (
                    <div className="flex justify-center items-center h-48">
                        <Loader2 className="animate-spin text-primary" />
                    </div>
                ) : availabilities.length > 0 ? (
                    <div className="space-y-4">
                        {availabilities.map((item) => (
                            <div key={item.id} className="flex items-center gap-4 p-3 rounded-lg border">
                                <CalendarClock className="h-5 w-5 text-primary" />
                                <div className="flex-1">
                                    <p className="font-medium">You updated your availability for {item.date.toDate().toLocaleDateString()}</p>
                                    <p className="text-sm text-muted-foreground">{item.timeSlots.length} slots available</p>
                                </div>
                                <p className="text-sm text-muted-foreground">{item.date.toDate().toLocaleDateString([], { month: 'short', day: 'numeric' })}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10 text-muted-foreground">
                        <p>No activity to display yet.</p>
                        <p className="text-sm">Updates to your availability will appear here.</p>
                    </div>
                )}
            </CardContent>
        </Card>

    </DashboardLayout>
  );
}
