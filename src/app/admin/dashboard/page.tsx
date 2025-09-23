
"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, where, Timestamp } from "firebase/firestore";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { NavItem } from "@/types";
import { db } from "@/lib/firebase";
import {
  AreaChart,
  Cog,
  LayoutDashboard,
  ShieldCheck,
  Users,
  CreditCard,
} from "lucide-react";

const navItems: NavItem[] = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/users", label: "Manage Users", icon: Users, match: "/admin/users" },
  { href: "/admin/payments", label: "Payments", icon: CreditCard, match: "/admin/payments" },
  { href: "/admin/settings", label: "System Settings", icon: Cog, match: "/admin/settings" },
  { href: "/admin/analytics", label: "Analytics", icon: AreaChart, match: "/admin/analytics" },
];

type DashboardStats = {
  totalUsers: number;
  activeDoctors: number;
  symptomChecksToday: number;
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        // Fetch all users
        const usersCollection = collection(db, "users");
        const usersSnapshot = await getDocs(usersCollection);
        const totalUsers = usersSnapshot.size;

        // Fetch active doctors
        const doctorsQuery = query(
          usersCollection,
          where("role", "==", "doctor"),
          where("verificationStatus", "==", "approved")
        );
        const doctorsSnapshot = await getDocs(doctorsQuery);
        const activeDoctors = doctorsSnapshot.size;
        
        // Fetch symptom checks in the last 24 hours
        const twentyFourHoursAgo = Timestamp.fromMillis(Date.now() - 24 * 60 * 60 * 1000);
        const symptomChecksQuery = query(
            collection(db, "symptomChecks"),
            where("createdAt", ">=", twentyFourHoursAgo)
        );
        const symptomChecksSnapshot = await getDocs(symptomChecksQuery);
        const symptomChecksToday = symptomChecksSnapshot.size;

        setStats({ totalUsers, activeDoctors, symptomChecksToday });
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);


  return (
    <DashboardLayout navItems={navItems} userName="Admin User" userRole="Administrator">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold">{stats?.totalUsers ?? 0}</div>
            )}
             <p className="text-xs text-muted-foreground">All registered users</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Doctors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
             {loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{stats?.activeDoctors ?? 0}</div>
            )}
            <p className="text-xs text-muted-foreground">Approved professionals</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Server Status</CardTitle>
            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">Operational</div>
            <p className="text-xs text-muted-foreground">All systems are running</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Symptom Checks Today</CardTitle>
            <AreaChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
             {loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{stats?.symptomChecksToday ?? 0}</div>
            )}
            <p className="text-xs text-muted-foreground">In the last 24 hours</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
