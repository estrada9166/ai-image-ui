"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ShoppingCart,
  Wand2,
  Video,
  Zap,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { useTranslation } from "react-i18next";

type ExampleCreation = {
  title: string;
  description: string;
  image: string;
  prompt: string;
};

type ExampleEditing = {
  title: string;
  description: string;
  image: string;
  prompt: string;
};

type ExampleVideo = {
  title: string;
  description: string;
  video: string;
  prompt: string;
  image: string;
};

type Examples = {
  creation: ExampleCreation;
  editing: ExampleEditing;
  video: ExampleVideo;
};

export default function Examples() {
  const [tab, setTab] = useState("creation");
  const { t } = useTranslation();

  const examples: Examples = {
    creation: {
      title: t("landing.examples.creation.title"),
      description: t("landing.examples.creation.description"),
      image: "/examples/examples/created.png",
      prompt: t("landing.examples.creation.prompt"),
    },
    editing: {
      title: t("landing.examples.editing.title"),
      description: t("landing.examples.editing.description"),
      image: "/examples/examples/editing.png",
      prompt: t("landing.examples.editing.prompt"),
    },
    video: {
      title: t("landing.examples.video.title"),
      description: t("landing.examples.video.description"),
      video: "/examples/examples/video.mp4",
      prompt: t("landing.examples.video.prompt"),
      image: "/examples/examples/created.png",
    },
  };

  const tabOptions = [
    {
      id: "creation",
      label: t("landing.examples.tabs.imageCreation"),
      icon: <ShoppingCart className="w-4 h-4 mr-2" />,
      gradient: "from-blue-500 to-indigo-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/30",
    },
    {
      id: "editing",
      label: t("landing.examples.tabs.textEditing"),
      icon: <Wand2 className="w-4 h-4 mr-2" />,
      gradient: "from-blue-500 to-indigo-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/30",
    },
    {
      id: "video",
      label: t("landing.examples.tabs.videoGeneration"),
      icon: <Video className="w-4 h-4 mr-2" />,
      gradient: "from-violet-500 to-purple-600",
      bgColor: "bg-violet-50 dark:bg-violet-900/30",
    },
  ];

  return (
    <section
      id="examples"
      className="py-20 relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800"
    >
      {/* Enhanced background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-20 -left-20 w-80 h-80 bg-gradient-to-r from-blue-300/20 to-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 -right-20 w-80 h-80 bg-gradient-to-r from-violet-300/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-50 to-blue-50 dark:from-blue-900/30 dark:to-blue-900/30 border border-blue-200 dark:border-blue-800 mb-6">
            <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400 mr-2" />
            <span className="text-sm font-medium text-blue-800 dark:text-blue-300">
              {t("landing.examples.seeItInAction")}
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            {t("landing.examples.stunningTransformations")}
          </h2>
        </div>

        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <div className="flex justify-center mb-12">
            <TabsList className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-1.5 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
              {tabOptions.map((option) => (
                <TabsTrigger
                  key={option.id}
                  value={option.id}
                  className={`data-[state=active]:bg-gradient-to-r data-[state=active]:${option.gradient}  px-6 py-3 flex items-center whitespace-nowrap text-sm font-medium rounded-xl transition-all duration-300 data-[state=active]:shadow-lg`}
                >
                  {option.icon}
                  <span className="hidden sm:block">{option.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {Object.keys(examples).map((exampleKey) => (
            <TabsContent key={exampleKey} value={exampleKey} className="mt-0">
              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-gray-200/50 dark:border-gray-700/50">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
                  {/* Left side - Image showcase */}
                  <div className="lg:col-span-2 relative min-h-[400px] lg:min-h-[600px]">
                    {exampleKey === "editing" || exampleKey === "creation" ? (
                      <div className="relative w-full h-full group">
                        <img
                          src={
                            (
                              examples[exampleKey as keyof Examples] as
                                | ExampleCreation
                                | ExampleEditing
                            ).image
                          }
                          alt={examples[exampleKey as keyof Examples].title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                        <div className="absolute top-4 right-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-3 py-1.5 text-sm font-medium rounded-full backdrop-blur-sm flex items-center shadow-lg">
                          <Zap className="w-4 h-4 mr-1.5" />
                          {t("landing.examples.aiEnhanced")}
                        </div>
                        <div className="absolute bottom-4 left-4 right-4 bg-black/60 text-white p-4 rounded-xl backdrop-blur-sm">
                          <p className="text-sm font-medium">
                            {t("landing.examples.perfectForEcommerce")}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="relative w-full h-full group">
                        {tab === "video" && (
                          <video
                            src={examples.video.video}
                            className="w-full h-full object-cover"
                            autoPlay
                            loop
                            muted
                            playsInline
                            poster={examples.video.image}
                          />
                        )}
                        {tab !== "video" && (
                          <img
                            src={examples.video.image}
                            alt={examples.video.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                        <div className="absolute top-4 right-4 bg-gradient-to-r from-violet-500 to-purple-600 text-white px-3 py-1.5 text-sm font-medium rounded-full backdrop-blur-sm flex items-center shadow-lg">
                          <Video className="w-4 h-4 mr-1.5" />
                          {t("landing.examples.productVideo")}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right side - Description */}
                  <div className="p-8 lg:p-10 flex flex-col justify-center">
                    <div className="mb-8">
                      <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                        {examples[exampleKey as keyof Examples].title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                        {examples[exampleKey as keyof Examples].description}
                      </p>
                    </div>

                    <div className="space-y-6">
                      <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-800/50 p-6 rounded-2xl border border-gray-200 dark:border-gray-600">
                        <h4 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                          <Sparkles className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                          {t("landing.examples.howItWorks")}
                        </h4>
                        <div className="space-y-3">
                          {[
                            t("landing.examples.steps.upload"),
                            `${t("landing.examples.steps.select")} ${
                              examples[exampleKey as keyof Examples].title
                            }`,
                            t("landing.examples.steps.adjust"),
                            t("landing.examples.steps.download"),
                          ].map((step, index) => (
                            <div key={index} className="flex items-center">
                              <span className="text-gray-700 dark:text-gray-300">
                                - {step}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {examples[exampleKey as keyof Examples].prompt && (
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-2xl border border-blue-200 dark:border-blue-800">
                          <h4 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center">
                            <ArrowRight className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                            {t("landing.examples.examplePrompt")}
                          </h4>
                          <p className="text-gray-700 dark:text-gray-300 italic leading-relaxed">
                            &ldquo;
                            {examples[exampleKey as keyof Examples].prompt}
                            &rdquo;
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}
