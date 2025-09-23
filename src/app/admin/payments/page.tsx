
"use client";

import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { NavItem } from "@/types";
import {
  AreaChart,
  Cog,
  LayoutDashboard,
  Users,
  CreditCard,
  DollarSign,
  TrendingUp,
  Newspaper,
} from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const navItems: NavItem[] = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/users", label: "Manage Users", icon: Users, match: "/admin/users" },
  { href: "/admin/payments", label: "Payments", icon: CreditCard, match: "/admin/payments" },
  { href: "/admin/content", label: "Content", icon: Newspaper, match: "/admin/content" },
  { href: "/admin/settings", label: "System Settings", icon: Cog, match: "/admin/settings" },
  { href: "/admin/analytics", label: "Analytics", icon: AreaChart, match: "/admin/analytics" },
];

// Placeholder data
const revenueData = [
  { month: "Jan", revenue: 2400000 },
  { month: "Feb", revenue: 1800000 },
  { month: "Mar", revenue: 3000000 },
  { month: "Apr", revenue: 2700000 },
  { month: "May", revenue: 3600000 },
  { month: "Jun", revenue: 3300000 },
];

const transactionsData = [
    { id: 'txn_1a2b3c', date: '2024-06-15', amount: 29994, type: 'Appointment', status: 'Completed' },
    { id: 'txn_4d5e6f', date: '2024-06-14', amount: 11994, type: 'Subscription', status: 'Completed' },
    { id: 'txn_7g8h9i', date: '2024-06-14', amount: 29994, type: 'Appointment', status: 'Refunded' },
    { id: 'txn_j1k2l3', date: '2024-06-13', amount: 11994, type: 'Subscription', status: 'Completed' },
    { id: 'txn_m4n5o6', date: '2024-06-12', amount: 29994, type: 'Appointment', status: 'Completed' },
];

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--chart-1))",
  },
};

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-CM', { style: 'currency', currency: 'XAF' }).format(amount);
}

export default function AdminPaymentsPage() {
  return (
    <DashboardLayout navItems={navItems} userName="Admin User" userRole="Administrator">
      <h1 className="text-2xl font-bold mb-4 font-headline">Payments & Revenue</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(17399400)}</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Commissions Earned</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(3479880)}</div>
            <p className="text-xs text-muted-foreground">20% of total revenue</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+1024</div>
            <p className="text-xs text-muted-foreground">+15.3% from last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 mt-6 grid-cols-1">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><AreaChart className="h-5 w-5" /> Revenue Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <LineChart data={revenueData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis tickFormatter={(value) => formatCurrency(value as number).replace('XAF', '').trim()} />
                <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="line" formatter={(value) => formatCurrency(value as number)} />}
                />
                <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
                 <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Transaction ID</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {transactionsData.map((txn) => (
                        <TableRow key={txn.id}>
                            <TableCell className="font-mono text-xs">{txn.id}</TableCell>
                            <TableCell>{txn.date}</TableCell>
                            <TableCell>
                                <Badge variant="secondary">{txn.type}</Badge>
                            </TableCell>
                             <TableCell>
                                <Badge variant={txn.status === 'Completed' ? 'default' : 'destructive'}>{txn.status}</Badge>
                            </TableCell>
                            <TableCell className="text-right font-medium">{formatCurrency(txn.amount)}</TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
