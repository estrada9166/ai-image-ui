"use client";

import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { useMeQuery } from "../common/useMeQuery";

interface RedirectIfUserProps {
  children: ReactNode;
}

export default function RedirectIfUser({ children }: RedirectIfUserProps) {
  const router = useRouter();
  const { data, fetching } = useMeQuery("network-only");
  const [hasRedirected, setHasRedirected] = useState(false);

  useEffect(() => {
    if (!fetching && data?.me) {
      setHasRedirected(true); // prevent rendering children
      router.push("/dashboard");
    }
  }, [data?.me, fetching, router]);

  if ((fetching && !data?.me) || hasRedirected) {
    return null;
  }

  return children;
}
