
"use server";

import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { revalidatePath } from "next/cache";

export async function approveDoctor(userId: string) {
  if (!userId) {
    return { success: false, message: "User ID is required." };
  }

  try {
    const userDocRef = doc(db, "users", userId);
    await updateDoc(userDocRef, {
      verificationStatus: 'approved'
    });

    revalidatePath('/admin/users'); // Revalidate the users page to show updated status
    
    return { success: true, message: "Doctor approved successfully." };
  } catch (error) {
    console.error("Error approving doctor:", error);
    return { success: false, message: "An unexpected error occurred while approving the doctor." };
  }
}
