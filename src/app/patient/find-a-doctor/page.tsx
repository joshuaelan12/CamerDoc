
"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { NavItem, UserData } from "@/types";
import { useAuth } from "@/hooks/use-auth";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import {
  Calendar,
  HeartPulse,
  LayoutDashboard,
  MessageSquare,
  ScrollText,
  Stethoscope,
  Search,
  Building,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { BookingDialog } from "./BookingDialog";

const navItems: NavItem[] = [
  { href: "/patient/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/patient/find-a-doctor", label: "Find a Doctor", icon: Stethoscope, match: "/patient/find-a-doctor" },
  { href: "/patient/appointments", label: "Appointments", icon: Calendar, match: "/patient/appointments" },
  { href: "/patient/history", label: "Medical History", icon: ScrollText, match: "/patient/history" },
  { href: "/patient/messages", label: "Messages", icon: MessageSquare, match: "/patient/messages" },
  { href: "/symptom-checker", label: "Symptom Checker", icon: HeartPulse },
];

const specializations = ["All", "General Practice", "Pediatrics", "Cardiology", "Dermatology"];

export default function FindDoctorPage() {
  const { userData } = useAuth();
  const [doctors, setDoctors] = useState<UserData[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [specialty, setSpecialty] = useState("All");

  const userAvatar = PlaceHolderImages.find((img) => img.id === "avatar-1");

  useEffect(() => {
    async function fetchDoctors() {
      try {
        const doctorsQuery = query(
          collection(db, "users"),
          where("role", "==", "doctor"),
          where("verificationStatus", "==", "approved")
        );
        const querySnapshot = await getDocs(doctorsQuery);
        const doctorsData = querySnapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() })) as UserData[];
        setDoctors(doctorsData);
        setFilteredDoctors(doctorsData);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchDoctors();
  }, []);

  useEffect(() => {
    let results = doctors;

    if (searchTerm) {
      results = results.filter(doctor =>
        doctor.fullName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (specialty !== "All") {
      results = results.filter(doctor => doctor.specialization === specialty);
    }

    setFilteredDoctors(results);
  }, [searchTerm, specialty, doctors]);


  return (
    <DashboardLayout navItems={navItems} userName={userData?.fullName || 'Patient'} userRole="Patient">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold font-headline">Find a Doctor</h1>
        <Card>
          <CardHeader>
            <CardTitle>Search for a Specialist</CardTitle>
            <CardDescription>Filter by name or specialty to find the right doctor for you.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search by doctor's name..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select onValueChange={setSpecialty} value={specialty}>
              <SelectTrigger className="w-full md:w-[280px]">
                <SelectValue placeholder="Filter by specialty" />
              </SelectTrigger>
              <SelectContent>
                {specializations.map(spec => (
                  <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
                <Card key={i}>
                    <CardHeader className="flex flex-row items-center gap-4">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="space-y-2">
                           <Skeleton className="h-4 w-[150px]" />
                           <Skeleton className="h-4 w-[100px]" />
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </CardContent>
                </Card>
            ))
          ) : filteredDoctors.length > 0 ? (
            filteredDoctors.map(doctor => (
              <Card key={doctor.uid}>
                <CardHeader className="flex flex-row items-center gap-4">
                  <Avatar className="h-12 w-12">
                    {userAvatar && <AvatarImage src={userAvatar.imageUrl} alt={doctor.fullName} data-ai-hint={userAvatar.imageHint}/>}
                    <AvatarFallback>{doctor.fullName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-xl">{doctor.fullName}</CardTitle>
                    <CardDescription>{doctor.specialization}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {doctor.hospitalAffiliation &&
                    <p className="flex items-center gap-2 text-muted-foreground">
                        <Building className="h-5 w-5" />
                        <span>{doctor.hospitalAffiliation}</span>
                    </p>
                  }
                  <BookingDialog doctor={doctor} patient={userData} />
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-12 text-muted-foreground col-span-full">
              <p>No doctors found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
