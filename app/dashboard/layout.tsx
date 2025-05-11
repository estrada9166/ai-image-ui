import { AppSidebar } from "@/components/layout/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import RequireSignIn from "@/components/requireSignIn/RequireSignIn";

export default function Page({ children }: { children: React.ReactNode }) {
  return (
    <RequireSignIn>
      <SidebarProvider>
        <AppSidebar variant="inset" />
        <SidebarInset>
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-4 md:gap-6">{children}</div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </RequireSignIn>
  );
}
