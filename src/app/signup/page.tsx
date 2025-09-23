
"use client";

import Link from "next/link";
import { ArrowLeft, User, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from "@/components/icons/Logo";

export default function SignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-secondary/50">
       <div className="w-full max-w-md relative">
         <Button variant="ghost" asChild className="absolute -top-16 left-0">
          <Link href="/login">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Login
          </Link>
        </Button>
        <Card className="w-full">
          <CardHeader className="text-center">
            <Link href="/" className="flex justify-center mb-4">
              <Logo />
            </Link>
            <CardTitle className="font-headline text-2xl">Join CamerDoc</CardTitle>
            <CardDescription>Choose your role to get started.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/signup/patient" legacyBehavior>
              <a className="block">
                <Card className="text-center p-6 hover:bg-accent hover:border-primary transition-all duration-300 cursor-pointer h-full">
                  <User className="mx-auto w-12 h-12 text-primary mb-4" />
                  <h3 className="font-bold text-lg">As a Patient</h3>
                  <p className="text-sm text-muted-foreground">Find doctors and manage your health.</p>
                </Card>
              </a>
            </Link>
             <Link href="/signup/doctor" legacyBehavior>
              <a className="block">
                <Card className="text-center p-6 hover:bg-accent hover:border-primary transition-all duration-300 cursor-pointer h-full">
                  <Stethoscope className="mx-auto w-12 h-12 text-primary mb-4" />
                  <h3 className="font-bold text-lg">As a Doctor</h3>
                  <p className="text-sm text-muted-foreground">Provide consultations to patients.</p>
                </Card>
              </a>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
