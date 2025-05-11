"use client";

import { useQuery } from "urql";
import { graphql } from "@/gql/gql";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

const RequireSignInQueryDocument = graphql(/* GraphQL */ `
  query requireSignIn {
    me {
      id
    }
  }
`);

interface RequireSignInProps {
  children: ReactNode;
}

export default function RequireSignIn({ children }: RequireSignInProps) {
  const router = useRouter();

  const [{ data, error, fetching }] = useQuery({
    query: RequireSignInQueryDocument,
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
