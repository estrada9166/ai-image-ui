"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckIcon, SparklesIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UsageQuery } from "../common/UsageQuery";
import { motion } from "framer-motion";

interface CheckoutProps {
  trigger?: React.ReactNode;
  onOpenChange?: (open: boolean) => void;
}

export function Checkout({ trigger, onOpenChange }: CheckoutProps) {
  const { t } = useTranslation();
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annual">(
    "monthly"
  );
  const data = UsageQuery();

  const plans = [
    {
      name: t("landing.pricing.plans.starter.name"),
      description: t("landing.pricing.plans.starter.description"),
      monthlyPrice: 15,
      annualPrice: 150,
      features: t("landing.pricing.plans.starter.features", {
        returnObjects: true,
      }) as string[],
      ctaText: t("landing.pricing.plans.starter.cta"),
      ctaLink:
        billingPeriod === "monthly"
          ? process.env.NEXT_PUBLIC_STARTER_MONTHLY_URL
          : process.env.NEXT_PUBLIC_STARTER_ANNUAL_URL,
      popular: false,
      disclaimer: t("landing.pricing.plans.starter.disclaimer"),
      color: "from-blue-400 to-cyan-500",
      iconColor: "text-blue-500",
    },
    {
      name: t("landing.pricing.plans.pro.name"),
      description: t("landing.pricing.plans.pro.description"),
      monthlyPrice: 40,
      annualPrice: 400,
      features: t("landing.pricing.plans.pro.features", {
        returnObjects: true,
      }) as string[],
      ctaText: t("landing.pricing.plans.pro.cta"),
      ctaLink:
        billingPeriod === "monthly"
          ? process.env.NEXT_PUBLIC_PRO_MONTHLY_URL
          : process.env.NEXT_PUBLIC_PRO_ANNUAL_URL,
      popular: true,
      disclaimer: t("landing.pricing.plans.pro.disclaimer"),
      color: "from-purple-500 to-indigo-600",
      iconColor: "text-purple-500",
    },
    {
      name: t("landing.pricing.plans.advanced.name"),
      description: t("landing.pricing.plans.advanced.description"),
      monthlyPrice: 75,
      annualPrice: 750,
      features: t("landing.pricing.plans.advanced.features", {
        returnObjects: true,
      }) as string[],
      ctaText: t("landing.pricing.plans.advanced.cta"),
      ctaLink:
        billingPeriod === "monthly"
          ? process.env.NEXT_PUBLIC_ADVANCED_MONTHLY_URL
          : process.env.NEXT_PUBLIC_ADVANCED_ANNUAL_URL,
      popular: false,
      disclaimer: t("landing.pricing.plans.advanced.disclaimer"),
      color: "from-amber-500 to-orange-600",
      iconColor: "text-amber-500",
    },
  ];

  const currentPlan = data?.me?.planFeaturesUsage?.planId || "";

  return (
    <Dialog onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 border-0 shadow-xl">
        <DialogHeader className="mb-2">
          <DialogTitle className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
            {t("checkout.title")}
          </DialogTitle>
          <DialogDescription className="text-center max-w-2xl mx-auto text-gray-600 dark:text-gray-300">
            {t("checkout.description")}
          </DialogDescription>
        </DialogHeader>

        {/* Billing toggle */}
        <div className="flex items-center justify-center gap-4 mb-6 mt-4">
          <span
            className={`text-sm font-medium transition-colors duration-200 ${
              billingPeriod === "monthly"
                ? "text-gray-900 dark:text-white"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            {t("landing.pricing.billing.monthly")}
          </span>
          <button
            onClick={() =>
              setBillingPeriod(
                billingPeriod === "monthly" ? "annual" : "monthly"
              )
            }
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${
              billingPeriod === "annual"
                ? "bg-gradient-to-r from-purple-500 to-indigo-600"
                : "bg-gray-200 dark:bg-gray-700"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform duration-300 ${
                billingPeriod === "annual" ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
          <span
            className={`text-sm font-medium flex items-center transition-colors duration-200 ${
              billingPeriod === "annual"
                ? "text-gray-900 dark:text-white"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            {t("landing.pricing.billing.annual")}
            <span className="ml-2 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 text-green-700 dark:text-green-400 text-xs px-2 py-0.5 rounded-full font-medium">
              {t("landing.pricing.billing.saveLabel")}
            </span>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={`bg-white dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden border transition-all duration-300 hover:shadow-xl ${
                plan.popular
                  ? "border-indigo-600/50 dark:border-indigo-500/50 md:scale-105 z-10"
                  : "border-transparent hover:border-gray-200 dark:hover:border-gray-700"
              } ${
                currentPlan === plan.name.toLowerCase()
                  ? "ring-2 ring-purple-500 dark:ring-purple-400"
                  : ""
              }`}
            >
              {plan.popular && (
                <div
                  className={`bg-gradient-to-r ${plan.color} text-white text-center py-1.5 text-sm font-medium`}
                >
                  <div className="flex items-center justify-center">
                    <SparklesIcon className="w-3.5 h-3.5 mr-1" />
                    {t("landing.pricing.mostPopular")}
                  </div>
                </div>
              )}
              {currentPlan === plan.name.toLowerCase() && (
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white text-center py-1.5 text-sm font-medium">
                  {t("checkout.currentPlan")}
                </div>
              )}

              <div className="p-5">
                <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                  {plan.name}
                </h4>
                <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
                  {plan.description}
                </p>

                <div className="mb-4 flex items-end">
                  <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300">
                    $
                    {billingPeriod === "monthly"
                      ? plan.monthlyPrice
                      : plan.annualPrice}
                  </div>
                  {plan.monthlyPrice > 0 && (
                    <div className="text-gray-600 dark:text-gray-300 ml-2 mb-1 text-xs">
                      {billingPeriod === "monthly"
                        ? t("landing.pricing.plans.pro.period.monthly")
                        : t("landing.pricing.plans.pro.period.annual")}
                    </div>
                  )}
                </div>

                <Link href={plan.ctaLink!}>
                  <Button
                    className={`w-full mb-5 py-5 text-sm font-medium transition-all duration-300 ${
                      plan.popular
                        ? `bg-gradient-to-r ${plan.color} hover:shadow-lg hover:shadow-indigo-500/20 dark:hover:shadow-indigo-500/10`
                        : "bg-gray-900 hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 hover:shadow-lg hover:shadow-gray-500/10"
                    } ${
                      currentPlan === plan.name.toLowerCase()
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                    disabled={currentPlan === plan.name.toLowerCase()}
                  >
                    {currentPlan === plan.name.toLowerCase()
                      ? t("checkout.currentPlanButton")
                      : plan.ctaText}
                  </Button>
                </Link>

                <div className="space-y-2">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start group">
                      <div
                        className={`flex-shrink-0 h-5 w-5 rounded-full flex items-center justify-center ${plan.iconColor} group-hover:scale-110 transition-transform duration-200`}
                      >
                        <CheckIcon className="w-3.5 h-3.5" />
                      </div>
                      <span
                        className={`ml-2 text-xs text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-200`}
                      >
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                {plan.disclaimer && (
                  <p className="mt-4 text-xs text-center text-gray-500 dark:text-gray-400 italic">
                    {plan.disclaimer}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
