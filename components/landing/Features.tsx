"use client";

import React from "react";
import {
  Image,
  Wand2,
  Sparkles,
  ImagePlus,
  RefreshCw,
  Palette,
  Layers,
  Film,
} from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Features() {
  const { t } = useTranslation();

  const features = [
    {
      icon: <Sparkles />,
      title: t("landing.features.items.imageCreation"),
      description: t("landing.features.items.imageCreationDescription"),
      bgColor: "from-blue-500/10 to-indigo-500/10",
    },
    {
      icon: <ImagePlus />,
      title: t("landing.features.items.aiImageEnhancement"),
      description: t("landing.features.items.aiImageEnhancementDescription"),
      bgColor: "from-indigo-500/10 to-violet-500/10",
    },
    {
      icon: <Wand2 />,
      title: t("landing.features.items.textGuidedEditing"),
      description: t("landing.features.items.textGuidedEditingDescription"),
      bgColor: "from-violet-500/10 to-purple-500/10",
    },
    {
      icon: <RefreshCw />,
      title: t("landing.features.items.photoRestoration"),
      description: t("landing.features.items.photoRestorationDescription"),
      bgColor: "from-purple-500/10 to-pink-500/10",
    },
    {
      icon: <Film />,
      title: t("landing.hero.showcase.ugcVideoGeneration"),
      description: t("landing.hero.showcase.ugcVideoGenerationDescription"),
      bgColor: "from-pink-500/10 to-rose-500/10",
    },
    {
      icon: <Palette />,
      title: t("landing.features.items.styleTransfer"),
      description: t("landing.features.items.styleTransferDescription"),
      bgColor: "from-rose-500/10 to-orange-500/10",
    },
    {
      icon: <Layers />,
      title: t("landing.features.items.backgroundReplacement"),
      description: t("landing.features.items.backgroundReplacementDescription"),
      bgColor: "from-orange-500/10 to-amber-500/10",
    },
    {
      icon: <Sparkles />,
      title: t("landing.features.items.smartRetouching"),
      description: t("landing.features.items.smartRetouchingDescription"),
      bgColor: "from-amber-500/10 to-yellow-500/10",
    },
  ];

  return (
    <section id="features" className="py-20 relative overflow-hidden">
      {/* Subtle background elements */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-indigo-50/50 to-transparent dark:from-indigo-950/20 dark:to-transparent"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <h2 className="text-base font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide mb-3">
            {t("landing.features.header")}
          </h2>
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t("landing.features.title")}
          </h3>
          <p className="max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-300">
            {t("landing.features.description")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl p-6 transition-all duration-300 hover:-translate-y-1 border border-gray-100 dark:border-gray-700"
            >
              <div
                className={`w-12 h-12 rounded-lg mb-5 flex items-center justify-center bg-gradient-to-br ${feature.bgColor}`}
              >
                <div className="text-indigo-600 dark:text-indigo-400">
                  {feature.icon}
                </div>
              </div>
              <h4 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                {feature.title}
              </h4>
              <p className="text-gray-600 dark:text-gray-300">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-900/30">
            <Image className="w-4 h-4 text-indigo-600 dark:text-indigo-400 mr-2" />
            <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">
              {t("landing.features.poweredBy")}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
