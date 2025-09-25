
"use client";

import { useEffect, useState, useRef, useTransition } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { NavItem, UserData, Message } from "@/types";
import { useAuth } from "@/hooks/use-auth";
import {
  Calendar,
  LayoutDashboard,
  MessageSquare,
  Users,
  CalendarClock,
  User,
  Send,
  Loader2,
  Newspaper,
  ArrowLeft,
  History,
} from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { getConversations, sendMessage } from "./actions";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { cn } from "@/lib/utils";


const navItems: NavItem[] = [
  { href: "/doctor/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/doctor/appointments", label: "Appointments", icon: Calendar, match: "/doctor/appointments" },
  { href: "/doctor/availability", label: "Availability", icon: CalendarClock, match: "/doctor/availability" },
  { href: "/doctor/patients", label: "Patients", icon: Users, match: "/doctor/patients" },
  { href: "/doctor/news", label: "News & Updates", icon: Newspaper, match: "/doctor/news" },
  { href: "/doctor/activity", label: "Activity Log", icon: History, match: "/doctor/activity" },
  { href: "/doctor/profile", label: "Profile", icon: User, match: "/doctor/profile" },
  { href: "/doctor/messages", label: "Messages", icon: MessageSquare, match: "/doctor/messages" },
];

export default function DoctorMessagesPage() {
  const { userData } = useAuth();
  const { toast } = useToast();
  const [conversations, setConversations] = useState<UserData[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<UserData | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, startSendingTransition] = useTransition();
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const userAvatar = PlaceHolderImages.find((img) => img.id === "avatar-1");

  // Fetch all unique patients the doctor has had appointments with
  useEffect(() => {
    if (userData) {
      setLoadingConversations(true);
      getConversations(userData.uid)
        .then(setConversations)
        .finally(() => setLoadingConversations(false));
    }
  }, [userData]);

  // Set up real-time listener for messages when a conversation is selected
  useEffect(() => {
    if (!selectedConversation || !userData) return;

    setLoadingMessages(true);
    const conversationId = [userData.uid, selectedConversation.uid].sort().join('_');
    const messagesQuery = query(
      collection(db, "messages"),
      where("conversationId", "==", conversationId)
    );

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const newMessages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toMillis(),
      })) as Message[];
      // client-side sort
      newMessages.sort((a, b) => a.createdAt - b.createdAt);
      setMessages(newMessages);
      setLoadingMessages(false);
    }, (error) => {
        console.error("Error fetching real-time messages:", error);
        toast({ title: "Error", description: "Could not load messages.", variant: "destructive"});
        setLoadingMessages(false);
    });

    return () => unsubscribe(); // Cleanup listener on unmount or when conversation changes

  }, [selectedConversation, userData, toast]);


  // Scroll to bottom when new messages are added
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [messages]);


  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || !userData) return;
    const currentMessage = newMessage;
    setNewMessage(""); // Clear input immediately for better UX

    startSendingTransition(async () => {
      const result = await sendMessage(userData.uid, selectedConversation.uid, currentMessage);
      if (!result.success) {
        setNewMessage(currentMessage); // Restore message on failure
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive"
        });
      }
    });
  };

  return (
    <DashboardLayout navItems={navItems} userName={userData?.fullName || 'Doctor'} userRole="Doctor">
        <h1 className="text-2xl font-bold mb-4 font-headline">My Messages</h1>
        <Card className="h-[calc(100vh-10rem)] md:flex overflow-hidden">
           <div className={cn("md:w-1/3 border-r h-full flex-col", selectedConversation ? "hidden md:flex" : "flex")}>
                <CardHeader>
                    <CardTitle>Patients</CardTitle>
                </CardHeader>
                <ScrollArea className="h-full">
                    <div className="space-y-1 p-2 pt-0">
                       {loadingConversations ? (
                          <div className="flex justify-center items-center h-full p-4">
                            <Loader2 className="animate-spin text-primary" />
                          </div>
                        ) : conversations.length > 0 ? (
                           conversations.map(patient => {
                             const patientAvatar = PlaceHolderImages.find((img) => img.id === "avatar-2");
                             return (
                                <div 
                                    key={patient.uid} 
                                    className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-muted ${selectedConversation?.uid === patient.uid ? 'bg-muted' : ''}`}
                                    onClick={() => setSelectedConversation(patient)}
                                >
                                    <Avatar>
                                        {patientAvatar && <AvatarImage src={patientAvatar.imageUrl} alt={patient.fullName} data-ai-hint={patientAvatar.imageHint}/>}
                                        <AvatarFallback>{patient.fullName.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 truncate">
                                        <p className="font-semibold">{patient.fullName}</p>
                                        <p className="text-sm text-muted-foreground truncate">{patient.email}</p>
                                    </div>
                                </div>
                            )
                        })
                       ) : (
                          <div className="p-4 text-center text-sm text-muted-foreground">
                            No patient conversations yet.
                          </div>
                       )}
                    </div>
                </ScrollArea>
           </div>
           <div className={cn("md:w-2/3 flex flex-col h-full", selectedConversation ? "flex" : "hidden md:flex")}>
              {selectedConversation ? (
                <>
                  <CardHeader className="flex-row items-center justify-between border-b">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSelectedConversation(null)}>
                            <ArrowLeft />
                        </Button>
                        <div>
                            <CardTitle className="text-lg">{selectedConversation.fullName}</CardTitle>
                            <CardDescription>{selectedConversation.email}</CardDescription>
                        </div>
                      </div>
                  </CardHeader>
                  <CardContent ref={scrollAreaRef} className="flex-1 p-4 overflow-y-auto">
                      {loadingMessages ? (
                        <div className="flex justify-center items-center h-full">
                          <Loader2 className="animate-spin text-primary" />
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {messages.map(msg => {
                              const isSender = msg.senderId === userData?.uid;
                              const avatar = isSender ? userAvatar : PlaceHolderImages.find((img) => img.id === "avatar-2");
                              return (
                                <div key={msg.id} className={`flex items-end gap-2 ${isSender ? 'justify-end' : ''}`}>
                                    {!isSender && 
                                        <Avatar className="h-8 w-8">
                                            {avatar && <AvatarImage src={avatar.imageUrl} alt={selectedConversation.fullName} data-ai-hint={avatar.imageHint} />}
                                            <AvatarFallback>{selectedConversation.fullName.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                    }
                                    <div className={`max-w-xs md:max-w-md p-3 rounded-xl ${isSender ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                        <p className="text-sm whitespace-pre-line">{msg.text}</p>
                                         <p className={`text-xs mt-1 ${isSender ? 'text-primary-foreground/70' : 'text-muted-foreground/70'}`}>
                                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                    {isSender && 
                                        <Avatar className="h-8 w-8">
                                            {avatar && <AvatarImage src={avatar.imageUrl} alt={userData?.fullName || 'Me'} data-ai-hint={avatar.imageHint}/>}
                                            <AvatarFallback>{userData?.fullName?.charAt(0) || 'D'}</AvatarFallback>
                                        </Avatar>
                                    }
                                </div>
                              )
                          })}
                        </div>
                      )}
                  </CardContent>
                  <div className="p-4 border-t">
                      <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="relative">
                          <Input 
                            placeholder="Type a message..." 
                            className="pr-12" 
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                          />
                          <Button size="icon" type="submit" className="absolute top-1/2 right-1 -translate-y-1/2 h-8 w-10" disabled={isSending}>
                              {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                          </Button>
                      </form>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                    <MessageSquare className="h-16 w-16 mb-4" />
                    <p>Select a patient to view messages</p>
                </div>
              )}
           </div>
        </Card>
    </DashboardLayout>
  );
}
