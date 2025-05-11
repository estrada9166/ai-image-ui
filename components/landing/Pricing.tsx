"use client";

import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import React, { useEffect } from "react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { cn } from "../../lib/utils";

type Plan = {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  annualPrice: number;
  features: string[];
  cta: string;
  popular: boolean;
  url: string;
};

export default function Pricing({
  userId,
  email,
  pricingPage,
}: {
  userId?: string;
  email?: string;
  pricingPage?: boolean;
}) {
  const router = useRouter();
  const [billingCycle, setBillingCycle] = React.useState("monthly");

  const plans: Plan[] = [
    {
      id: billingCycle === "monthly" ? "starter-monthly" : "starter-annual",
      name: "Starter",
      description:
        "Perfect for early-stage companies starting to track metrics",
      monthlyPrice: 9,
      annualPrice: 76,
      features: [
        "Connect 1 Github repository",
        "Connect with Stripe",
        "Manual analysis",
        "Create 1 chart",
        "Analyze data in a window of 7 days",
        "Import data from 7 days since today",
        "15-day data retention",
      ],
      cta: "Start 7 day free trial",
      popular: false,
      url:
        billingCycle === "monthly"
          ? process.env.NEXT_PUBLIC_STARTER_MONTHLY_URL!
          : process.env.NEXT_PUBLIC_STARTER_ANNUAL_URL!,
    },
    {
      id: billingCycle === "monthly" ? "growth-monthly" : "growth-annual",
      name: "Growth",
      description: "For growing companies needing deeper insights",
      monthlyPrice: 25,
      annualPrice: 210,
      features: [
        "Connect up to 2 Github repositories",
        "Connect with Stripe",
        "Connect with x.com",
        "Connect with Asana",
        "Connect with Linear",
        "Manual analysis",
        "Automatic analysis reports weekly",
        "Create 1 chart",
        "Analyze data in a window of 15 days",
        "Import data from 15 days since today",
        "30-day data retention",
      ],
      cta: "Start 7 day free trial",
      popular: true,
      url:
        billingCycle === "monthly"
          ? process.env.NEXT_PUBLIC_GROWTH_MONTHLY_URL!
          : process.env.NEXT_PUBLIC_GROWTH_ANNUAL_URL!,
    },
    {
      id: billingCycle === "monthly" ? "startup-monthly" : "startup-annual",
      name: "Startup",
      description: "For growing companies needing deeper insights",
      monthlyPrice: 50,
      annualPrice: 420,
      features: [
        "Connect up to 3 Github repositories",
        "Connect with Stripe",
        "Connect with x.com",
        "Connect with Asana",
        "Connect with Linear",
        "Connect with Plausible.io",
        "Manual analysis",
        "Up to 2 weekly analysis reports",
        "Create multiples charts",
        "Analyze data in a window of 30 days",
        "Import data from 90 days since today",
        "180-day data retention",
      ],
      cta: "Start 7 day free trial",
      popular: false,
      url:
        billingCycle === "monthly"
          ? process.env.NEXT_PUBLIC_STARTUP_MONTHLY_URL!
          : process.env.NEXT_PUBLIC_STARTUP_ANNUAL_URL!,
    },
  ];

  useEffect(() => {
    const plan = plans.find(
      (p) => p.id === localStorage.getItem("selectedPlan")
    );
    if (plan && userId) {
      handlePlanClick(plan);
    }
  }, []);

  const calculatePrice = (plan: Plan) => {
    if (!plan.monthlyPrice) return "Custom";
    if (billingCycle === "monthly") return `$${plan.monthlyPrice}`;
    return `$${plan.annualPrice}`;
  };

  const calculateSavings = (plan: Plan) => {
    if (!plan.monthlyPrice) return null;
    const annualMonthly = plan.annualPrice / 12;
    const savings =
      ((plan.monthlyPrice - annualMonthly) / plan.monthlyPrice) * 100;
    return Math.round(savings);
  };

  const generatePlanUrl = (
    planUrl: string,
    client_reference_id: string,
    prefilled_email?: string
  ) => {
    const queryParams = new URLSearchParams({
      client_reference_id,
      prefilled_email: prefilled_email || "",
    });
    return `${planUrl}?${queryParams.toString()}`;
  };

  const handlePlanClick = (plan: Plan) => {
    if (userId) {
      const planUrl = generatePlanUrl(plan.url, userId, email);
      localStorage.removeItem("selectedPlan");
      window.location.href = planUrl;
    } else {
      localStorage.setItem("selectedPlan", plan.id);
      router.push(`/signup`);
    }
  };

  return (
    <section
      id="pricing"
      className={cn(
        "relative overflow-hidden",
        pricingPage ? "py-12 bg-transparent" : "py-24 bg-white"
      )}
    >
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      <div className="relative max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-bold gradient-text mb-6">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            Choose the perfect plan for your analytics needs. Save up to 30%
            with annual billing.
          </p>
          <div className="inline-flex items-center bg-gray-100 dark:bg-gray-800 rounded-full p-1">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                billingCycle === "monthly"
                  ? "bg-white dark:bg-gray-700 shadow-md text-indigo-600 dark:text-indigo-400"
                  : "text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"
              }`}
            >
              Monthly
            </button>
            <div className="relative">
              <button
                onClick={() => setBillingCycle("annual")}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  billingCycle === "annual"
                    ? "bg-white dark:bg-gray-700 shadow-md text-indigo-600 dark:text-indigo-400"
                    : "text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                }`}
              >
                Annual
              </button>
              <span className="absolute -top-4 -right-4 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs font-semibold px-2 py-0.5 rounded-full border border-green-200 dark:border-green-700">
                Save 30%
              </span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => {
            const savings = calculateSavings(plan);
            return (
              <Card
                key={index}
                className={`relative group hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 hover:scale-105 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-2 h-full flex flex-col ${
                  plan.popular
                    ? "border-indigo-500"
                    : "border-gray-200/50 dark:border-gray-700/50"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-5 left-0 right-0 flex justify-center">
                    <span className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                <CardContent className="p-8 flex flex-col h-full">
                  <div className="flex-grow">
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                      {plan.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      {plan.description}
                    </p>
                    <div className="mb-6">
                      <div className="flex items-baseline">
                        <span className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                          {calculatePrice(plan)}
                        </span>
                        {plan.monthlyPrice && (
                          <span className="ml-2 text-gray-600 dark:text-gray-400">
                            /{billingCycle === "monthly" ? "month" : "year"}
                          </span>
                        )}
                      </div>
                      {billingCycle === "annual" && savings && (
                        <div className="mt-2 inline-block">
                          <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-sm font-semibold px-3 py-1 rounded-full border border-green-200 dark:border-green-700">
                            Save {savings}% with annual billing! 🎉
                          </span>
                        </div>
                      )}
                    </div>
                    <ul className="space-y-4 mb-8">
                      {plan.features.map((feature, i) => (
                        <li
                          key={i}
                          className="flex items-center text-gray-600 dark:text-gray-300"
                        >
                          <CheckCircle2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mr-3" />
                          {feature}
                          {(feature.includes("x.com") ||
                            feature.includes("Asana")) && (
                            <span className="ml-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-semibold px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-700">
                              Coming Soon
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Button
                    className={`w-full mt-auto ${
                      plan.popular
                        ? "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
                        : "bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 border-2 border-indigo-600 dark:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-gray-700"
                    } transition-all duration-300 group-hover:scale-105`}
                    onClick={() => handlePlanClick(plan)}
                  >
                    {plan.cta}
                  </Button>
                  <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4 font-medium">
                    $0.00 due today, cancel anytime
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
