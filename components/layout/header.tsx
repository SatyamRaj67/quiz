"use client";

import { usePathname } from "next/navigation";
import { SidebarTrigger } from "../ui/sidebar";
import { Separator } from "../ui/separator";
import ThemeToggle from "./providers/theme-toggle";

function formatPathname(pathname: string): string {
  // ... existing formatPathname function ...
  if (!pathname || pathname === "/") return "";

  const segments = pathname.replace(/^\/|\/$/g, "").split("/");

  const capitalizedSegments = segments.map((segment) => {
    if (segment.length === 0) return "";
    return segment.charAt(0).toUpperCase() + segment.slice(1);
  });

  return " / " + capitalizedSegments.join(" / ");
}

export function Header() {
  const path = usePathname();
  const pathName = formatPathname(path);
  return (
    <header className="flex h-[var(--header-height)] shrink-0 items-center gap-2 border-b transition-[height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-[var(--header-height-collapsed)]">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="truncate text-base font-medium">App{pathName}</h1>{" "}
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
