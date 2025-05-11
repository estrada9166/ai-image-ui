"use client";

import { useQuery } from "urql";
import { graphql } from "@/gql/gql";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

const redirectIfUserQueryDocument = graphql(/* GraphQL */ `
  query redirectIfUser {
    me {
      id
    }
  }
`);

interface RedirectIfUserProps {
  children: ReactNode;
}

export default function RedirectIfUser({ children }: RedirectIfUserProps) {
  const router = useRouter();

  const [{ data }] = useQuery({
    query: redirectIfUserQueryDocument,
    requestPolicy: "network-only",
  });

  useEffect(() => {
    if (data?.me) {
      router.push("/dashboard");
    }
  }, [data?.me, router]);

  return children;
}
