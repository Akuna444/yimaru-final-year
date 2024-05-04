import { NavbarRoutes } from "@/components/navbar-routes";

import { MobileSidebar } from "./mobile-sidebar";
import LanguageSwitcher from "./language-switcher";
import { Button } from "@/components/ui/button";

import Link from "next/link";
import { TimerIcon } from "lucide-react";
export const Navbar = () => {
  return (
    <div className="p-4 border-b h-full flex items-center bg-white shadow-sm">
      {" "}
      <MobileSidebar />{" "}
      <Link href="/quiz/history">
        <Button size="sm" variant="ghost">
          <TimerIcon /> <span>Quiz History</span>
        </Button>
      </Link>
      <NavbarRoutes />
      <LanguageSwitcher />
    </div>
  );
};
