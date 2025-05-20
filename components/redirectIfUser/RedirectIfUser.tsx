"use client";

import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
import { useMeQuery } from "../common/MeQuery";

interface RedirectIfUserProps {
  children: ReactNode;
}

export default function RedirectIfUser({ children }: RedirectIfUserProps) {
  const router = useRouter();

  const { data } = useMeQuery("network-only");

  useEffect(() => {
    if (data?.me) {
      router.push("/dashboard");
    }
  }, [data?.me, router]);

  return children;
}
