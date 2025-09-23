import Image from "next/image";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowRight,
  HeartPulse,
  Mail,
  MessageSquare,
  Phone,
  Stethoscope,
  Video,
} from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const heroImage = PlaceHolderImages.find((img) => img.id === "hero-background");
const aboutImage = PlaceHolderImages.find((img) => img.id === "doctor-smiling");

const howItWorksSteps = [
  {
    icon: MessageSquare,
    title: "Symptom Check",
    description: "Use our AI symptom checker to get initial insights.",
  },
  {
    icon: Video,
    title: "Book Appointment",
    description: "Schedule a video consultation with a certified doctor.",
  },
  {
    icon: Stethoscope,
    title: "Get Diagnosis",
    description: "Receive professional medical advice and prescriptions.",
  },
];

const faqs = [
  {
    question: "Is the AI Symptom Checker a replacement for a doctor?",
    answer: "No, the AI Symptom Checker is for informational purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.",
  },
  {
    question: "How do I book an appointment?",
    answer: "After signing up as a patient, you can browse available doctors and schedule an appointment through your dashboard. You will receive a confirmation and reminders for your upcoming consultation.",
  },
  {
    question: "Is my personal data secure?",
    answer: "Yes, we take data privacy and security very seriously. We use industry-standard encryption and security protocols to protect your personal and medical information. For more details, please review our Privacy Policy.",
  },
  {
    question: "What kind of doctors are on the platform?",
    answer: "We have a wide range of board-certified doctors, including general practitioners and specialists in various fields. All doctors are vetted to ensure they meet our high standards of quality and professionalism.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <section id="home" className="relative h-[80vh] min-h-[600px] flex items-center text-white">
          {heroImage && (
            <Image
              src={heroImage.imageUrl}
              alt={heroImage.description}
              fill
              className="object-cover"
              priority
              data-ai-hint={heroImage.imageHint}
            />
          )}
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative container mx-auto px-4 z-10">
            <div className="max-w-3xl">
              <h1 className="font-headline text-4xl md:text-6xl font-bold !leading-tight">
                Quality Healthcare,
                <br />
                One Click Away.
              </h1>
              <p className="mt-4 text-lg md:text-xl max-w-2xl">
                CamerDoc connects you with professional doctors for consultations and provides AI-powered insights into your symptoms.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
                  <Link href="/login">
                    Get Started <ArrowRight className="ml-2" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="secondary">
                  <Link href="/symptom-checker">
                    Check Symptoms <HeartPulse className="ml-2" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="py-20 bg-card">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="rounded-lg overflow-hidden shadow-2xl">
                {aboutImage && (
                  <Image
                    src={aboutImage.imageUrl}
                    alt={aboutImage.description}
                    width={600}
                    height={800}
                    className="w-full h-full object-cover"
                    data-ai-hint={aboutImage.imageHint}
                  />
                )}
              </div>
              <div>
                <h2 className="font-headline text-3xl md:text-4xl font-bold">About CamerDoc</h2>
                <p className="mt-4 text-muted-foreground text-lg">
                  We are revolutionizing healthcare access by bridging the gap between patients and doctors through technology. Our mission is to provide convenient, reliable, and affordable medical services to everyone, everywhere.
                </p>
                <p className="mt-4 text-muted-foreground">
                  Our platform offers a seamless experience, from initial symptom analysis with our advanced AI to a full consultation with a qualified medical professional. We believe in empowering you to take control of your health with the best tools and support available.
                </p>
                <Button asChild className="mt-6">
                  <Link href="#how-it-works">Learn More</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-headline text-3xl md:text-4xl font-bold">How It Works</h2>
            <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">
              Getting medical help has never been easier. Follow these three simple steps.
            </p>
            <div className="mt-12 grid md:grid-cols-3 gap-8">
              {howItWorksSteps.map((step, index) => (
                <Card key={index} className="text-center group hover:border-primary transition-colors duration-300">
                  <CardHeader>
                    <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary transition-colors duration-300">
                      <step.icon className="w-8 h-8 text-primary" />
                    </div>
                    <CardTitle className="font-headline">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{step.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="faq" className="py-20 bg-card">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-headline text-3xl md:text-4xl font-bold text-center">
                Frequently Asked Questions
              </h2>
              <Accordion type="single" collapsible className="w-full mt-12">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-lg font-semibold text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-base text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        <section id="contact" className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="font-headline text-3xl md:text-4xl font-bold text-center">Contact Us</h2>
            <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto text-center">
              Have questions or need support? Reach out to us.
            </p>
            <div className="mt-12 grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle className="font-headline">Send a Message</CardTitle>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <Input placeholder="Your Name" />
                    <Input type="email" placeholder="Your Email" />
                    <Textarea placeholder="Your Message" />
                    <Button type="submit" className="w-full">
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
              <div className="space-y-4">
                <Card className="flex items-center p-6 gap-4">
                  <Mail className="w-8 h-8 text-primary" />
                  <div>
                    <h3 className="font-semibold text-lg">Email</h3>
                    <a
                      href="mailto:support@camerdoc.com"
                      className="text-muted-foreground hover:text-primary"
                    >
                      support@camerdoc.com
                    </a>
                  </div>
                </Card>
                <Card className="flex items-center p-6 gap-4">
                  <Phone className="w-8 h-8 text-primary" />
                  <div>
                    <h3 className="font-semibold text-lg">Phone</h3>
                    <a
                      href="tel:+1234567890"
                      className="text-muted-foreground hover:text-primary"
                    >
                      +1 (234) 567-890
                    </a>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
