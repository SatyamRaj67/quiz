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
} from "../../ui/sidebar";
import { NavMain } from "./nav-main";
import { IoRocketSharp } from "react-icons/io5";
import { useSidebarMobile } from "~/hooks/use-mobile";
import { navData } from "~/constants/nav-data";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  collapsible?: "offcanvas" | "icon" | "none";
}

export function AppSidebar({
  collapsible = "offcanvas",
  ...props
}: AppSidebarProps) {
  const pathname = usePathname();
  const { handleLinkClick } = useSidebarMobile();

  const isHomeActive = React.useMemo(() => pathname === "/", [pathname]);

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
              <Link href={"/"}>
                <IoRocketSharp className="size-5" />
                <span className="text-base font-semibold">QuizCraft</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navData.navMain} />
      </SidebarContent>
    </Sidebar>
  );
}
