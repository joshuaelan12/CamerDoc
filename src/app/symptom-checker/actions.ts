
"use server";

import { z } from "zod";
import { aiSymptomChecker } from "@/ai/flows/ai-symptom-checker";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

const symptomSchema = z.object({
  symptoms: z.string().min(10, "Please describe your symptoms in more detail."),
  userId: z.string().optional(),
});

type AnalysisResult = {
  potentialCauses: string;
  recommendations: string;
};

type FormState = {
  success: boolean;
  message: string;
  analysis?: AnalysisResult | null;
};

export async function getSymptomAnalysis(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = symptomSchema.safeParse({
    symptoms: formData.get("symptoms"),
    userId: formData.get("userId"),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Validation failed.",
      analysis: null,
    };
  }

  try {
    const result = await aiSymptomChecker({
      symptoms: validatedFields.data.symptoms,
    });

    const { userId, symptoms } = validatedFields.data;

    // Log the check to Firestore
    await addDoc(collection(db, "symptomChecks"), {
        userId: userId || null, // Store null if user is not logged in
        symptoms,
        potentialCauses: result.potentialCauses,
        recommendations: result.recommendations,
        createdAt: serverTimestamp(),
    });
    
    return {
      success: true,
      message: "Analysis successful.",
      analysis: result,
    };
  } catch (error) {
    console.error("AI Symptom Checker Error:", error);
    return {
      success: false,
      message: "An error occurred while analyzing your symptoms. Please try again later.",
      analysis: null,
    };
  }
}
