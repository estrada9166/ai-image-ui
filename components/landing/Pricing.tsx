"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckIcon, TrendingUp, Crown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";

export default function Pricing() {
  const router = useRouter();
  const { t } = useTranslation();
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annual">(
    "monthly"
  );

  const plans = [
    {
      id: "starter",
      name: t("landing.pricing.plans.starter.name"),
      description: t("landing.pricing.plans.starter.description"),
      monthlyPrice: 15,
      annualPrice: 150,
      features: t("landing.pricing.plans.starter.features", {
        returnObjects: true,
      }) as string[],
      ctaText: t("landing.pricing.plans.starter.cta"),
      ctaLink: `/signup`,
      popular: false,
      disclaimer: t("landing.pricing.plans.starter.disclaimer"),
      gradientFrom: "from-gray-500",
      gradientTo: "to-gray-600",
      borderColor: "border-gray-200 dark:border-gray-700",
      iconBg: "bg-gray-50 dark:bg-gray-900/30",
      isFree: true,
    },
    {
      id: "pro",
      name: t("landing.pricing.plans.pro.name"),
      description: t("landing.pricing.plans.pro.description"),
      monthlyPrice: 40,
      annualPrice: 400,
      features: t("landing.pricing.plans.pro.features", {
        returnObjects: true,
      }) as string[],
      ctaText: t("landing.pricing.plans.pro.cta"),
      ctaLink: `/signup`,
      popular: true,
      disclaimer: t("landing.pricing.plans.pro.disclaimer"),
      gradientFrom: "from-indigo-500",
      gradientTo: "to-blue-600",
      borderColor: "border-indigo-200 dark:border-indigo-700",
      iconBg: "bg-indigo-50 dark:bg-indigo-900/30",
    },
    {
      id: "advanced",
      name: t("landing.pricing.plans.advanced.name"),
      description: t("landing.pricing.plans.advanced.description"),
      monthlyPrice: 75,
      annualPrice: 750,
      features: t("landing.pricing.plans.advanced.features", {
        returnObjects: true,
      }) as string[],
      ctaText: t("landing.pricing.plans.advanced.cta"),
      ctaLink: `/signup`,
      popular: false,
      disclaimer: t("landing.pricing.plans.starter.disclaimer"),
      gradientFrom: "from-violet-500",
      gradientTo: "to-purple-600",
      borderColor: "border-violet-200 dark:border-violet-700",
      iconBg: "bg-violet-50 dark:bg-violet-900/30",
    },
  ];

  return (
    <section
      id="pricing"
      className="py-24 relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800"
    >
      {/* Enhanced background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-20 -left-32 w-96 h-96 bg-gradient-to-r from-blue-300/20 to-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 -right-32 w-96 h-96 bg-gradient-to-r from-violet-300/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-50 to-blue-50 dark:from-blue-900/30 dark:to-blue-900/30 border border-blue-200 dark:border-blue-800 mb-6">
            <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400 mr-2" />
            <span className="text-sm font-medium text-blue-800 dark:text-blue-300">
              {t("landing.pricing.title")}
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            {t("landing.pricing.simplePricing")},{" "}
            <span className="text-indigo-600">
              {t("landing.pricing.maximumResults")}
            </span>
          </h2>

          {/* Enhanced billing toggle */}
          <div className="inline-flex items-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setBillingPeriod("monthly")}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                billingPeriod === "monthly"
                  ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              {t("landing.pricing.billing.monthly")}
            </button>
            <button
              onClick={() => setBillingPeriod("annual")}
              className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center ${
                billingPeriod === "annual"
                  ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              {t("landing.pricing.billing.annual")}
              <span className="ml-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 text-xs px-2 py-1 rounded-full">
                {t("landing.pricing.billing.saveLabel")}
              </span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`group relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border-2 transition-all duration-500 hover:-translate-y-2 ${
                plan.popular
                  ? `${plan.borderColor} scale-105 z-10`
                  : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
              }`}
            >
              {/* Gradient overlay */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${plan.gradientFrom} ${plan.gradientTo} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
              ></div>

              {plan.popular && (
                <div
                  className={`bg-gradient-to-r ${plan.gradientFrom} ${plan.gradientTo} text-white text-center py-3 text-sm font-bold flex items-center justify-center`}
                >
                  <Crown className="w-4 h-4 mr-2" />
                  {t("landing.pricing.mostPopular")}
                </div>
              )}

              <div className="relative z-10 p-8 lg:p-10">
                <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-3">
                  {plan.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                  {plan.description}
                </p>

                <div className="mb-8 flex items-end">
                  {plan.monthlyPrice === 0 ? (
                    <div className="text-5xl font-bold text-gray-900 dark:text-white">
                      {t("landing.pricing.free")}
                    </div>
                  ) : (
                    <>
                      <div className="text-5xl font-bold text-gray-900 dark:text-white">
                        $
                        {billingPeriod === "monthly"
                          ? plan.monthlyPrice
                          : plan.annualPrice}
                      </div>
                      <div className="text-gray-500 dark:text-gray-400 ml-3 mb-2 text-lg">
                        {billingPeriod === "monthly"
                          ? `/${t("landing.pricing.billing.monthly")}`
                          : `/${t("landing.pricing.billing.annual")}`}
                      </div>
                    </>
                  )}
                </div>

                <Button
                  className={`w-full mb-8 py-4 text-lg font-semibold rounded-2xl transition-all duration-300 ${
                    plan.popular
                      ? `bg-gradient-to-r ${plan.gradientFrom} ${plan.gradientTo} hover:shadow-2xl hover:scale-105 text-white`
                      : plan.monthlyPrice === 0
                      ? "bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white hover:shadow-lg"
                      : "bg-gray-900 hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
                  }`}
                  size="lg"
                  onClick={() => {
                    localStorage.setItem("selectedPlan", plan.id);
                    localStorage.setItem(
                      "selectedBillingPeriod",
                      billingPeriod
                    );
                    router.push(plan.ctaLink);
                  }}
                >
                  {plan.ctaText}
                </Button>

                <div className="space-y-4">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start">
                      <div
                        className={`flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center ${plan.iconBg} mr-4 mt-0.5`}
                      >
                        <CheckIcon
                          className={`w-4 h-4 ${plan.gradientFrom.replace(
                            "from-",
                            "text-"
                          )} dark:${plan.gradientFrom.replace(
                            "from-",
                            "text-"
                          )}`}
                        />
                      </div>
                      <span className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                {plan.disclaimer && (
                  <p className="mt-6 text-sm text-center text-gray-500 dark:text-gray-400 italic">
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
