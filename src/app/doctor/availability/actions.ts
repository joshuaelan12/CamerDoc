
"use server";

import { db } from "@/lib/firebase";
import { collection, doc, setDoc } from "firebase/firestore";
import { revalidatePath } from "next/cache";

type TimeSlot = {
  startTime: string;
  endTime: string;
};

export async function saveAvailability(
  doctorId: string,
  date: Date,
  timeSlots: TimeSlot[]
) {
  try {
    const availabilityDate = new Date(date);
    availabilityDate.setHours(0, 0, 0, 0); // Normalize date to start of day

    const docId = `${doctorId}_${availabilityDate.toISOString().split("T")[0]}`;
    const availabilityRef = doc(db, "availabilities", docId);

    await setDoc(availabilityRef, {
      doctorId,
      date: availabilityDate,
      timeSlots,
    });

    revalidatePath(`/doctor/availability`);
    return { success: true, message: "Availability saved successfully." };
  } catch (error) {
    console.error("Error saving availability:", error);
    return {
      success: false,
      message: "An unexpected error occurred while saving availability.",
    };
  }
}
