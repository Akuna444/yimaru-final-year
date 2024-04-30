"use client";

import { BarChart, Compass, Layout, List } from "lucide-react";
import { usePathname } from "next/navigation";

import { SidebarItem } from "./sidebar-item";
import { useTranslations } from "next-intl";

const guestRoutes = [
  {
    icon: Layout,
    label: "Dashboard",
    href: "/",
  },
  {
    icon: Compass,
    label: "Browse",
    href: "/search",
  },
];

const teacherRoutes = [
  {
    icon: List,
    label: "Courses",
    href: "/teacher/courses",
  },
  {
    icon: BarChart,
    label: "Analytics",
    href: "/teacher/analytics",
  },
];

export const SidebarRoutes = () => {
  const pathname = usePathname();
  const t = useTranslations("Nav");

  const guestRoutes = [
    {
      icon: Layout,
      label: t("dashboard"),
      href: "/",
    },
    {
      icon: Compass,
      label: t("browse"),
      href: "/search",
    },
  ];

  const teacherRoutes = [
    {
      icon: List,
      label: t("browse"),
      href: "/teacher/courses",
    },
    {
      icon: BarChart,
      label: t("analytics"),
      href: "/teacher/analytics",
    },
  ];

  const isTeacherPage = pathname?.includes("/teacher");

  const routes = isTeacherPage ? teacherRoutes : guestRoutes;

  return (
    <div className="flex flex-col w-full">
      {routes.map((route) => (
        <SidebarItem
          key={route.href}
          icon={route.icon}
          label={route.label}
          href={route.href}
        />
      ))}
    </div>
  );
};
