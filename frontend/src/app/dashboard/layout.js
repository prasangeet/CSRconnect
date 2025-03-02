"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@radix-ui/react-separator";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function DashboardLayout({ children }) {
  const [isClient, setIsClient] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  // Convert pathname to breadcrumb format
  const pathSegments = pathname.split("/").filter(Boolean);

  return (
    <div className="flex h-screen w-full">
      <SidebarProvider>
        <AppSidebar />
        <div className="flex flex-col w-full h-full overflow-y-auto bg-[#fff6f3]">
          {/* Header Section */}
          <header className="flex items-center px-6 py-3 w-full">
            {/* Sidebar Trigger */}
            <SidebarTrigger className="w-10 h-10 hover:bg-gray-200 p-2 rounded-lg" />
            <Separator
              orientation="vertical"
              className="m-4 h-4 w-0.5 bg-[#d6d6d6]"
            />

            {/* Breadcrumb Navigation - Positioned inline with trigger */}
            <Breadcrumb>
              <BreadcrumbList className="flex items-center">
                <BreadcrumbItem>
                  <BreadcrumbLink href="/" className="text-gray-700">
                    Home
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {pathSegments.map((segment, index) => {
                  const href = `/${pathSegments.slice(0, index + 1).join("/")}`;
                  return (
                    <span key={href} className="flex items-center">
                      <BreadcrumbSeparator />
                      <BreadcrumbItem>
                        <BreadcrumbLink
                          href={href}
                          className="text-gray-700 capitalize"
                        >
                          {segment}
                        </BreadcrumbLink>
                      </BreadcrumbItem>
                    </span>
                  );
                })}
              </BreadcrumbList>
            </Breadcrumb>
          </header>

          {/* Main Content */}
          <main className="h-full p-6">{children}</main>
        </div>
      </SidebarProvider>
    </div>
  );
}
