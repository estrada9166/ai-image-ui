"use client";

import { AppSidebar } from "@/components/layout/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import RequireSignIn from "@/components/requireSignIn/RequireSignIn";
import { Header } from "@/components/layout/header";
import { usePathname } from "next/navigation";

export default function Page({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <RequireSignIn>
      <SidebarProvider>
        <AppSidebar variant="inset" />
        <SidebarInset>
          <Header />
          <div className="min-h-screen bg-gradient-to-b from-white to-purple-50 dark:from-gray-900 dark:to-purple-950/30">
            <div
              className={`container mx-auto ${
                pathname.startsWith("/dashboard/chat/")
                  ? "max-w-full"
                  : "px-4 md:py-6 max-w-7xl"
              }`}
            >
              {children}
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </RequireSignIn>
  );
}
