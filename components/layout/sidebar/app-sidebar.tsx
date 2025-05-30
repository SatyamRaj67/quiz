"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
} from "../../ui/sidebar";
import { NavMain } from "./nav-main";
import { navData } from "~/constants/nav-data";
import { IoRocketSharp } from "react-icons/io5";
import { useSidebarMobile } from "~/hooks/use-mobile";
import {
  validateNavigationConfig,
  type NavigationConfig,
} from "~/lib/navigation";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  collapsible?: "offcanvas" | "icon" | "none";
}

export function AppSidebar({
  collapsible = "offcanvas",
  ...props
}: AppSidebarProps) {
  const pathname = usePathname();
  const { handleLinkClick } = useSidebarMobile();

  const navigationData: NavigationConfig | null = React.useMemo(() => {
    try {
      return validateNavigationConfig(navData);
    } catch (error) {
      console.error("Invalid navigation configuration:", error);
      return null;
    }
  }, []);

  const isHomeActive = React.useMemo(() => pathname === "/", [pathname]);

  if (!navigationData) {
    return (
      <Sidebar collapsible={collapsible} {...props}>
        <SidebarContent>
          <SidebarMenuSkeleton showIcon />
        </SidebarContent>
      </Sidebar>
    );
  }

  return (
    <Sidebar collapsible={collapsible} {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              onClick={handleLinkClick}
              isActive={isHomeActive}
              aria-current={isHomeActive ? "page" : undefined}
              aria-label="Go to homepage"
            >
              <Link href={navigationData.brand.href}>
                <IoRocketSharp className="size-5" />
                <span className="text-base font-semibold">
                  {navigationData.brand.name}
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navigationData.main} />
      </SidebarContent>
    </Sidebar>
  );
}
