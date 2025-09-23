
"use client";

import { useEffect, useState } from "react";
import { collection, query, where, onSnapshot, doc, getDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { NavItem, Appointment, UserData } from "@/types";
import { useAuth } from "@/hooks/use-auth";
import {
  Calendar,
  HeartPulse,
  LayoutDashboard,
  MessageSquare,
  ScrollText,
  Stethoscope,
  Loader2,
  FileClock,
  User,
  Newspaper,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

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

type SymptomCheck = {
  id: string;
  symptoms: string;
  potentialCauses: string;
  recommendations: string;
  createdAt: Timestamp;
};

export default function PatientHistoryPage() {
  const { userData } = useAuth();
  const [pastAppointments, setPastAppointments] = useState<EnrichedAppointment[]>([]);
  const [symptomChecks, setSymptomChecks] = useState<SymptomCheck[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userData) {
      setLoading(false);
      return;
    }

    setLoading(true);
    let appointmentsLoaded = false;
    let checksLoaded = false;

    const checkLoading = () => {
      if (appointmentsLoaded && checksLoaded) {
        setLoading(false);
      }
    };
    
    // Fetch past appointments
    const appointmentsQuery = query(
      collection(db, "appointments"),
      where("patientId", "==", userData.uid),
      where("startTime", "<", new Date())
    );

    const unsubAppointments = onSnapshot(appointmentsQuery, async (snapshot) => {
      const appointmentsPromises = snapshot.docs.map(async (appointmentDoc) => {
        const appointmentData = { id: appointmentDoc.id, ...appointmentDoc.data() } as Appointment;
        let doctorData: UserData | null = null;
        if (appointmentData.doctorId) {
          const doctorRef = doc(db, "users", appointmentData.doctorId);
          const doctorSnap = await getDoc(doctorRef);
          if (doctorSnap.exists()) {
            doctorData = doctorSnap.data() as UserData;
          }
        }
        return { ...appointmentData, doctor: doctorData };
      });
      const resolvedAppointments = await Promise.all(appointmentsPromises);
      setPastAppointments(resolvedAppointments.sort((a,b) => b.startTime.toMillis() - a.startTime.toMillis()));
      appointmentsLoaded = true;
      checkLoading();
    }, () => {
        // Handle error case for this listener
        appointmentsLoaded = true;
        checkLoading();
    });

    // Fetch symptom checks
    const checksQuery = query(
        collection(db, "symptomChecks"),
        where("userId", "==", userData.uid)
    );
    const unsubChecks = onSnapshot(checksQuery, (snapshot) => {
        const checks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SymptomCheck));
        setSymptomChecks(checks.sort((a,b) => b.createdAt.toMillis() - a.createdAt.toMillis()));
        checksLoaded = true;
        checkLoading();
    }, () => {
        // Handle error case for this listener
        checksLoaded = true;
        checkLoading();
    });

    return () => {
      unsubAppointments();
      unsubChecks();
    }
  }, [userData]);


  return (
    <DashboardLayout navItems={navItems} userName={userData?.fullName || 'Patient'} userRole="Patient">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold font-headline">Medical History</h1>
      </div>

       <Tabs defaultValue="consultations" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-lg">
          <TabsTrigger value="consultations"><Stethoscope className="mr-2" />Consultation History</TabsTrigger>
          <TabsTrigger value="symptom-checks"><FileClock className="mr-2" />Symptom Check History</TabsTrigger>
        </TabsList>

        <TabsContent value="consultations">
            {loading ? (
                <div className="flex justify-center items-center h-48">
                    <Loader2 className="animate-spin text-primary" />
                </div>
            ) : pastAppointments.length > 0 ? (
                <div className="grid gap-4 mt-4 md:grid-cols-2">
                    {pastAppointments.map((appt) => (
                        <Card key={appt.id} className="opacity-80">
                           <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    <span>Dr. {appt.doctor?.fullName || 'Unknown Doctor'}</span>
                                     <Badge variant="outline">{appt.status}</Badge>
                                </CardTitle>
                                 <p className="text-sm text-muted-foreground">{appt.doctor?.specialization || 'N/A'}</p>
                            </CardHeader>
                            <CardContent className="space-y-4">
                               <p className="flex items-center gap-2 text-muted-foreground">
                                    <Calendar className="h-5 w-5" />
                                    <span>{appt.startTime.toDate().toLocaleString([], { dateStyle: 'full', timeStyle: 'short' })}</span>
                                </p>
                               <CardDescription>No notes available for this consultation yet.</CardDescription>
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

         <TabsContent value="symptom-checks">
             {loading ? (
                <div className="flex justify-center items-center h-48">
                    <Loader2 className="animate-spin text-primary" />
                </div>
             ) : symptomChecks.length > 0 ? (
                <div className="space-y-4 mt-4">
                    {symptomChecks.map((check) => (
                        <Card key={check.id}>
                            <CardHeader>
                                <CardTitle className="text-lg">Symptom Check on {check.createdAt.toDate().toLocaleDateString()}</CardTitle>
                                <CardDescription>Symptoms Reported: "{check.symptoms}"</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div>
                                    <h4 className="font-semibold">Potential Causes</h4>
                                    <p className="text-muted-foreground text-sm whitespace-pre-line">{check.potentialCauses}</p>
                                </div>
                                 <div>
                                    <h4 className="font-semibold">Recommendations</h4>
                                    <p className="text-muted-foreground text-sm whitespace-pre-line">{check.recommendations}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card className="mt-4">
                    <CardContent className="pt-6 text-center text-muted-foreground">
                        <p>You have no symptom check history.</p>
                    </CardContent>
                </Card>
            )}
        </TabsContent>

       </Tabs>
    </DashboardLayout>
  );
}

    