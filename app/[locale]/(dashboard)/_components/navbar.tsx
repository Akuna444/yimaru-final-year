import { NavbarRoutes } from "@/components/navbar-routes";

import { MobileSidebar } from "./mobile-sidebar";
import LanguageSwitcher from "./language-switcher";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

import Link from "next/link";
import { TimerIcon } from "lucide-react";
export const Navbar = () => {
  const t = useTranslations("Nav");
  return (
    <div className="p-4 border-b h-full flex items-center bg-white shadow-sm">
      {" "}
      <MobileSidebar />{" "}
      <Link href="/quiz/history">
        <Button size="sm" variant="ghost">
          <TimerIcon /> <span>{t("quizHistory")}</span>
        </Button>
      </Link>
      <NavbarRoutes />
      <LanguageSwitcher />
    </div>
  );
};
