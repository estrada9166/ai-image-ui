"use client";

import { useQuery } from "urql";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
import { MeQueryDocument } from "../common/MeQuery";

interface RedirectIfUserProps {
  children: ReactNode;
}

export default function RedirectIfUser({ children }: RedirectIfUserProps) {
  const router = useRouter();

  const [{ data }] = useQuery({
    query: MeQueryDocument,
    requestPolicy: "network-only",
  });

  useEffect(() => {
    if (data?.me) {
      router.push("/dashboard");
    }
  }, [data?.me, router]);

  return children;
}
