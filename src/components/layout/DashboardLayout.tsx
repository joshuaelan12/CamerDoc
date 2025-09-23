
"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Logo } from "@/components/icons/Logo";
import type { NavItem } from "@/types";
import { cn } from "@/lib/utils";
import { LogOut, Settings, User } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { useAuth } from "@/hooks/use-auth";

type DashboardLayoutProps = {
  children: React.ReactNode;
  navItems: NavItem[];
  userName: string; // This will be overridden by auth user
  userRole: string; // This will be overridden by auth user
};

export default function DashboardLayout({
  children,
  navItems,
  userName,
  userRole,
}: DashboardLayoutProps) {
  const pathname = usePathname();
  const userAvatar = PlaceHolderImages.find((img) => img.id === "avatar-1");
  const { userData, signOut } = useAuth();

  const currentUserName = userData?.fullName || userName;
  const currentUserRole = userData?.role || userRole;

  const getProfileLink = () => {
    switch(currentUserRole) {
      case 'admin':
        return '/admin/profile';
      case 'doctor':
        return '/doctor/profile';
      case 'patient':
        return '/patient/profile';
      default:
        return '#';
    }
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <Logo />
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href}>
                  <SidebarMenuButton
                    isActive={pathname === item.href || (item.match && pathname.startsWith(item.match))}
                  >
                    <item.icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
           <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-start gap-2 p-2 h-auto">
                 <Avatar className="h-8 w-8">
                  {userAvatar && <AvatarImage src={userAvatar.imageUrl} alt={currentUserName} data-ai-hint={userAvatar.imageHint}/>}
                  <AvatarFallback>{currentUserName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="text-left group-data-[collapsible=icon]:hidden">
                  <p className="font-semibold text-sm">{currentUserName}</p>
                  <p className="text-xs text-muted-foreground capitalize">{currentUserRole}</p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" align="start" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={getProfileLink()}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={signOut}>
                 <LogOut className="mr-2 h-4 w-4" />
                 <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex items-center justify-between p-4 border-b">
           <SidebarTrigger />
           <h1 className="font-headline text-xl font-bold capitalize">{pathname.split("/").pop()?.replace('-', ' ')}</h1>
        </header>
        <main className="flex-1 p-4 md:p-6 bg-secondary/50">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
