"use client";

import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { useMeQuery } from "../common/useMeQuery";
import { generatePlanUrl } from "../common/generatePlanUrl";

interface RequireSignInProps {
  children: ReactNode;
}

export default function RequireSignIn({ children }: RequireSignInProps) {
  const router = useRouter();

  const [isRedirecting, setIsRedirecting] = useState(false);

  const { data, fetching, error } = useMeQuery("network-only");

  useEffect(() => {
    if (!fetching && (!data?.me || error)) {
      router.push("/login");
    }
  }, [data?.me, error, fetching, router]);

  useEffect(() => {
    if (!data?.me) {
      return;
    }

    const selectedPlan = localStorage.getItem("selectedPlan");
    const selectedBillingPeriod = localStorage.getItem("selectedBillingPeriod");

    if (!selectedPlan || !selectedBillingPeriod) {
      return;
    }

    localStorage.removeItem("selectedPlan");
    localStorage.removeItem("selectedBillingPeriod");

    let planUrl = "";

    if (selectedPlan === "starter") {
      planUrl =
        selectedBillingPeriod === "monthly"
          ? process.env.NEXT_PUBLIC_STARTER_MONTHLY_URL!
          : process.env.NEXT_PUBLIC_STARTER_ANNUAL_URL!;
    } else if (selectedPlan === "pro") {
      planUrl =
        selectedBillingPeriod === "monthly"
          ? process.env.NEXT_PUBLIC_PRO_MONTHLY_URL!
          : process.env.NEXT_PUBLIC_PRO_ANNUAL_URL!;
    } else if (selectedPlan === "advanced") {
      planUrl =
        selectedBillingPeriod === "monthly"
          ? process.env.NEXT_PUBLIC_ADVANCED_MONTHLY_URL!
          : process.env.NEXT_PUBLIC_ADVANCED_ANNUAL_URL!;
    }

    if (planUrl) {
      router.push(generatePlanUrl(planUrl, data.me.id, data.me.email));
      setIsRedirecting(true);
    }
  }, [data, router]);

  if (isRedirecting) {
    return null;
  }

  if (fetching) {
    return null; // Or a loading spinner
  }

  if (!data?.me) {
    return null; // Don't render children if not logged in
  }

  return children;
}
