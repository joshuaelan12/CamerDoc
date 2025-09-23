
"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query, Timestamp, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { NavItem } from "@/types";
import { useAuth } from "@/hooks/use-auth";
import {
  Calendar,
  LayoutDashboard,
  MessageSquare,
  Users,
  FileQuestion,
  Megaphone,
  Loader2,
  CalendarClock,
  User,
  Newspaper,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const navItems: NavItem[] = [
  { href: "/doctor/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/doctor/appointments", label: "Appointments", icon: Calendar, match: "/doctor/appointments" },
  { href: "/doctor/availability", label: "Availability", icon: CalendarClock, match: "/doctor/availability" },
  { href: "/doctor/patients", label: "Patients", icon: Users, match: "/doctor/patients" },
  { href: "/doctor/news", label: "News & Updates", icon: Newspaper, match: "/doctor/news" },
  { href: "/doctor/profile", label: "Profile", icon: User, match: "/doctor/profile" },
  { href: "/doctor/messages", label: "Messages", icon: MessageSquare, match: "/doctor/messages" },
];

type Announcement = {
    id: string;
    title: string;
    content: string;
    createdAt: Timestamp;
};

type Faq = {
    id: string;
    question: string;
    answer: string;
    category: string;
};

export default function DoctorNewsPage() {
    const { userData } = useAuth();
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [faqs, setFaqs] = useState<Faq[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        const annQuery = query(collection(db, "announcements"), where("status", "==", "published"), orderBy("createdAt", "desc"));
        const faqQuery = query(collection(db, "faqs"), where("status", "==", "published"));

        const unsubAnn = onSnapshot(annQuery, (snapshot) => {
            setAnnouncements(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Announcement)));
            checkLoadingComplete();
        });

        const unsubFaq = onSnapshot(faqQuery, (snapshot) => {
            const faqsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Faq));
            setFaqs(faqsData);
            checkLoadingComplete();
        });
        
        let loadedCount = 0;
        const checkLoadingComplete = () => {
            loadedCount++;
            if(loadedCount === 2) {
                setLoading(false);
            }
        }

        return () => {
            unsubAnn();
            unsubFaq();
        };
    }, []);

    const groupedFaqs = faqs.reduce((acc, faq) => {
        (acc[faq.category] = acc[faq.category] || []).push(faq);
        return acc;
    }, {} as Record<string, Faq[]>);


  return (
    <DashboardLayout navItems={navItems} userName={userData?.fullName || 'Doctor'} userRole="Doctor">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold font-headline">News &amp; Updates</h1>
      </div>
      
       <Tabs defaultValue="announcements" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-lg">
          <TabsTrigger value="announcements"><Megaphone className="mr-2" />Announcements</TabsTrigger>
          <TabsTrigger value="faqs"><FileQuestion className="mr-2" />FAQs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="announcements">
            {loading ? (
                <div className="flex justify-center items-center h-48">
                    <Loader2 className="animate-spin text-primary" />
                </div>
            ) : announcements.length > 0 ? (
                <div className="space-y-4 mt-4">
                    {announcements.map((item) => (
                         <Card key={item.id}>
                            <CardHeader>
                                <CardTitle>{item.title}</CardTitle>
                                <CardDescription>
                                    Published on {item.createdAt.toDate().toLocaleDateString()}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground whitespace-pre-line">{item.content}</p>
                            </CardContent>
                         </Card>
                    ))}
                </div>
            ) : (
                <Card className="mt-4">
                    <CardContent className="pt-6 text-center text-muted-foreground">
                        <p>No announcements at this time.</p>
                    </CardContent>
                </Card>
            )}
        </TabsContent>

        <TabsContent value="faqs">
            {loading ? (
                 <div className="flex justify-center items-center h-48">
                    <Loader2 className="animate-spin text-primary" />
                </div>
            ) : Object.keys(groupedFaqs).length > 0 ? (
                <div className="mt-4 space-y-6">
                    {Object.entries(groupedFaqs).map(([category, faqItems]) => (
                        <div key={category}>
                            <h2 className="text-xl font-semibold mb-2 capitalize">{category}</h2>
                            <Accordion type="single" collapsible className="w-full">
                                {faqItems.map((faq) => (
                                    <AccordionItem key={faq.id} value={faq.id}>
                                        <AccordionTrigger className="text-base text-left">{faq.question}</AccordionTrigger>
                                        <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </div>
                    ))}
                </div>
            ) : (
                 <Card className="mt-4">
                    <CardContent className="pt-6 text-center text-muted-foreground">
                        <p>No FAQs available at this time.</p>
                    </CardContent>
                </Card>
            )}
        </TabsContent>

      </Tabs>
    </DashboardLayout>
  );
}

    