import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SymptomCheckerForm } from "./SymptomCheckerForm";
import { getSymptomAnalysis } from "./actions";

export default function SymptomCheckerPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
        <SymptomCheckerForm getSymptomAnalysis={getSymptomAnalysis} />
      </div>
    </div>
  );
}
