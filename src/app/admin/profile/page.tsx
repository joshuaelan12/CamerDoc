
"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { NavItem } from "@/types";
import { useAuth } from "@/hooks/use-auth";
import {
  AreaChart,
  Cog,
  LayoutDashboard,
  Users,
  CreditCard,
  Newspaper,
  User,
} from "lucide-react";

const navItems: NavItem[] = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/users", label: "Manage Users", icon: Users, match: "/admin/users" },
  { href: "/admin/payments", label: "Payments", icon: CreditCard, match: "/admin/payments" },
  { href: "/admin/content", label: "Content", icon: Newspaper, match: "/admin/content" },
  { href: "/admin/settings", label: "System Settings", icon: Cog, match: "/admin/settings" },
  { href: "/admin/analytics", label: "Analytics", icon: AreaChart, match: "/admin/analytics" },
];

export default function AdminProfilePage() {
  const { userData } = useAuth();

  return (
    <DashboardLayout navItems={navItems} userName={userData?.fullName || 'Admin'} userRole="Administrator">
      <h1 className="text-2xl font-bold mb-4 font-headline">My Profile</h1>
      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">This page will allow administrators to manage their profile settings. This feature is currently under development.</p>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
