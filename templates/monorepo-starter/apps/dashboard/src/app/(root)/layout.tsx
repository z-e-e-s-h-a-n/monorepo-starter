"use client";
import AppSidebar from "@/components/AppSidebar";
import Header from "@/components/Header";
import useAuth from "@/hooks/auth";
import { requiredRoles } from "@/lib/constants";
import {
  SidebarInset,
  SidebarProvider,
} from "@workspace/ui/components/sidebar";
import { Loader } from "lucide-react";
import { redirect } from "next/navigation";
import { toast } from "sonner";

const Layout = ({ children }: AppLayoutProps) => {
  const { isLoading, isError, currentUser } = useAuth();

  if (isLoading)
    return (
      <div>
        <Loader /> Loading .....
      </div>
    );
  if (isError || !currentUser) {
    toast.error("please login to manage dashboard.");
    return redirect("/auth/sign-in");
  }

  const hasRole = requiredRoles.some((role) =>
    currentUser.roles.includes(role)
  );

  if (!hasRole) {
    toast(`Forbidden: Requires ${requiredRoles.join(", ")} access.`, {
      description: "login with admin account instead.",
    });
    return redirect("/auth/sign-in");
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <Header />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Layout;
