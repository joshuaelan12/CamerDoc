
"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { NavItem } from "@/types";
import {
  AreaChart,
  Cog,
  LayoutDashboard,
  Paintbrush,
  Shield,
  Bell,
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

export default function AdminSettingsPage() {
  return (
    <DashboardLayout navItems={navItems} userName="Admin User" userRole="Administrator">
      <h1 className="text-2xl font-bold mb-4 font-headline">System Settings</h1>
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-4 max-w-2xl">
          <TabsTrigger value="general"><Cog className="mr-2" />General</TabsTrigger>
          <TabsTrigger value="appearance"><Paintbrush className="mr-2" />Appearance</TabsTrigger>
          <TabsTrigger value="auth"><Shield className="mr-2" />Authentication</TabsTrigger>
          <TabsTrigger value="notifications"><Bell className="mr-2" />Notifications</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Manage basic application settings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="site-name">Site Name</Label>
                <Input id="site-name" defaultValue="CamerDoc" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="support-email">Support Email</Label>
                <Input id="support-email" type="email" defaultValue="support@camerdoc.com" />
              </div>
              <Button disabled>Save Changes (Coming Soon)</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Customize the look and feel of the application.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
               <div className="space-y-2">
                <Label>Theme Colors</Label>
                 <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary" />
                        <Label>Primary</Label>
                    </div>
                     <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-secondary" />
                        <Label>Secondary</Label>
                    </div>
                     <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-accent" />
                        <Label>Accent</Label>
                    </div>
                </div>
                <p className="text-sm text-muted-foreground">Theme color customization is coming soon.</p>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="dark-mode" disabled />
                <Label htmlFor="dark-mode">Enable Dark Mode (Coming Soon)</Label>
              </div>
              <Button disabled>Save Changes (Coming Soon)</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="auth">
          <Card>
            <CardHeader>
              <CardTitle>Authentication Settings</CardTitle>
              <CardDescription>Manage how users sign up and log in.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <Label htmlFor="allow-patient-signup">Allow New Patient Registrations</Label>
                  <p className="text-sm text-muted-foreground">
                    If disabled, new patients will not be able to create an account.
                  </p>
                </div>
                <Switch id="allow-patient-signup" defaultChecked disabled />
              </div>
               <div className="flex items-center justify-between rounded-lg border p-4">
                 <div>
                  <Label htmlFor="allow-doctor-signup">Allow New Doctor Registrations</Label>
                   <p className="text-sm text-muted-foreground">
                    If disabled, new doctors will not be able to create an account.
                  </p>
                </div>
                <Switch id="allow-doctor-signup" defaultChecked disabled />
              </div>
              <Button disabled>Save Changes (Coming Soon)</Button>
            </CardContent>
          </Card>
        </TabsContent>

         <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Manage automated email and push notifications.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <Label htmlFor="email-on-new-doctor">New Doctor Registration</Label>
                  <p className="text-sm text-muted-foreground">
                    Send an email to admins when a new doctor signs up.
                  </p>
                </div>
                <Switch id="email-on-new-doctor" defaultChecked disabled />
              </div>
                <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <Label htmlFor="email-on-approval">Doctor Account Approval</Label>
                  <p className="text-sm text-muted-foreground">
                    Send an email to a doctor when their account is approved.
                  </p>
                </div>
                <Switch id="email-on-approval" defaultChecked disabled />
              </div>
              <Button disabled>Save Changes (Coming Soon)</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
