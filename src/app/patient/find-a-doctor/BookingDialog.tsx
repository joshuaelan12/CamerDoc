
"use client";

import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { UserData } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Loader2, CalendarCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { createAppointment } from "./actions";

type TimeSlot = {
  startTime: string;
  endTime: string;
};

type AvailabilityData = {
  timeSlots: TimeSlot[];
};

export function BookingDialog({ doctor, patient }: { doctor: UserData; patient: UserData }) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [availability, setAvailability] = useState<AvailabilityData | null>(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [isBooking, setIsBooking] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (date && open) {
      fetchAvailability(date);
    }
  }, [date, open]);

  const fetchAvailability = async (selectedDate: Date) => {
    setLoadingSlots(true);
    setSelectedSlot(null);
    setAvailability(null);
    
    const availabilityDate = new Date(selectedDate);
    availabilityDate.setUTCHours(0, 0, 0, 0); // Normalize date to UTC

    const docId = `${doctor.uid}_${availabilityDate.toISOString().split("T")[0]}`;
    const availabilityRef = doc(db, "availabilities", docId);

    try {
      const docSnap = await getDoc(availabilityRef);
      if (docSnap.exists()) {
        setAvailability(docSnap.data() as AvailabilityData);
      } else {
        setAvailability(null); // No availability set for this date
      }
    } catch (error) {
      console.error("Error fetching availability:", error);
      toast({
        title: "Error",
        description: "Failed to fetch doctor's availability.",
        variant: "destructive",
      });
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleBooking = async () => {
      if (!selectedSlot || !patient) {
          toast({ title: "Error", description: "Please select a time slot.", variant: "destructive" });
          return;
      }
      setIsBooking(true);
      try {
          const result = await createAppointment(doctor.uid, patient.uid, selectedSlot);
          if (result.success) {
              toast({ title: "Success!", description: "Your appointment has been booked." });
              setOpen(false);
          } else {
              toast({ title: "Booking Failed", description: result.message, variant: "destructive" });
          }
      } catch (error) {
          toast({ title: "Error", description: "An unexpected error occurred during booking.", variant: "destructive" });
      } finally {
          setIsBooking(false);
      }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">
            <CalendarCheck className="mr-2" />
            View Availability
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Book an Appointment with {doctor.fullName}</DialogTitle>
          <DialogDescription>
            Select a date and time that works for you.
          </DialogDescription>
        </DialogHeader>
        <div className="grid md:grid-cols-2 gap-8 py-4">
            <div>
                 <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border p-0"
                    disabled={(day) => day < new Date(new Date().setDate(new Date().getDate() -1))}
                />
            </div>
            <div>
                <h3 className="font-semibold mb-4 text-center md:text-left">
                    Available Slots for {date?.toLocaleDateString()}
                </h3>
                {loadingSlots ? (
                    <div className="flex justify-center items-center h-48">
                        <Loader2 className="animate-spin text-primary" />
                    </div>
                ) : availability && availability.timeSlots.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                       {availability.timeSlots.sort((a,b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()).map((slot) => (
                           <Button 
                            key={slot.startTime} 
                            variant={selectedSlot?.startTime === slot.startTime ? "default" : "outline"}
                            onClick={() => setSelectedSlot(slot)}
                           >
                               {new Date(slot.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })}
                           </Button>
                       ))}
                    </div>
                ) : (
                    <div className="text-center text-muted-foreground pt-10">
                        <p>No available slots for this day.</p>
                        <p className="text-sm">Please select another date.</p>
                    </div>
                )}
            </div>
        </div>
        <DialogFooter>
            <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleBooking} disabled={!selectedSlot || isBooking}>
                {isBooking ? <Loader2 className="animate-spin" /> : `Book for ${selectedSlot ? new Date(selectedSlot.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' }) : ''}`}
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
