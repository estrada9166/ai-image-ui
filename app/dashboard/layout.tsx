"use client";

import { AppSidebar } from "@/components/layout/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import RequireSignIn from "@/components/requireSignIn/RequireSignIn";
import { Header } from "@/components/layout/header";
export default function Page({ children }: { children: React.ReactNode }) {
  return (
    <RequireSignIn>
      <SidebarProvider>
        <AppSidebar variant="inset" />
        <SidebarInset>
          <Header />
          <div className="min-h-screen bg-gradient-to-b from-white to-purple-50 dark:from-gray-900 dark:to-purple-950/30">
            <div className="container mx-auto px-4 md:py-6 max-w-6xl">
              {children}
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </RequireSignIn>
  );
}
