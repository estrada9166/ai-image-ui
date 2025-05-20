"use client";

import { ChevronsUpDown, CreditCard, LogOut, SettingsIcon } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { graphql } from "@/gql";
import { useMutation, useQuery } from "urql";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslation } from "react-i18next";

export const signOutMutationDocument = graphql(/* GraphQL */ `
  mutation SignOut {
    signOut
  }
`);

const ManageSubscriptionQueryDocument = graphql(/* GraphQL */ `
  query ManageSubscription {
    me {
      id
      customerPortalUrl
    }
  }
`);

export function NavUser({
  user,
}: {
  user: {
    name: string;
    email: string;
    avatar: string;
    isSocialLogin: boolean;
  };
}) {
  const { t } = useTranslation();
  const router = useRouter();

  const { isMobile } = useSidebar();
  const [, signOut] = useMutation(signOutMutationDocument);

  const [{ data, fetching }] = useQuery({
    query: ManageSubscriptionQueryDocument,
  });

  const handleSignOut = () => {
    signOut({}).then(() => {
      localStorage.removeItem("lastVisitedPath");
      router.push("/");
      return;
    });
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg bg-primary text-white">
                  {user.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">
                    {user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>

            {/* <DropdownMenuGroup>
              <Link href="/pricing">
                <DropdownMenuItem>
                  <Sparkles />
                  Change plan
                </DropdownMenuItem>
              </Link>
            </DropdownMenuGroup> */}
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {!user.isSocialLogin && (
                <Link href="/dashboard/settings">
                  <DropdownMenuItem>
                    <SettingsIcon />
                    {t("layout.settings")}
                  </DropdownMenuItem>
                </Link>
              )}
              {fetching ? (
                <DropdownMenuItem>
                  <CreditCard />
                  Loading...
                </DropdownMenuItem>
              ) : (
                data?.me?.customerPortalUrl && (
                  <Link href={data.me.customerPortalUrl} target="_blank">
                    <DropdownMenuItem>
                      <CreditCard />
                      {t("checkout.billing")}
                    </DropdownMenuItem>
                  </Link>
                )
              )}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
