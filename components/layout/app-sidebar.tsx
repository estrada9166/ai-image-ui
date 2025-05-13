"use client";

import * as React from "react";
import {
  LayoutDashboardIcon,
  SettingsIcon,
  HelpCircleIcon,
  Sparkles,
  VideoIcon,
  BookImageIcon,
  CropIcon,
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
import { graphql } from "../../gql";
import { useQuery } from "urql";
import { NavSecondary } from "./nav-secondary";
import Link from "next/link";

// This is sample data.

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboardIcon,
    },
    {
      title: "Gallery",
      url: "/dashboard/gallery",
      icon: BookImageIcon,
    },
    {
      title: "Image Edit",
      url: "/dashboard/image-edit",
      icon: CropIcon,
    },
    {
      title: "Videos creation",
      url: "/dashboard/video-creation",
      icon: VideoIcon,
    },
  ],

  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: SettingsIcon,
    },
    {
      title: "Get Help",
      url: "#",
      icon: HelpCircleIcon,
    },
  ],
};

const SidebarQueryDocument = graphql(/* GraphQL */ `
  query SidebarQuery {
    me {
      id
      fullName
      email
    }
  }
`);

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state } = useSidebar();

  const [{ data: userData }] = useQuery({
    query: SidebarQueryDocument,
  });

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <Link href="/project">
          <div className="text-2xl font-bold gradient-text">
            <div className="flex items-center gap-2 ml-1">
              <Sparkles className="w-6 h-6 text-indigo-500" />
              {state === "expanded" ? "Revenowl" : ""}
            </div>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name: userData?.me?.fullName ?? "",
            email: userData?.me?.email ?? "",
            avatar: userData?.me?.email ?? "",
          }}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
