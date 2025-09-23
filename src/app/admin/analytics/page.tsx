
"use client";

import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { NavItem } from "@/types";
import {
  AreaChart,
  Cog,
  LayoutDashboard,
  Users,
  BarChart as BarChartIcon,
  PieChart
} from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const navItems: NavItem[] = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/users", label: "Manage Users", icon: Users, match: "/admin/users" },
  { href: "/admin/settings", label: "System Settings", icon: Cog, match: "/admin/settings" },
  { href: "/admin/analytics", label: "Analytics", icon: AreaChart, match: "/admin/analytics" },
];

// Placeholder data - in a real app, this would come from your database
const userSignupsData = [
  { date: "Jan", users: 12 },
  { date: "Feb", users: 19 },
  { date: "Mar", users: 31 },
  { date: "Apr", users: 45 },
  { date: "May", users: 60 },
  { date: "Jun", users: 78 },
];

const userRolesData = [
    { role: "Patients", count: 125, fill: "hsl(var(--chart-1))" },
    { role: "Doctors", count: 28, fill: "hsl(var(--chart-2))" },
];

const symptomChecksData = [
    { date: '2024-05-01', count: 15 },
    { date: '2024-05-02', count: 22 },
    { date: '2024-05-03', count: 18 },
    { date: '2024-05-04', count: 25 },
    { date: '2024-05-05', count: 30 },
    { date: '2024-05-06', count: 28 },
    { date: '2024-05-07', count: 35 },
];

const chartConfig = {
  users: {
    label: "New Users",
    color: "hsl(var(--chart-1))",
  },
  count: {
    label: "Count",
    color: "hsl(var(--chart-1))",
  },
};


export default function AdminAnalyticsPage() {
  return (
    <DashboardLayout navItems={navItems} userName="Admin User" userRole="Administrator">
      <h1 className="text-2xl font-bold mb-4 font-headline">Platform Analytics</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
         <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">Coming Soon</div>
                <p className="text-xs text-muted-foreground">From subscriptions & appointments</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Bounce Rate</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">Coming Soon</div>
                <p className="text-xs text-muted-foreground">From marketing pages</p>
            </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 mt-6 md:grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><AreaChart className="h-5 w-5" /> User Sign-ups Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[250px] w-full">
              <LineChart data={userSignupsData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis />
                <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="line" />}
                />
                <Line type="monotone" dataKey="users" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><PieChart className="h-5 w-5" /> User Role Distribution</CardTitle>
          </CardHeader>
          <CardContent>
             <ChartContainer config={{}} className="h-[250px] w-full">
               <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={userRolesData} layout="vertical" margin={{ left: 10 }}>
                        <XAxis type="number" hide />
                        <YAxis type="category" dataKey="role" hide />
                        <Tooltip cursor={{ fill: 'transparent' }} content={<ChartTooltipContent hideLabel />} />
                        <Bar dataKey="count" radius={5} background={{ fill: 'hsl(var(--muted))', radius: 5 }} />
                    </BarChart>
                </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><BarChartIcon className="h-5 w-5" /> Symptom Checks (Last 7 Days)</CardTitle>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px] w-full">
                    <BarChart data={symptomChecksData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey="date" tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} tickLine={false} axisLine={false} tickMargin={8}/>
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="count" fill="hsl(var(--primary))" radius={4} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
