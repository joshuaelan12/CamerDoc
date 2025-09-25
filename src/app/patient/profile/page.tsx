
"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import {
  Calendar,
  HeartPulse,
  LayoutDashboard,
  MessageSquare,
  Stethoscope,
  User,
  Loader2,
  CalendarIcon,
  Wallet,
  Newspaper,
  History,
} from "lucide-react";

import type { NavItem } from "@/types";
import { useAuth } from "@/hooks/use-auth";
import { updateUserProfile } from "./actions";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

const navItems: NavItem[] = [
  { href: "/patient/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/patient/find-a-doctor", label: "Find a Doctor", icon: Stethoscope, match: "/patient/find-a-doctor" },
  { href: "/patient/appointments", label: "Appointments", icon: Calendar, match: "/patient/appointments" },
  { href: "/patient/activity", label: "Activity Log", icon: History, match: "/patient/activity" },
  { href: "/patient/news", label: "News & Updates", icon: Newspaper, match: "/patient/news" },
  { href: "/patient/profile", label: "Profile", icon: User, match: "/patient/profile" },
  { href: "/patient/messages", label: "Messages", icon: MessageSquare, match: "/patient/messages" },
  { href: "/symptom-checker", label: "Symptom Checker", icon: HeartPulse },
];

const profileSchema = z.object({
  fullName: z.string().min(2, "Full name is required."),
  dateOfBirth: z.date({ required_error: "A date of birth is required." }),
  gender: z.string().optional(),
  location: z.string().min(2, "Location is required."),
  phone: z.string().min(10, "A valid phone number is required."),
});

export default function PatientProfilePage() {
  const { userData, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: "",
      gender: "",
      location: "",
      phone: "",
    },
  });

  useEffect(() => {
    if (userData) {
      form.reset({
        fullName: userData.fullName || "",
        dateOfBirth: userData.dateOfBirth?.toDate ? userData.dateOfBirth.toDate() : new Date(userData.dateOfBirth),
        gender: userData.gender || "",
        location: userData.location || "",
        phone: userData.phone || "",
      });
    }
  }, [userData, form]);

  async function onSubmit(values: z.infer<typeof profileSchema>) {
    if (!userData) return;

    const result = await updateUserProfile(userData.uid, values);

    if (result.success) {
      toast({
        title: "Profile Updated",
        description: "Your information has been successfully saved.",
      });
    } else {
      toast({
        title: "Update Failed",
        description: result.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  }

  if (authLoading) {
    return (
      <DashboardLayout navItems={navItems} userName="Patient" userRole="Patient">
         <div className="flex items-center justify-center h-full">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout navItems={navItems} userName={userData?.fullName || 'Patient'} userRole="Patient">
      <div className="max-w-2xl mx-auto space-y-8">
        <h1 className="text-2xl font-bold font-headline">My Profile</h1>
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your personal details here.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <Input value={userData?.email || ''} disabled />
                  <FormMessage />
                </FormItem>

                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date of birth</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                            >
                              {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                          <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="City, Country" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="(123) 456-7890" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={form.formState.isSubmitting}>
                   {form.formState.isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Save Changes"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Payment Information</CardTitle>
            <CardDescription>Manage your payment methods for appointments and services. We use Flutterwave to securely process payments.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <Card className="flex items-center justify-between p-4 bg-secondary">
                <div className="flex items-center gap-4">
                    <Wallet className="h-8 w-8 text-muted-foreground" />
                    <div>
                        <h4 className="font-semibold">MTN Mobile Money</h4>
                        <p className="text-sm text-muted-foreground">No account added yet.</p>
                    </div>
                </div>
                <Button variant="outline" disabled>Manage</Button>
            </Card>
            <Button disabled>Add Payment Method (Coming Soon)</Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

    
