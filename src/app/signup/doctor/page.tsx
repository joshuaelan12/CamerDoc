
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
import { Loader2, ArrowLeft, FileUp } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


const formSchema = z.object({
  fullName: z.string().min(2, { message: "Full name is required." }),
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  specialization: z.string({ required_error: "Specialization is required." }),
  hospitalAffiliation: z.string().optional(),
  phone: z.string().min(10, { message: "A valid phone number is required." }),
});

export default function DoctorSignupPage() {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      specialization: "",
      hospitalAffiliation: "",
      phone: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const result = await createUser({...values, role: 'doctor'});
    if (result.success) {
      toast({
        title: "Account Created",
        description: "Your doctor account has been successfully created. Please wait for admin approval.",
      });
      router.push("/doctor/dashboard");
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
            <CardTitle className="font-headline text-2xl">Create a Doctor Account</CardTitle>
            <CardDescription>Enter your professional details to register.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                 <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Dr. John Doe" {...field} />
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
                 <FormField
                  control={form.control}
                  name="specialization"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Specialization</FormLabel>
                       <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a specialization" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="General Practice">General Practice</SelectItem>
                          <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                          <SelectItem value="Cardiology">Cardiology</SelectItem>
                          <SelectItem value="Dermatology">Dermatology</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="(123) 456-7890" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="hospitalAffiliation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hospital/Clinic Affiliation (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., General Hospital" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormItem>
                  <FormLabel>License/Certificate</FormLabel>
                  <FormControl>
                    <Button variant="outline" className="w-full justify-start font-normal" disabled>
                      <FileUp className="mr-2 h-4 w-4" />
                      Upload File (Coming Soon)
                    </Button>
                  </FormControl>
                   <FormMessage />
                </FormItem>
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
