"use client";

import { useEffect, useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";
import NavMain from "./nav-main";
import { useRouter } from "next/navigation";
import { NavUser } from "./nav-user";

const { Home, Folder, PieChart, Command, Settings, Upload, Paperclip } = require("lucide-react");

const data = {
  navMain: [
    { title: "Dashboard", icon: Home, link: "/dashboard" },
    { title: "Blogs", icon: Paperclip , link: "/blogs" },
    { title: "My Projects", icon: Folder, link: "/users" },
    { title: "SGDs", icon: PieChart, link: "/sgds" },
    { title: "CSR", icon: Command, link: "/csr" },
    { title: "Upload and Update", icon: Upload, link: "/settings" },
    { title: "Settings", icon: Settings, link: "/settings" },
  ],
};

export function AppSidebar(props) {
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null; // Prevents SSR issues

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">CSR Connect</span>
                  <span className="truncate text-xs">Enterprise</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser/>
      </SidebarFooter>
    </Sidebar>
  );
}
