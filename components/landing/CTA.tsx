"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TrendingUp, ShoppingCart, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function CTA() {
  const { t } = useTranslation();

  return (
    <section className="py-16 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-indigo-500/10 to-violet-500/10"></div>

      {/* Decorative elements */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl"></div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100 dark:border-gray-700">
          <div className="flex flex-col items-center text-center">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-indigo-100 to-indigo-100 dark:from-indigo-900/50 dark:to-indigo-900/50 text-indigo-600 dark:text-indigo-400">
                <TrendingUp className="w-8 h-8" />
              </div>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 max-w-2xl">
              {t("landing.cta.titleReady")}{" "}
              <span className="text-indigo-600">
                {t("landing.cta.titleBoost")}
              </span>
            </h2>

            <p className="text-xl text-gray-600 dark:text-gray-300 mb-6 max-w-2xl">
              {t("landing.cta.description")}
            </p>

            {/* Sales benefits */}
            <div className="flex flex-wrap justify-center gap-6 mb-8 text-sm">
              <div className="flex items-center gap-2 bg-indigo-50 dark:bg-indigo-900/20 px-4 py-2 rounded-full">
                <TrendingUp className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span className="text-indigo-700 dark:text-indigo-300 font-medium">
                  {t("landing.cta.higherConversions")}
                </span>
              </div>
              <div className="flex items-center gap-2 bg-indigo-50 dark:bg-indigo-900/20 px-4 py-2 rounded-full">
                <ShoppingCart className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span className="text-indigo-700 dark:text-indigo-300 font-medium">
                  {t("landing.cta.marketplaceReady")}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white px-12 py-6 text-sm md:text-lg shadow-lg hover:shadow-indigo-500/25 transition-all sm:w-auto group font-semibold">
                  {t("landing.cta.startNow")}
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="#pricing">
                <Button
                  variant="outline"
                  className="px-8 py-6 text-sm md:text-lg border-2 border-gray-300 hover:border-indigo-600 dark:hover:border-indigo-600 transition-all sm:w-auto"
                >
                  {t("landing.cta.seeMoreExamples")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
