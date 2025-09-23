
"use client";

import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import type { NavItem } from "@/types";
import { useAuth } from "@/hooks/use-auth";
import {
  Calendar as CalendarIcon,
  LayoutDashboard,
  MessageSquare,
  Users,
  CalendarClock,
  Loader2,
} from "lucide-react";
import { saveAvailability } from "./actions";

const navItems: NavItem[] = [
  { href: "/doctor/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/doctor/appointments", label: "Appointments", icon: CalendarIcon, match: "/doctor/appointments" },
  { href: "/doctor/availability", label: "Availability", icon: CalendarClock, match: "/doctor/availability" },
  { href: "/doctor/patients", label: "Patients", icon: Users, match: "/doctor/patients" },
  { href: "/doctor/messages", label: "Messages", icon: MessageSquare, match: "/doctor/messages" },
];

// Define standard 30-minute slots for a workday
const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 8; hour < 17; hour++) {
    slots.push({ id: `slot-${hour}-00`, time: `${hour.toString().padStart(2, '0')}:00`, label: `${hour % 12 === 0 ? 12 : hour % 12}:00 ${hour < 12 ? 'AM' : 'PM'}` });
    slots.push({ id: `slot-${hour}-30`, time: `${hour.toString().padStart(2, '0')}:30`, label: `${hour % 12 === 0 ? 12 : hour % 12}:30 ${hour < 12 ? 'AM' : 'PM'}` });
  }
  return slots;
};

const timeSlotsOptions = generateTimeSlots();

export default function DoctorAvailabilityPage() {
  const { userData } = useAuth();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSlotChange = (slotId: string) => {
    setSelectedSlots(prev =>
      prev.includes(slotId) ? prev.filter(id => id !== slotId) : [...prev, slotId]
    );
  };

  const handleSubmit = async () => {
    if (!date || !userData) {
        toast({ title: "Error", description: "Please select a date.", variant: "destructive"});
        return;
    }

    setIsSubmitting(true);
    
    const slotsToSave = selectedSlots.map(slotId => {
        const option = timeSlotsOptions.find(opt => opt.id === slotId);
        const [hour, minute] = option!.time.split(':');
        const startTime = new Date(date);
        startTime.setHours(parseInt(hour), parseInt(minute), 0, 0);

        const endTime = new Date(startTime);
        endTime.setMinutes(startTime.getMinutes() + 30);

        return {
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString(),
        }
    });

    try {
        const result = await saveAvailability(userData.uid, date, slotsToSave);
        if (result.success) {
            toast({ title: "Success", description: result.message });
        } else {
            toast({ title: "Error", description: result.message, variant: "destructive" });
        }
    } catch(e) {
        toast({ title: "Error", description: "An unexpected error occurred.", variant: "destructive" });
    } finally {
        setIsSubmitting(false);
    }
  };


  return (
    <DashboardLayout navItems={navItems} userName={userData?.fullName || 'Doctor'} userRole="Doctor">
      <h1 className="text-2xl font-bold mb-4 font-headline">Manage Your Availability</h1>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Select a Date</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border p-0"
                disabled={(day) => day < new Date(new Date().setDate(new Date().getDate() -1))}
              />
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle>Set Available Time Slots</CardTitle>
                    <CardDescription>
                        Select the 30-minute time slots you are available for on {date ? date.toLocaleDateString() : 'the selected date'}.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                        {timeSlotsOptions.map((slot) => (
                           <div key={slot.id} className="flex items-center space-x-2">
                               <Checkbox 
                                id={slot.id} 
                                onCheckedChange={() => handleSlotChange(slot.id)}
                                checked={selectedSlots.includes(slot.id)}
                               />
                               <Label htmlFor={slot.id} className="text-sm font-normal cursor-pointer">{slot.label}</Label>
                           </div>
                        ))}
                    </div>
                    <Button onClick={handleSubmit} disabled={isSubmitting} className="mt-6 w-full">
                        {isSubmitting ? <Loader2 className="animate-spin" /> : "Save Availability"}
                    </Button>
                </CardContent>
            </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
