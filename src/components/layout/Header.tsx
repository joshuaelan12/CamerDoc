
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Logo } from "../icons/Logo";
import { useAuth } from "@/hooks/use-auth";

const navLinks = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "#contact", label: "Contact Us" },
  { href: "#faq", label: "FAQ" },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, userData, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // If user is logged in and on the homepage, redirect to their dashboard
    if (userData && pathname === "/") {
      switch (userData.role) {
        case "patient":
          router.replace("/patient/dashboard");
          break;
        case "doctor":
          router.replace("/doctor/dashboard");
          break;
        case "admin":
          router.replace("/admin/dashboard");
          break;
        default:
          break;
      }
    }
  }, [userData, pathname, router]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "bg-card/80 backdrop-blur-sm shadow-md" : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link href="/">
            <Logo className={cn(isScrolled ? "text-foreground" : "text-white")} />
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  isScrolled ? "text-foreground" : "text-white"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-2">
            {user ? (
               <Button variant="ghost" onClick={signOut} className={cn(isScrolled ? "text-foreground hover:text-primary": "text-white hover:bg-white/10 hover:text-white")}>Logout</Button>
            ) : (
              <>
                <Button variant="ghost" asChild className={cn(isScrolled ? "text-foreground hover:text-primary": "text-white hover:bg-white/10 hover:text-white")}>
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </>
            )}
          </div>

          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className={cn(isScrolled ? "text-foreground" : "text-white hover:bg-white/10")}>
                  <Menu />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[80vw]">
                <SheetTitle className="sr-only">Mobile Menu</SheetTitle>
                <div className="flex flex-col h-full">
                  <div className="flex justify-between items-center mb-8">
                     <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
                        <Logo className="text-foreground" />
                      </Link>
                     <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                        <X />
                        <span className="sr-only">Close menu</span>
                     </Button>
                  </div>
                  <nav className="flex flex-col gap-6 text-lg">
                    {navLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="font-medium text-foreground hover:text-primary transition-colors"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </nav>
                  <div className="mt-auto pt-6 border-t">
                     {user ? (
                        <Button onClick={() => { signOut(); setIsMobileMenuOpen(false); }} className="w-full">Logout</Button>
                      ) : (
                        <div className="flex flex-col gap-4">
                          <Button variant="outline" asChild>
                            <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>Login</Link>
                          </Button>
                          <Button asChild>
                            <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)}>Sign Up</Link>
                          </Button>
                        </div>
                      )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
