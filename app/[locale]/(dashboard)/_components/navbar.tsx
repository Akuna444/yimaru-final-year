import { NavbarRoutes } from "@/components/navbar-routes";

import { MobileSidebar } from "./mobile-sidebar";
import LanguageSwitcher from "./language-switcher";
import Link from "next/link";
import { TimerIcon } from "lucide-react";
export const Navbar = () => {
  return (
    <div className="p-4 border-b h-full flex items-center bg-white shadow-sm">
      <Link href="/quiz/history">
        <div className="flex">
          <TimerIcon /> <span>Quiz History</span>
        </div>
      </Link>{" "}
      <MobileSidebar />
      <NavbarRoutes />
      <LanguageSwitcher />
    </div>
  );
};
