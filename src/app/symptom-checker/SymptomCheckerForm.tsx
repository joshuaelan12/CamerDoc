
"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Lightbulb, Loader2, ServerCrash, Sparkles, TriangleAlert } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

type FormState = {
  success: boolean;
  message: string;
  analysis?: {
    potentialCauses: string;
    recommendations: string;
  } | null;
};

const initialState: FormState = {
  success: false,
  message: "",
  analysis: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Analyzing...
        </>
      ) : (
        <>
          <Sparkles className="mr-2 h-4 w-4" />
          Analyze Symptoms
        </>
      )}
    </Button>
  );
}

export function SymptomCheckerForm({ getSymptomAnalysis }: { getSymptomAnalysis: (prevState: FormState, formData: FormData) => Promise<FormState> }) {
  const [state, formAction] = useActionState(getSymptomAnalysis, initialState);
  const { user } = useAuth();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">AI Symptom Checker</CardTitle>
        <CardDescription>
          Describe your symptoms below, and our AI will provide potential causes and recommendations.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <Textarea
            name="symptoms"
            placeholder="e.g., 'I have a sore throat, a mild fever, and a headache...'"
            rows={5}
            required
            className="text-base"
          />

          {user && <input type="hidden" name="userId" value={user.uid} />}

          <Alert>
            <TriangleAlert className="h-4 w-4" />
            <AlertTitle>Disclaimer</AlertTitle>
            <AlertDescription>
              This tool does not provide medical advice. It is intended for informational purposes only. Consult with a medical professional for diagnosis and treatment.
            </AlertDescription>
          </Alert>

          <SubmitButton />
        </form>

        {state.message && !state.success && (
          <Alert variant="destructive" className="mt-4">
            <ServerCrash className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{state.message}</AlertDescription>
          </Alert>
        )}
        
        {state.analysis && (
          <div className="mt-6 space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center gap-2">
                <Lightbulb className="w-6 h-6 text-primary" />
                <CardTitle className="font-headline text-xl">Potential Causes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground whitespace-pre-line">{state.analysis.potentialCauses}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center gap-2">
                <Sparkles className="w-6 h-6 text-primary" />
                <CardTitle className="font-headline text-xl">Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                 <p className="text-muted-foreground whitespace-pre-line">{state.analysis.recommendations}</p>
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
