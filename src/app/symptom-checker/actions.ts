"use server";

import { z } from "zod";
import { aiSymptomChecker } from "@/ai/flows/ai-symptom-checker";

const symptomSchema = z.object({
  symptoms: z.string().min(10, "Please describe your symptoms in more detail."),
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
  const symptoms = formData.get("symptoms");

  const validatedFields = symptomSchema.safeParse({
    symptoms,
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
