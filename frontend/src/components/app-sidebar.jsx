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
import Link from "next/link";

const { Home, Folder, PieChart, Command, Settings, Upload, Paperclip, File, Building2, User2, BotIcon } = require("lucide-react");

const data = {
  navMain: [
    { title: "Dashboard", icon: Home, link: "/dashboard" },
    // { title: "Blogs", icon: Paperclip , link: "/dashboard/blogs" },
    // { title: "My Projects", icon: Folder, link: "/dashboard/myprojects" },
    { title: "SDGs", icon: PieChart, link: "/dashboard/sdgs" },
    { title: "Faculty", icon: User2, link: "/dashboard/faculties" },
    { title: "Companies", icon: Building2, link: "/dashboard/companies" },
    { title: "CSR", icon: Command, link: "/dashboard/csr" },
    { title: "Add Projects", icon: Upload, link: "/dashboard/upload" },
    { title: "Settings", icon: Settings, link: "/dashboard/settings" },
    { title: "Work with AI", icon: BotIcon, link: "/dashboard/chatbot" },
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
              <Link href="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">CSR Connect</span>
                  <span className="truncate text-xs">Enterprise</span>
                </div>
              </Link>
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
