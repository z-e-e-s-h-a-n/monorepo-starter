import AppSidebar from "@workspace/ui/shared/AppSidebar";
import { sidebarMenu } from "@/lib/constants";
import {
  SidebarInset,
  SidebarProvider,
} from "@workspace/ui/components/sidebar";
import Header from "@/components/layout/Header";
import DashboardStats from "@/components/layout/DashboardStats";
import DashboardChart from "@/components/layout/DashboardChart";

export default function Page() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" mainMenu={sidebarMenu} />
      <SidebarInset>
        <Header />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <DashboardStats />
              <div className="px-4 lg:px-6">
                <DashboardChart />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
