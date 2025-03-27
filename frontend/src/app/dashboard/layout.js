"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Navbar } from "@/components/navbar";

export default function DashboardLayout({ children }) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        {/* Sidebar */}
        <AppSidebar />

        {/* Main Content Area */}
        <div className="flex flex-col w-full h-full overflow-y-auto bg-[#fff6f3]">
          {/* Navbar */}
          <Navbar />

          {/* Main Content */}
          <main className="h-full p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
