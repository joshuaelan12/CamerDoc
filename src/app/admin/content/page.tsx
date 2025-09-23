
"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { NavItem } from "@/types";
import {
  AreaChart,
  Cog,
  LayoutDashboard,
  Users,
  CreditCard,
  Newspaper,
  PlusCircle,
  FileQuestion,
  Megaphone,
} from "lucide-react";

const navItems: NavItem[] = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/users", label: "Manage Users", icon: Users, match: "/admin/users" },
  { href: "/admin/payments", label: "Payments", icon: CreditCard, match: "/admin/payments" },
  { href: "/admin/content", label: "Content", icon: Newspaper, match: "/admin/content" },
  { href: "/admin/settings", label: "System Settings", icon: Cog, match: "/admin/settings" },
  { href: "/admin/analytics", label: "Analytics", icon: AreaChart, match: "/admin/analytics" },
];

// Placeholder data
const announcements = [
    { id: 1, title: "New Platform Update v1.2", date: "2024-06-20", status: "Published" },
    { id: 2, title: "Scheduled Maintenance on Sunday", date: "2024-06-18", status: "Published" },
];

const faqs = [
    { id: 1, question: "Is the AI Symptom Checker a replacement for a doctor?", category: "General", status: "Published" },
    { id: 2, question: "How do I book an appointment?", category: "Appointments", status: "Published" },
];


export default function AdminContentPage() {
  return (
    <DashboardLayout navItems={navItems} userName="Admin User" userRole="Administrator">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold font-headline">Content Management</h1>
        <Button disabled>
            <PlusCircle className="mr-2" />
            Create New (Coming Soon)
        </Button>
      </div>

      <Tabs defaultValue="announcements" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-lg">
          <TabsTrigger value="announcements"><Megaphone className="mr-2" />News & Announcements</TabsTrigger>
          <TabsTrigger value="faqs"><FileQuestion className="mr-2" />FAQs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="announcements">
          <Card>
            <CardHeader>
              <CardTitle>Manage Announcements</CardTitle>
              <CardDescription>Create and manage announcements for all users.</CardDescription>
            </CardHeader>
            <CardContent>
                 <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                       {announcements.map((item) => (
                         <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.title}</TableCell>
                            <TableCell>{item.date}</TableCell>
                            <TableCell>{item.status}</TableCell>
                            <TableCell className="text-right">
                                <Button variant="ghost" size="sm" disabled>Edit</Button>
                            </TableCell>
                         </TableRow>
                       ))}
                    </TableBody>
                </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="faqs">
            <Card>
            <CardHeader>
              <CardTitle>Manage FAQs</CardTitle>
              <CardDescription>Create and manage frequently asked questions.</CardDescription>
            </CardHeader>
            <CardContent>
                 <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Question</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                       {faqs.map((item) => (
                         <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.question}</TableCell>
                            <TableCell>{item.category}</TableCell>
                            <TableCell>{item.status}</TableCell>
                            <TableCell className="text-right">
                                <Button variant="ghost" size="sm" disabled>Edit</Button>
                            </TableCell>
                         </TableRow>
                       ))}
                    </TableBody>
                </Table>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </DashboardLayout>
  );
}
