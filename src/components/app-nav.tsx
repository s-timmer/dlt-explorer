"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, MessageSquare, Info, BookOpen, Activity, Menu } from "lucide-react";
import { Sheet, SheetTrigger, SheetContent, SheetTitle } from "@/components/ui/sheet";

const storybookUrl = process.env.NODE_ENV === "development"
  ? "http://localhost:6006"
  : "https://698ef1ee455ce2c83ed99d52-hhrnlzhbnd.chromatic.com/";

const navItems = [
  { href: "/", icon: Home, label: "Catalog" },
  { href: "/explore", icon: MessageSquare, label: "Explore" },
  { href: "/runtime", icon: Activity, label: "Runtime" },
  { href: "/rationale", icon: Info, label: "About" },
];

export function AppNav() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden sm:flex fixed left-0 top-0 h-screen w-10 flex-col items-center pt-6 gap-3 z-10">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`${isActive(item.href) ? "text-muted-foreground hover:text-foreground" : "text-muted-foreground/30 hover:text-muted-foreground"} transition-colors`}
            title={item.label}
          >
            <item.icon className="h-4 w-4" />
          </Link>
        ))}
        <a href={storybookUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground/30 hover:text-muted-foreground transition-colors" title="Storybook">
          <BookOpen className="h-4 w-4" />
        </a>
      </aside>

      {/* Mobile hamburger menu */}
      <div className="sm:hidden fixed top-4 right-4 z-20">
        <Sheet>
          <SheetTrigger asChild>
            <button className="text-muted-foreground hover:text-foreground transition-colors p-1">
              <Menu className="h-5 w-5" />
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[240px] pt-12">
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <nav className="flex flex-col gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                    isActive(item.href)
                      ? "text-foreground bg-muted/50"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              ))}
              <div className="border-t my-2" />
              <a
                href={storybookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors"
              >
                <BookOpen className="h-4 w-4" />
                Storybook
              </a>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
