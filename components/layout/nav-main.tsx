"use client";

import { PlusCircleIcon, VideoIcon, type LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { graphql } from "@/gql/gql";
import { useMutation } from "urql";
import { useRouter } from "next/navigation";
import { useState } from "react";

const createChatDocument = graphql(/* GraphQL */ `
  mutation CreateChat {
    createChat {
      id
    }
  }
`);

export function NavMain({
  items,
  onClick,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
  }[];
  onClick?: () => void;
}) {
  const { t } = useTranslation();
  const router = useRouter();

  const [isCreatingChat, setIsCreatingChat] = useState(false);
  const [, createChat] = useMutation(createChatDocument);

  const handleCreateChat = () => {
    setIsCreatingChat(true);

    if (isCreatingChat) return;

    createChat({})
      .then((res) => {
        if (res.data?.createChat) {
          router.push(`/dashboard/chat/${res.data.createChat.id}`);
        }
      })
      .finally(() => {
        setIsCreatingChat(false);
      });
  };

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuButton
            tooltip={t("navMain.newChat")}
            onClick={handleCreateChat}
            disabled={isCreatingChat}
            className="min-w-8 bg-primary text-primary-foreground duration-200 ease-linear hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground"
          >
            <PlusCircleIcon />
            <span>{t("navMain.newChat")}</span>
          </SidebarMenuButton>
        </SidebarMenu>
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <Link href="/dashboard/create/image">
              <SidebarMenuButton
                tooltip="Quick Create"
                className="min-w-8 text-foreground border border-gray-200 dark:border-gray-700 bg-transparent hover:bg-transparent hover:text-primary hover:border-primary transition-colors"
              >
                <PlusCircleIcon />
                <span>{t("navMain.quickCreate")}</span>
              </SidebarMenuButton>
            </Link>
            <Link href="/dashboard/create/video">
              <Button
                size="icon"
                className="h-8 w-8 shrink-0 group-data-[collapsible=icon]:opacity-0 border border-gray-200 dark:border-gray-700 bg-transparent hover:bg-transparent hover:text-primary hover:border-primary"
                variant="outline"
              >
                <VideoIcon />
              </Button>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <Link href={item.url}>
                <SidebarMenuButton tooltip={item.title} onClick={onClick}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
