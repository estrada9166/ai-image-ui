"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Pricing() {
  const { t } = useTranslation();
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annual">(
    "monthly"
  );

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
      ctaLink: `/signup?plan=starter&billingPeriod=${billingPeriod}`,
      popular: false,
      disclaimer: t("landing.pricing.plans.starter.disclaimer"),
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
      ctaLink: `/signup?plan=pro&billingPeriod=${billingPeriod}`,
      popular: true,
      disclaimer: t("landing.pricing.plans.pro.disclaimer"),
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
      ctaLink: `/contact-sales?plan=advanced&billingPeriod=${billingPeriod}`,
      popular: false,
      disclaimer: t("landing.pricing.plans.advanced.disclaimer"),
    },
  ];

  return (
    <section id="pricing" className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-base font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide mb-3">
            {t("landing.pricing.title")}
          </h2>
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t("landing.pricing.description")}
          </h3>
          <p className="max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-300 mb-8">
            {t("landing.pricing.description")}
          </p>

          {/* Billing toggle */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <span
              className={`text-sm font-medium ${
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
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${
                billingPeriod === "annual"
                  ? "bg-indigo-600"
                  : "bg-gray-200 dark:bg-gray-700"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  billingPeriod === "annual" ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
            <span
              className={`text-sm font-medium flex items-center ${
                billingPeriod === "annual"
                  ? "text-gray-900 dark:text-white"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              {t("landing.pricing.billing.annual")}
              <span className="ml-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs px-2 py-0.5 rounded-full">
                {t("landing.pricing.billing.saveLabel")}
              </span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border-2 transition-all ${
                plan.popular
                  ? "border-indigo-600 dark:border-indigo-500 scale-105 md:scale-110 z-10"
                  : "border-transparent hover:border-gray-200 dark:hover:border-gray-700"
              }`}
            >
              {plan.popular && (
                <div className="bg-indigo-600 dark:bg-indigo-500 text-white text-center py-1.5 text-sm font-medium">
                  {t("landing.pricing.mostPopular")}
                </div>
              )}

              <div className="p-6 sm:p-8">
                <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {plan.name}
                </h4>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  {plan.description}
                </p>

                <div className="mb-6 flex items-end">
                  <div className="text-4xl font-bold text-gray-900 dark:text-white">
                    $
                    {billingPeriod === "monthly"
                      ? plan.monthlyPrice
                      : plan.annualPrice}
                  </div>
                  {plan.monthlyPrice > 0 && (
                    <div className="text-gray-600 dark:text-gray-300 ml-2 mb-1">
                      {billingPeriod === "monthly"
                        ? t("landing.pricing.plans.pro.period.monthly")
                        : t("landing.pricing.plans.pro.period.annual")}
                    </div>
                  )}
                </div>

                <Link href={plan.ctaLink}>
                  <Button
                    className={`w-full mb-8 ${
                      plan.popular
                        ? "bg-indigo-600 hover:bg-indigo-700"
                        : "bg-gray-900 hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
                    }`}
                    size="lg"
                  >
                    {plan.ctaText}
                  </Button>
                </Link>

                <div className="space-y-4">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start">
                      <div
                        className={`flex-shrink-0 h-5 w-5 rounded-full flex items-center justify-center text-green-500 dark:text-green-400`}
                      >
                        <CheckIcon className="w-4 h-4" />
                      </div>
                      <span
                        className={`ml-2 text-sm text-gray-700 dark:text-gray-300`}
                      >
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                {plan.disclaimer && (
                  <p className="mt-4 text-xs text-center text-gray-500 dark:text-gray-400">
                    {plan.disclaimer}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
