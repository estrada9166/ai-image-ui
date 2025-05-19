"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageIcon, Wand2, RefreshCw, Video, Zap } from "lucide-react";
import ReactCompareImage from "react-compare-image";
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

type ExampleRestoration = {
  title: string;
  description: string;
  beforeImage: string;
  afterImage: string;
  prompt: null;
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
  restoration: ExampleRestoration;
  video: ExampleVideo;
};

export default function Examples() {
  const [tab, setTab] = useState("creation");
  const { t } = useTranslation();

  // Example data structure - in a real application, you would use actual image paths
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
    restoration: {
      title: t("landing.examples.restoration.title"),
      description: t("landing.examples.restoration.description"),
      beforeImage: "/examples/examples/before.webp",
      afterImage: "/examples/examples/after.png",
      prompt: null,
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
      icon: <ImageIcon className="w-4 h-4 mr-2" />,
    },
    {
      id: "editing",
      label: t("landing.examples.tabs.textEditing"),
      icon: <Wand2 className="w-4 h-4 mr-2" />,
    },
    {
      id: "video",
      label: t("landing.examples.tabs.videoGeneration"),
      icon: <Video className="w-4 h-4 mr-2" />,
    },
    {
      id: "restoration",
      label: t("landing.examples.tabs.restoration"),
      icon: <RefreshCw className="w-4 h-4 mr-2" />,
    },
  ];

  return (
    <section
      id="examples"
      className="py-12 sm:py-16 md:py-20 bg-gray-50 dark:bg-gray-900"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-base font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide mb-2 sm:mb-3">
            {t("landing.examples.seeItInAction")}
          </h2>
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
            {t("landing.examples.stunningTransformations")}
          </h3>
          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-gray-600 dark:text-gray-300">
            {t("landing.examples.sliderDescription")}
          </p>
        </div>

        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <div className="flex justify-center mb-6 sm:mb-8">
            <TabsList className="bg-gray-100 dark:bg-gray-800 p-1 rounded-lg overflow-x-auto max-w-full flex-wrap h-auto min-h-12">
              {tabOptions.map((option) => (
                <TabsTrigger
                  key={option.id}
                  value={option.id}
                  className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 px-3 sm:px-4 py-2 flex items-center whitespace-nowrap text-sm sm:text-base"
                >
                  {option.icon}
                  <span className="hidden xs:inline">{option.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {Object.keys(examples).map((exampleKey) => (
            <TabsContent key={exampleKey} value={exampleKey} className="mt-0">
              <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-5">
                  {/* Left side - Image comparison */}
                  <div className="col-span-1 lg:col-span-3 relative min-h-[250px] sm:min-h-[300px] md:min-h-[400px] lg:min-h-[500px]">
                    {exampleKey === "editing" || exampleKey === "creation" ? (
                      <div className="relative w-full h-full">
                        <img
                          src={
                            (
                              examples[exampleKey as keyof Examples] as
                                | ExampleCreation
                                | ExampleEditing
                            ).image
                          }
                          alt={examples[exampleKey as keyof Examples].title}
                          className="w-full h-full object-cover"
                          width={800}
                          height={600}
                        />
                        <div className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-indigo-600/90 text-white px-2 py-0.5 text-xs font-medium rounded-full backdrop-blur-sm flex items-center">
                          <Zap className="w-3 h-3 mr-1" />
                          {t("landing.examples.aiEnhanced")}
                        </div>
                      </div>
                    ) : exampleKey === "restoration" ? (
                      <ReactCompareImage
                        leftImage={examples.restoration.beforeImage}
                        rightImage={examples.restoration.afterImage}
                        sliderLineWidth={2}
                        sliderLineColor="#6366F1"
                        handleSize={40}
                        leftImageLabel={t("landing.examples.before")}
                        rightImageLabel={t("landing.examples.after")}
                        leftImageCss={{ objectFit: "cover" }}
                        rightImageCss={{ objectFit: "cover" }}
                      />
                    ) : (
                      <div className="relative w-full h-full">
                        {tab === "video" && (
                          <video
                            src={examples.video.video}
                            className="w-full h-full object-cover"
                            autoPlay
                            loop
                            muted
                            playsInline
                          />
                        )}
                        {tab !== "video" && (
                          <img
                            src={examples.video.image}
                            alt={examples.video.title}
                            className="w-full h-full object-cover"
                            width={800}
                            height={600}
                          />
                        )}
                      </div>
                    )}
                  </div>

                  {/* Right side - Description */}
                  <div className="col-span-1 lg:col-span-2 p-4 sm:p-6 md:p-8 flex flex-col justify-center">
                    <div className="mb-4 sm:mb-6 md:mb-8">
                      <h4 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-4">
                        {examples[exampleKey as keyof Examples].title}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg">
                        {examples[exampleKey as keyof Examples].description}
                      </p>
                    </div>

                    <div className="space-y-3 sm:space-y-4">
                      <div className="bg-gray-50 dark:bg-gray-700/50 p-3 sm:p-4 rounded-lg">
                        <h5 className="font-medium text-gray-900 dark:text-white mb-1 sm:mb-2 text-sm sm:text-base">
                          {t("landing.examples.howItWorks")}
                        </h5>
                        <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-0.5 sm:space-y-1 text-sm sm:text-base">
                          <li>{t("landing.examples.steps.upload")}</li>
                          <li>
                            {t("landing.examples.steps.select")}{" "}
                            {examples[exampleKey as keyof Examples].title}
                          </li>
                          <li>{t("landing.examples.steps.adjust")}</li>
                          <li>{t("landing.examples.steps.download")}</li>
                        </ul>
                      </div>

                      {examples[exampleKey as keyof Examples].prompt && (
                        <div className="bg-gray-50 dark:bg-gray-700/50 p-3 sm:p-4 rounded-lg">
                          <h5 className="font-medium text-gray-900 dark:text-white mb-1 sm:mb-2 text-sm sm:text-base">
                            Example Prompt:
                          </h5>
                          <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm italic">
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
