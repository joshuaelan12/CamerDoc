
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { createUser } from "../actions";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/icons/Logo";
import { Loader2, ArrowLeft } from "lucide-react";


const formSchema = z.object({
  fullName: z.string().min(2, { message: "Full name is required." }),
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

export default function PatientSignupPage() {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const result = await createUser({...values, role: 'patient'});
    if (result.success) {
      toast({
        title: "Account Created",
        description: "You have been successfully signed up.",
      });
      router.push("/patient/dashboard");
    } else {
       toast({
        title: "Sign Up Failed",
        description: result.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md relative">
         <Button variant="ghost" asChild className="absolute -top-16 left-0">
          <Link href="/signup">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Role Selection
          </Link>
        </Button>
        <Card className="w-full">
          <CardHeader className="text-center">
            <Link href="/" className="flex justify-center mb-4">
              <Logo />
            </Link>
            <CardTitle className="font-headline text-2xl">Create a Patient Account</CardTitle>
            <CardDescription>Enter your details to get started.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                 <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="name@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                   {form.formState.isSubmitting ? (
                      <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Account...
                      </>
                  ) : (
                      'Create Account'
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
           <CardFooter className="text-sm text-center block">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Login
              </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
