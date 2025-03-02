"use client";

import { usePathname } from "next/navigation";
import React from "react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";
import Link from "next/link";

function NavMain({ items }) {
  const pathname = usePathname(); // Get the current route

  return (
    <SidebarGroup className="list-none">
      <SidebarGroupLabel>Main</SidebarGroupLabel>
      {items.map((item, index) => {
        const isActive = pathname === item.link; // Check if current link is active

        return (
            <SidebarMenuItem key={index} className="mb-1">
            <Link href={item.link}>
              <SidebarMenuButton
                className={`${
                  isActive
                    ? "bg-blue-500 text-white hover:bg-blue-500 hover:text-white"
                    : ""
                }`}
                tooltip={item.title}
              >
                {item.icon && <item.icon />}

                <span>{item.title}</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        );
      })}
    </SidebarGroup>
  );
}

export default NavMain;
