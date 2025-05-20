"use client";

import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
import { useMeQuery } from "../common/MeQuery";

interface RequireSignInProps {
  children: ReactNode;
}

export default function RequireSignIn({ children }: RequireSignInProps) {
  const router = useRouter();

  const { data, fetching, error } = useMeQuery("network-only");

  useEffect(() => {
    if (!fetching) {
      if (!data?.me || error) {
        router.push("/login");
        return;
      }
    }
  }, [data?.me, error, fetching, router]);

  return children;
}
