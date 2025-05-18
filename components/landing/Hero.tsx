"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Sparkles,
  ImagePlus,
  Wand2,
  Image,
  ChevronLeft,
  ChevronRight,
  Camera,
  Zap,
  Video,
  Film,
} from "lucide-react";
import ReactCompareImage from "react-compare-image";
import { useTranslation } from "react-i18next";

export default function Hero() {
  const { t } = useTranslation();

  // Showcase examples data
  const showcaseExamples = [
    {
      id: "enhancement",
      title: t("landing.hero.showcase.imageEnhancement"),
      description: t("landing.hero.showcase.imageEnhancementDescription"),
      before:
        "https://images.unsplash.com/photo-1621961458348-f013d219b50c?q=80&w=2069&auto=format&fit=crop",
      after:
        "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=2070&auto=format&fit=crop",
    },
    {
      id: "restoration",
      title: t("landing.hero.showcase.photoRestoration"),
      description: t("landing.hero.showcase.photoRestorationDescription"),
      before:
        "https://images.unsplash.com/photo-1610126996694-69e2f0b5931f?q=80&w=1974&auto=format&fit=crop",
      after:
        "https://images.unsplash.com/photo-1627037558426-c2d07beda3af?q=80&w=1975&auto=format&fit=crop",
    },
    {
      id: "removal",
      title: t("landing.hero.showcase.objectRemoval"),
      description: t("landing.hero.showcase.objectRemovalDescription"),
      before:
        "https://images.unsplash.com/photo-1566438480900-0609be27a4be?q=80&w=2094&auto=format&fit=crop",
      after:
        "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?q=80&w=2070&auto=format&fit=crop",
    },
    {
      id: "ugc-creation",
      title: t("landing.hero.showcase.ugcCreation"),
      description: t("landing.hero.showcase.ugcCreationDescription"),
      before:
        "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=2074&auto=format&fit=crop",
      after:
        "https://images.unsplash.com/photo-1611162616305-c69b3396004b?q=80&w=2074&auto=format&fit=crop",
      isUGC: true,
    },
    {
      id: "ugc-video",
      title: t("landing.hero.showcase.ugcVideoGeneration"),
      description: t("landing.hero.showcase.ugcVideoGenerationDescription"),
      before:
        "https://images.unsplash.com/photo-1611162616305-c69b3396004b?q=80&w=2074&auto=format&fit=crop",
      after: "/ugc-video-example.mp4",
      isVideo: true,
    },
  ];

  const [activeExample, setActiveExample] = useState(0);

  const nextExample = () => {
    setActiveExample((current) => (current + 1) % showcaseExamples.length);
  };

  const prevExample = () => {
    setActiveExample(
      (current) =>
        (current - 1 + showcaseExamples.length) % showcaseExamples.length
    );
  };

  const currentExample = showcaseExamples[activeExample];

  return (
    <section className="relative pt-20 md:pt-28 pb-16 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      <div className="absolute -inset-x-40 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-indigo-600 to-violet-600 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
      </div>

      {/* Animated circles background */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-300/20 dark:bg-purple-900/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-indigo-300/20 dark:bg-indigo-900/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-blue-300/20 dark:bg-blue-900/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Grid layout for hero section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left column - Text content */}
          <div className="text-center lg:text-left order-2 lg:order-1">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/40 mb-6">
              <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400 mr-2" />
              <span className="text-sm font-medium text-indigo-800 dark:text-indigo-300">
                {t("landing.hero.badge")}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 leading-tight">
              {t("landing.hero.title")}
            </h1>

            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-xl mx-auto lg:mx-0">
              {t("landing.hero.description")}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
              <Link href="/signup">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white px-8 py-6 rounded-lg text-lg shadow-lg hover:shadow-indigo-500/25 transition-all group"
                >
                  {t("landing.hero.tryFreeNow")}
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="#examples">
                <Button
                  size="lg"
                  variant="outline"
                  className="px-8 py-6 rounded-lg text-lg border-2 border-indigo-200 dark:border-indigo-800 hover:border-indigo-600 dark:hover:border-indigo-600 transition-all"
                >
                  {t("landing.hero.viewExamples")}
                </Button>
              </Link>
            </div>

            {/* Stats counters */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-6 md:gap-10">
              {[
                {
                  label: t("landing.hero.stats.imagesEnhancedLabel"),
                  value: t("landing.hero.stats.imagesEnhanced"),
                },
                {
                  label: t("landing.hero.stats.happyUsersLabel"),
                  value: t("landing.hero.stats.happyUsers"),
                },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center lg:items-start"
                >
                  <span className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
                    {stat.value}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right column - Image comparison */}
          <div className="order-1 lg:order-2">
            <div className="rounded-2xl shadow-xl overflow-hidden bg-white dark:bg-gray-800/30 backdrop-blur-sm p-3 border border-gray-200 dark:border-gray-700/50 mx-auto max-w-lg">
              <div className="relative">
                {/* Example showcase title & navigation */}
                <div className="flex justify-between items-center mb-3 px-2">
                  <div>
                    <h3 className="text-base md:text-lg font-bold text-gray-900 dark:text-white">
                      {currentExample.title}
                    </h3>
                    <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                      {currentExample.description}
                    </p>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={prevExample}
                      className="p-1.5 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
                      aria-label="Previous example"
                    >
                      <ChevronLeft className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                    </button>
                    <button
                      onClick={nextExample}
                      className="p-1.5 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
                      aria-label="Next example"
                    >
                      <ChevronRight className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                    </button>
                  </div>
                </div>

                {/* Comparison slider or video */}
                <div className="relative aspect-[4/3]">
                  {currentExample.isVideo ? (
                    <div className="w-full h-full">
                      <video
                        src={currentExample.after}
                        className="w-full h-full object-cover"
                        autoPlay
                        loop
                        muted
                        playsInline
                      />
                      <div className="absolute top-3 right-3 bg-indigo-600/90 text-white px-2 py-0.5 text-xs font-medium rounded-full backdrop-blur-sm flex items-center">
                        <Video className="w-3 h-3 mr-1" />
                        {t("landing.hero.showcase.aiGeneratedVideo")}
                      </div>
                    </div>
                  ) : (
                    <>
                      <ReactCompareImage
                        leftImage={currentExample.before}
                        rightImage={currentExample.after}
                        sliderLineWidth={2}
                        sliderLineColor="#6366F1"
                        handleSize={40}
                        leftImageLabel={t("landing.hero.showcase.original")}
                        rightImageLabel={t("landing.hero.showcase.aiEnhanced")}
                        leftImageCss={{ objectFit: "cover" }}
                        rightImageCss={{ objectFit: "cover" }}
                      />

                      {/* Indicator badges */}
                      <div className="absolute top-3 left-3 bg-black/60 text-white px-2 py-0.5 text-xs font-medium rounded-full backdrop-blur-sm flex items-center">
                        <Camera className="w-3 h-3 mr-1" />
                        {t("landing.hero.showcase.original")}
                      </div>
                      <div className="absolute top-3 right-3 bg-indigo-600/90 text-white px-2 py-0.5 text-xs font-medium rounded-full backdrop-blur-sm flex items-center">
                        {currentExample.isUGC ? (
                          <>
                            <Wand2 className="w-3 h-3 mr-1" />
                            {t("landing.hero.showcase.aiUGC")}
                          </>
                        ) : (
                          <>
                            <Zap className="w-3 h-3 mr-1" />
                            {t("landing.hero.showcase.aiEnhanced")}
                          </>
                        )}
                      </div>

                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 rounded-full bg-indigo-600 text-white px-3 py-0.5 text-xs font-medium whitespace-nowrap shadow-lg">
                        {t("landing.hero.showcase.slideToCompare")}
                      </div>
                    </>
                  )}
                </div>

                {/* Pagination dots */}
                <div className="flex justify-center mt-3 space-x-2">
                  {showcaseExamples.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveExample(index)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === activeExample
                          ? "bg-indigo-600 dark:bg-indigo-500"
                          : "bg-gray-300 dark:bg-gray-600 hover:bg-indigo-400 dark:hover:bg-indigo-700"
                      }`}
                      aria-label={`Go to example ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features showcase */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 max-w-5xl mx-auto mt-16">
          {[
            {
              icon: <ImagePlus className="w-5 h-5" />,
              title: t("landing.hero.featureShowcase.aiImageEnhancement"),
              description: t(
                "landing.hero.featureShowcase.aiImageEnhancementDescription"
              ),
            },
            {
              icon: <Wand2 className="w-5 h-5" />,
              title: t("landing.hero.featureShowcase.creativeEditing"),
              description: t(
                "landing.hero.featureShowcase.creativeEditingDescription"
              ),
            },
            {
              icon: <Image className="w-5 h-5" />,
              title: t("landing.hero.featureShowcase.photoRestoration"),
              description: t(
                "landing.hero.featureShowcase.photoRestorationDescription"
              ),
            },
            {
              icon: <Film className="w-5 h-5" />,
              title: t("landing.hero.showcase.ugcVideoGeneration"),
              description: t(
                "landing.hero.showcase.ugcVideoGenerationDescription"
              ),
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800/50 backdrop-blur-sm p-5 rounded-xl shadow-md hover:shadow-lg hover:shadow-indigo-500/10 border border-gray-100 dark:border-gray-700/50 transition-all hover:-translate-y-1"
            >
              <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-3">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Visual indicator to scroll */}
        <div className="flex justify-center mt-12">
          <a
            href="#features"
            className="animate-bounce w-8 h-8 rounded-full bg-white dark:bg-gray-800 shadow-md flex items-center justify-center text-indigo-600 dark:text-indigo-400"
            aria-label="Scroll to features"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
