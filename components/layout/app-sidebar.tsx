"use client";

import * as React from "react";
import {
  LayoutDashboardIcon,
  HelpCircleIcon,
  Sparkles,
  VideoIcon,
  BookImageIcon,
  CropIcon,
  ImageIcon,
} from "lucide-react";

import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import { NavSecondary } from "./nav-secondary";
import Link from "next/link";
import { NavRemainingPlan } from "./nav-remainingPlan";
import Feedback from "../feedback/Feedback";
import { useMeQuery } from "../common/useMeQuery";
import LanguageSelector from "./LanguageSelector";
import { useTranslation } from "react-i18next";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state, isMobile, toggleSidebar } = useSidebar();
  const { t } = useTranslation();

  const { data: userData } = useMeQuery();

  const handleToggleSidebar = () => {
    if (isMobile) {
      toggleSidebar();
    }
  };

  const data = {
    navMain: [
      {
        title: t("layout.dashboard"),
        url: "/dashboard",
        icon: LayoutDashboardIcon,
      },
      {
        title: t("layout.gallery"),
        url: "/dashboard/gallery",
        icon: BookImageIcon,
      },
      {
        title: t("layout.editImage"),
        url: "/dashboard/edit/image",
        icon: CropIcon,
      },
      {
        title: t("layout.restoreImage"),
        url: "/dashboard/edit/restore",
        icon: ImageIcon,
      },
      {
        title: t("layout.videosCreation"),
        url: "/dashboard/create/video",
        icon: VideoIcon,
      },
    ],

    navSecondary: [
      {
        title: t("layout.getHelp"),
        url: "#",
        icon: HelpCircleIcon,
        component: () => <Feedback />,
      },
    ],
  };

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <Link href="/dashboard">
          <div className="text-2xl font-bold gradient-text">
            <div className="flex items-center gap-2 ml-1">
              <Sparkles className="w-6 h-6 text-indigo-500" />
              {state === "expanded" ? "Newpix.ai" : ""}
            </div>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} onClick={handleToggleSidebar} />
      </SidebarContent>
      <SidebarFooter>
        <NavRemainingPlan
          hasActiveSubscription={userData?.me?.hasActiveSubscription ?? false}
        />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
        <LanguageSelector />

        <NavUser
          user={{
            name: userData?.me?.fullName ?? "",
            email: userData?.me?.email ?? "",
            avatar: userData?.me?.email ?? "",
            isSocialLogin: userData?.me?.isSocialLogin ?? false,
          }}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
