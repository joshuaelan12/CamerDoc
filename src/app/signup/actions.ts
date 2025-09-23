
"use server";

import * as z from "zod";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

const signupSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["patient", "doctor"]),
  specialization: z.string().optional(),
  hospitalAffiliation: z.string().optional(),
  dateOfBirth: z.date().optional(),
  gender: z.string().optional(),
  location: z.string().optional(),
  phone: z.string().optional(),
});

type SignupInput = z.infer<typeof signupSchema>;

type FormState = {
  success: boolean;
  message: string;
  role?: "patient" | "doctor";
};

export async function createUser(values: SignupInput): Promise<FormState> {
  const validatedFields = signupSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Invalid form data.",
    };
  }

  const { fullName, email, password, role, specialization, hospitalAffiliation, dateOfBirth, gender, location, phone } = validatedFields.data;

  try {
    // Create user in Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    const userData: any = {
      uid: user.uid,
      fullName,
      email,
      role,
      createdAt: serverTimestamp(),
    };

    if (role === 'doctor') {
      userData.specialization = specialization;
      userData.hospitalAffiliation = hospitalAffiliation || "";
      userData.phone = phone;
      userData.verificationStatus = 'pending';
    }

    if (role === 'patient') {
      if (dateOfBirth) userData.dateOfBirth = dateOfBirth;
      if (gender) userData.gender = gender;
      if (location) userData.location = location;
      if (phone) userData.phone = phone;
    }

    // Create user document in Firestore
    await setDoc(doc(db, "users", user.uid), userData);

    return {
      success: true,
      message: "User created successfully.",
      role,
    };
  } catch (error: any) {
    let errorMessage = "An unexpected error occurred.";
    if (error.code === "auth/email-already-in-use") {
      errorMessage = "This email address is already in use.";
    }
    return {
      success: false,
      message: errorMessage,
    };
  }
}
