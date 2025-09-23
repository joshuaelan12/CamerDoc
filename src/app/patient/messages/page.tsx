
"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { NavItem } from "@/types";
import { useAuth } from "@/hooks/use-auth";
import {
  Calendar,
  HeartPulse,
  LayoutDashboard,
  MessageSquare,
  ScrollText,
  Stethoscope,
  Send,
  User,
} from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";


const navItems: NavItem[] = [
  { href: "/patient/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/patient/find-a-doctor", label: "Find a Doctor", icon: Stethoscope, match: "/patient/find-a-doctor" },
  { href: "/patient/appointments", label: "Appointments", icon: Calendar, match: "/patient/appointments" },
  { href: "/patient/history", label: "Medical History", icon: ScrollText, match: "/patient/history" },
  { href: "/patient/profile", label: "Profile", icon: User, match: "/patient/profile" },
  { href: "/patient/messages", label: "Messages", icon: MessageSquare, match: "/patient/messages" },
  { href: "/symptom-checker", label: "Symptom Checker", icon: HeartPulse },
];

// Placeholder Data
const conversations = [
    { id: 1, name: "Dr. Emily Carter", lastMessage: "Yes, that sounds like a good plan.", avatarId: "avatar-2" },
    { id: 2, name: "Dr. John Adebayo", lastMessage: "Please remember to take the full course.", avatarId: "avatar-3" },
];

const messages = [
    { id: 1, sender: "other", text: "Hello! I wanted to follow up on our last appointment." },
    { id: 2, sender: "me", text: "Hi Dr. Carter. I'm feeling much better, thank you." },
    { id: 3, sender: "other", text: "That's great to hear. Are you still experiencing any headaches?" },
    { id: 4, sender: "me", text: "Only occasionally, and they are much milder." },
    { id: 5, sender: "other", text: "Good. Let's continue with the current plan and check in again in a week." },
    { id: 6, sender: "me", text: "Okay, sounds good. Thanks!" },
    { id: 7, sender: "other", text: "You're welcome. Have a great day!" },
];


export default function PatientMessagesPage() {
  const { userData } = useAuth();
  const userAvatar = PlaceHolderImages.find((img) => img.id === "avatar-1");

  return (
    <DashboardLayout navItems={navItems} userName={userData?.fullName || 'Patient'} userRole="Patient">
        <h1 className="text-2xl font-bold mb-4 font-headline">My Messages</h1>
        <Card className="h-[calc(100vh-10rem)] flex">
           <div className="w-1/3 border-r">
                <CardHeader>
                    <CardTitle>Conversations</CardTitle>
                </CardHeader>
                <ScrollArea className="h-[calc(100%-4rem)]">
                    <div className="space-y-2 p-4 pt-0">
                        {conversations.map(convo => {
                             const convoAvatar = PlaceHolderImages.find((img) => img.id === convo.avatarId);
                             return (
                                <div key={convo.id} className="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-muted bg-accent">
                                    <Avatar>
                                        {convoAvatar && <AvatarImage src={convoAvatar.imageUrl} alt={convo.name} data-ai-hint={convoAvatar.imageHint}/>}
                                        <AvatarFallback>{convo.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 truncate">
                                        <p className="font-semibold">{convo.name}</p>
                                        <p className="text-sm text-muted-foreground truncate">{convo.lastMessage}</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </ScrollArea>
           </div>
           <div className="w-2/3 flex flex-col">
                <CardHeader className="flex-row items-center justify-between border-b">
                     <CardTitle className="text-lg">Dr. Emily Carter</CardTitle>
                     <CardDescription>Online</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 p-4 overflow-y-auto">
                    <div className="space-y-4">
                        {messages.map(msg => (
                            <div key={msg.id} className={`flex items-end gap-2 ${msg.sender === 'me' ? 'justify-end' : ''}`}>
                                {msg.sender === 'other' && 
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src="https://picsum.photos/seed/avatar2/100/100" alt="Dr. Carter" data-ai-hint="woman portrait"/>
                                        <AvatarFallback>EC</AvatarFallback>
                                    </Avatar>
                                }
                                <div className={`max-w-xs md:max-w-md p-3 rounded-xl ${msg.sender === 'me' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                    <p className="text-sm">{msg.text}</p>
                                </div>
                                 {msg.sender === 'me' && 
                                    <Avatar className="h-8 w-8">
                                         {userAvatar && <AvatarImage src={userAvatar.imageUrl} alt={userData?.fullName || 'Me'} data-ai-hint={userAvatar.imageHint}/>}
                                        <AvatarFallback>{userData?.fullName?.charAt(0) || 'M'}</AvatarFallback>
                                    </Avatar>
                                }
                            </div>
                        ))}
                    </div>
                </CardContent>
                <div className="p-4 border-t">
                    <div className="relative">
                        <Input placeholder="Type a message..." className="pr-12" />
                        <Button size="icon" className="absolute top-1/2 right-1 -translate-y-1/2 h-8 w-10">
                            <Send className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
           </div>
        </Card>
    </DashboardLayout>
  );
}

    