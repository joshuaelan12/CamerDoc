
"use server";

import { db } from "@/lib/firebase";
import { collection, doc, runTransaction, serverTimestamp, Timestamp } from "firebase/firestore";
import { revalidatePath } from "next/cache";

export async function createAppointment(
  doctorId: string,
  patientId: string,
  slot: { startTime: string; endTime: string }
) {
  try {
    // Use a transaction to ensure atomicity
    await runTransaction(db, async (transaction) => {
      // 1. Create a new appointment document
      const appointmentRef = doc(collection(db, "appointments"));
      transaction.set(appointmentRef, {
        doctorId,
        patientId,
        startTime: Timestamp.fromDate(new Date(slot.startTime)),
        endTime: Timestamp.fromDate(new Date(slot.endTime)),
        status: "scheduled",
        createdAt: serverTimestamp(),
      });

      // 2. Update the doctor's availability
      const availabilityDate = new Date(slot.startTime);
      availabilityDate.setUTCHours(0, 0, 0, 0); // Normalize to the start of the day in UTC
      const availabilityDocId = `${doctorId}_${availabilityDate.toISOString().split("T")[0]}`;
      const availabilityRef = doc(db, "availabilities", availabilityDocId);

      const availabilityDoc = await transaction.get(availabilityRef);
      if (!availabilityDoc.exists()) {
        throw new Error("Doctor's availability not found.");
      }

      const currentSlots = availabilityDoc.data().timeSlots || [];
      const updatedSlots = currentSlots.filter(
        (s: { startTime: string; endTime: string }) => s.startTime !== slot.startTime
      );

      transaction.update(availabilityRef, { timeSlots: updatedSlots });
    });

    // Revalidate paths to update the UI
    revalidatePath(`/patient/appointments`);
    revalidatePath(`/doctor/appointments`);

    return { success: true, message: "Appointment booked successfully." };
  } catch (error) {
    console.error("Error creating appointment:", error);
    if (error instanceof Error) {
        return { success: false, message: error.message };
    }
    return {
      success: false,
      message: "An unexpected error occurred while booking the appointment.",
    };
  }
}
