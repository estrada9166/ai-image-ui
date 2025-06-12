"use client";

import React from "react";
import { ShoppingCart, Wand2, TrendingUp, Zap } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Features() {
  const { t } = useTranslation();

  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: t("landing.features.items.instantEnhancement.title"),
      description: t("landing.features.items.instantEnhancement.description"),
      bgColor: "from-indigo-500 to-blue-600",
      borderColor: "border-indigo-200 dark:border-indigo-800",
      iconBg: "bg-indigo-50 dark:bg-indigo-900/30",
      textColor: "text-indigo-600 dark:text-indigo-400",
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: t("landing.features.items.boostConversions.title"),
      description: t("landing.features.items.boostConversions.description"),
      bgColor: "from-blue-500 to-indigo-600",
      borderColor: "border-blue-200 dark:border-blue-800",
      iconBg: "bg-blue-50 dark:bg-blue-900/30",
      textColor: "text-blue-600 dark:text-blue-400",
    },
    {
      icon: <ShoppingCart className="w-6 h-6" />,
      title: t("landing.features.items.marketplaceReady.title"),
      description: t("landing.features.items.marketplaceReady.description"),
      bgColor: "from-violet-500 to-purple-600",
      borderColor: "border-violet-200 dark:border-violet-800",
      iconBg: "bg-violet-50 dark:bg-violet-900/30",
      textColor: "text-violet-600 dark:text-violet-400",
    },
    {
      icon: <Wand2 className="w-6 h-6" />,
      title: t("landing.features.items.aiPoweredMagic.title"),
      description: t("landing.features.items.aiPoweredMagic.description"),
      bgColor: "from-orange-500 to-red-600",
      borderColor: "border-orange-200 dark:border-orange-800",
      iconBg: "bg-orange-50 dark:bg-orange-900/30",
      textColor: "text-orange-600 dark:text-orange-400",
    },
  ];

  return (
    <section
      id="features"
      className="py-24 relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950"
    >
      {/* Enhanced background elements */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-gradient-to-r from-violet-400/20 to-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-800 mb-6">
            <TrendingUp className="w-4 h-4 text-indigo-600 dark:text-indigo-400 mr-2" />
            <span className="text-sm font-medium text-indigo-800 dark:text-indigo-300">
              {t("landing.features.whyChooseOurPlatform")}
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            {t("landing.features.everythingYouNeedToBoostSales")}
          </h2>
          <p className="max-w-3xl mx-auto text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
            {t("landing.features.professionalGradeTools")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 max-w-4xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl p-8 transition-all duration-500 hover:-translate-y-2 border-2 ${feature.borderColor} hover:border-opacity-100 relative overflow-hidden`}
            >
              {/* Gradient overlay on hover */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${feature.bgColor} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-2xl`}
              ></div>

              <div className="relative z-10">
                <div
                  className={`w-16 h-16 rounded-2xl mb-6 flex items-center justify-center ${feature.iconBg} group-hover:scale-110 transition-transform duration-300`}
                >
                  <div className={`${feature.textColor}`}>{feature.icon}</div>
                </div>

                <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white group-hover:text-gray-800 dark:group-hover:text-gray-100 transition-colors">
                  {feature.title}
                </h3>

                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
