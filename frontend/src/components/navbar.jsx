"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Separator } from "@radix-ui/react-separator";
import { usePathname } from "next/navigation";
import Link from "next/link";

export function Navbar() {
  const pathname = usePathname();

  // Convert pathname to breadcrumb format
  const pathSegments = pathname.split("/").filter(Boolean);

  return (
    <header className="sticky top-0 z-40 flex items-center px-6 py-3 w-full bg-white">
      {/* Sidebar Trigger */}
      <SidebarTrigger className="w-10 h-10 hover:bg-gray-200 p-2 rounded-lg" />
      <Separator orientation="vertical" className="m-4 h-4 w-0.5 bg-[#d6d6d6]" />

      {/* Breadcrumb Navigation */}
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
                  <Link href={href} className="text-gray-700 capitalize">
                    {segment}
                  </Link>
                </BreadcrumbItem>
              </span>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </header>
  );
}
