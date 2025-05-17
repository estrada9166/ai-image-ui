"use client";

import { useQuery } from "urql";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
import { MeQueryDocument } from "../common/MeQuery";

interface RequireSignInProps {
  children: ReactNode;
}

export default function RequireSignIn({ children }: RequireSignInProps) {
  const router = useRouter();

  const [{ data, error, fetching }] = useQuery({
    query: MeQueryDocument,
    requestPolicy: "network-only",
  });

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
