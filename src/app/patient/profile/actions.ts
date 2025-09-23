
"use server";

import * as z from "zod";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { revalidatePath } from "next/cache";

const profileSchema = z.object({
  fullName: z.string().min(2, "Full name is required."),
  dateOfBirth: z.date(),
  gender: z.string().optional(),
  location: z.string().min(2, "Location is required."),
  phone: z.string().min(10, "A valid phone number is required."),
});

type ProfileInput = z.infer<typeof profileSchema>;

export async function updateUserProfile(userId: string, values: ProfileInput) {
  const validatedFields = profileSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Invalid form data.",
    };
  }

  try {
    const userDocRef = doc(db, "users", userId);
    await updateDoc(userDocRef, validatedFields.data);

    revalidatePath(`/patient/profile`);
    revalidatePath(`/patient/dashboard`); // Revalidate dashboard to show new name if changed

    return {
      success: true,
      message: "Profile updated successfully.",
    };
  } catch (error) {
    console.error("Error updating profile:", error);
    return {
      success: false,
      message: "An unexpected error occurred.",
    };
  }
}
