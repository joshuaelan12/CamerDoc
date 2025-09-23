
"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
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
  Loader2,
} from "lucide-react";
import { createAnnouncement, createFaq } from "./actions";

const navItems: NavItem[] = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/users", label: "Manage Users", icon: Users, match: "/admin/users" },
  { href: "/admin/payments", label: "Payments", icon: CreditCard, match: "/admin/payments" },
  { href: "/admin/content", label: "Content", icon: Newspaper, match: "/admin/content" },
  { href: "/admin/settings", label: "System Settings", icon: Cog, match: "/admin/settings" },
  { href: "/admin/analytics", label: "Analytics", icon: AreaChart, match: "/admin/analytics" },
];

type Announcement = {
    id: string;
    title: string;
    content: string;
    createdAt: Timestamp;
    status: 'draft' | 'published';
};

type Faq = {
    id: string;
    question: string;
    answer: string;
    category: string;
    status: 'draft' | 'published';
};

function CreateContentDialog() {
    const [open, setOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activeTab, setActiveTab] = useState("announcement");

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSubmitting(true);
        const formData = new FormData(event.currentTarget);
        const data = Object.fromEntries(formData.entries());

        try {
            if (activeTab === "announcement") {
                await createAnnouncement({
                    title: data.title as string,
                    content: data.content as string,
                });
                toast({ title: "Success", description: "Announcement created." });
            } else {
                 await createFaq({
                    question: data.question as string,
                    answer: data.answer as string,
                    category: data.category as string,
                });
                toast({ title: "Success", description: "FAQ created." });
            }
            setOpen(false);
        } catch (error) {
            console.error("Failed to create content:", error);
            toast({ title: "Error", description: "Failed to create content.", variant: "destructive" });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <PlusCircle className="mr-2" />
                    Create New
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[625px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Create New Content</DialogTitle>
                        <DialogDescription>Add a new announcement or FAQ to the platform.</DialogDescription>
                    </DialogHeader>
                    <Tabs defaultValue="announcement" onValueChange={setActiveTab} className="mt-4">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="announcement">Announcement</TabsTrigger>
                            <TabsTrigger value="faq">FAQ</TabsTrigger>
                        </TabsList>
                        <TabsContent value="announcement">
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="title" className="text-right">Title</Label>
                                    <Input id="title" name="title" className="col-span-3" required />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="content" className="text-right">Content</Label>
                                    <Textarea id="content" name="content" className="col-span-3" required />
                                </div>
                            </div>
                        </TabsContent>
                        <TabsContent value="faq">
                             <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="question" className="text-right">Question</Label>
                                    <Input id="question" name="question" className="col-span-3" required />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="answer" className="text-right">Answer</Label>
                                    <Textarea id="answer" name="answer" className="col-span-3" required />
                                </div>
                                 <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="category" className="text-right">Category</Label>
                                    <Input id="category" name="category" className="col-span-3" required />
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                    <DialogFooter>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save changes
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default function AdminContentPage() {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [faqs, setFaqs] = useState<Faq[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const annCollection = collection(db, "announcements");
        const faqCollection = collection(db, "faqs");

        const unsubAnn = onSnapshot(annCollection, (snapshot) => {
            setAnnouncements(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Announcement)));
            setLoading(false);
        });
        const unsubFaq = onSnapshot(faqCollection, (snapshot) => {
            setFaqs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Faq)));
            setLoading(false);
        });

        return () => {
            unsubAnn();
            unsubFaq();
        }
    }, []);

  return (
    <DashboardLayout navItems={navItems} userName="Admin User" userRole="Administrator">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold font-headline">Content Management</h1>
        <CreateContentDialog />
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
                       {loading ? <TableRow><TableCell colSpan={4} className="text-center">Loading...</TableCell></TableRow> :
                        announcements.map((item) => (
                         <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.title}</TableCell>
                            <TableCell>{item.createdAt.toDate().toLocaleDateString()}</TableCell>
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
                       {loading ? <TableRow><TableCell colSpan={4} className="text-center">Loading...</TableCell></TableRow> :
                        faqs.map((item) => (
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
