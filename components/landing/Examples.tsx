"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageIcon, Wand2, RefreshCw, Video, Zap } from "lucide-react";
import ReactCompareImage from "react-compare-image";
import { useTranslation } from "react-i18next";

export default function Examples() {
  const [tab, setTab] = useState("creation");
  const { t } = useTranslation();

  // Example data structure - in a real application, you would use actual image paths
  const examples = {
    creation: {
      title: t("landing.examples.creation.title"),
      description: t("landing.examples.creation.description"),
      beforeImage: "/examples/creation-before.jpg",
      afterImage: "/examples/creation-after.jpg",
      placeholder:
        "https://images.unsplash.com/photo-1621961458348-f013d219b50c?q=80&w=2069&auto=format&fit=crop",
      enhancedPlaceholder:
        "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=2070&auto=format&fit=crop",
    },
    editing: {
      title: t("landing.examples.editing.title"),
      description: t("landing.examples.editing.description"),
      beforeImage: "/examples/editing-before.jpg",
      afterImage: "/examples/editing-after.jpg",
      placeholder:
        "https://images.unsplash.com/photo-1558403194-611308249627?q=80&w=2070&auto=format&fit=crop",
      enhancedPlaceholder:
        "https://images.unsplash.com/photo-1561571994-3c61c554181a?q=80&w=2070&auto=format&fit=crop",
    },
    restoration: {
      title: t("landing.examples.restoration.title"),
      description: t("landing.examples.restoration.description"),
      beforeImage: "/examples/restoration-before.jpg",
      afterImage: "/examples/restoration-after.jpg",
      placeholder:
        "https://images.unsplash.com/photo-1532009877282-3340270e0529?q=80&w=2070&auto=format&fit=crop",
      enhancedPlaceholder:
        "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=2045&auto=format&fit=crop",
    },
    video: {
      title: t("landing.examples.video.title"),
      description: t("landing.examples.video.description"),
      beforeImage: "/examples/video-before.jpg",
      afterImage: "/examples/video-after.jpg",
      placeholder:
        "https://images.unsplash.com/photo-1532009877282-3340270e0529?q=80&w=2070&auto=format&fit=crop",
      enhancedPlaceholder:
        "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=2045&auto=format&fit=crop",
    },
  };

  const tabOptions = [
    {
      id: "creation",
      label: t("landing.examples.tabs.imageCreation"),
      icon: <ImageIcon className="w-4 h-4 mr-2" />,
    },
    {
      id: "editing",
      label: t("landing.examples.tabs.textEditing"),
      icon: <Wand2 className="w-4 h-4 mr-2" />,
    },
    {
      id: "restoration",
      label: t("landing.examples.tabs.restoration"),
      icon: <RefreshCw className="w-4 h-4 mr-2" />,
    },
    {
      id: "video",
      label: t("landing.examples.tabs.videoGeneration"),
      icon: <Video className="w-4 h-4 mr-2" />,
    },
  ];

  return (
    <section id="examples" className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-base font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide mb-3">
            {t("landing.examples.seeItInAction")}
          </h2>
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t("landing.examples.stunningTransformations")}
          </h3>
          <p className="max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-300">
            {t("landing.examples.sliderDescription")}
          </p>
        </div>

        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList className="bg-gray-100 dark:bg-gray-800 p-1 rounded-lg overflow-x-auto max-w-full flex-wrap h-12">
              {tabOptions.map((option) => (
                <TabsTrigger
                  key={option.id}
                  value={option.id}
                  className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 px-4 py-2 flex items-center whitespace-nowrap"
                >
                  {option.icon}
                  {option.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {Object.keys(examples).map((exampleKey) => (
            <TabsContent key={exampleKey} value={exampleKey} className="mt-0">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-5">
                  {/* Left side - Image comparison */}
                  <div className="col-span-1 lg:col-span-3 relative min-h-[300px] md:min-h-[500px]">
                    {exampleKey === "restoration" ? (
                      <ReactCompareImage
                        leftImage={
                          examples[exampleKey as keyof typeof examples]
                            .placeholder
                        }
                        rightImage={
                          examples[exampleKey as keyof typeof examples]
                            .enhancedPlaceholder
                        }
                        sliderLineWidth={2}
                        sliderLineColor="#6366F1"
                        handleSize={40}
                        leftImageLabel={t("examples.before")}
                        rightImageLabel={t("examples.after")}
                        leftImageCss={{ objectFit: "cover" }}
                        rightImageCss={{ objectFit: "cover" }}
                      />
                    ) : exampleKey === "video" ? (
                      <video
                        src={
                          examples[exampleKey as keyof typeof examples]
                            .enhancedPlaceholder
                        }
                        className="w-full h-full object-cover"
                        autoPlay
                        loop
                        muted
                        playsInline
                      />
                    ) : (
                      <div className="relative w-full h-full">
                        <img
                          src={
                            examples[exampleKey as keyof typeof examples]
                              .enhancedPlaceholder
                          }
                          alt={
                            examples[exampleKey as keyof typeof examples].title
                          }
                          className="w-full h-full object-cover"
                          width={800}
                          height={600}
                        />
                        <div className="absolute top-3 right-3 bg-indigo-600/90 text-white px-2 py-0.5 text-xs font-medium rounded-full backdrop-blur-sm flex items-center">
                          <Zap className="w-3 h-3 mr-1" />
                          {t("landing.examples.aiEnhanced")}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right side - Description */}
                  <div className="col-span-1 lg:col-span-2 p-6 md:p-8 flex flex-col justify-center">
                    <div className="mb-8">
                      <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        {examples[exampleKey as keyof typeof examples].title}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-300 text-lg">
                        {
                          examples[exampleKey as keyof typeof examples]
                            .description
                        }
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                        <h5 className="font-medium text-gray-900 dark:text-white mb-2">
                          {t("landing.examples.howItWorks")}
                        </h5>
                        <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1">
                          <li>{t("landing.examples.steps.upload")}</li>
                          <li>
                            {t("landing.examples.steps.select")}{" "}
                            {
                              examples[exampleKey as keyof typeof examples]
                                .title
                            }
                          </li>
                          <li>{t("landing.examples.steps.adjust")}</li>
                          <li>{t("landing.examples.steps.download")}</li>
                        </ul>
                      </div>
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
