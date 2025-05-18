"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  ImageIcon,
  Video,
  Sparkles,
  MessageSquareText,
  ThumbsUp,
  Clock,
  User,
} from "lucide-react";
import { useTranslation } from "react-i18next";

export default function UGCGenerator() {
  const [activeTab, setActiveTab] = useState("image");
  const { t } = useTranslation();

  // Sample results (in a real app, these would be generated)
  const imageResults = [
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=1974&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1577880216142-8549e9c6ec7b?q=80&w=1950&auto=format&fit=crop",
  ];

  return (
    <section id="ugc-generator" className="py-20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-indigo-50/50 to-transparent dark:from-indigo-950/10 dark:to-transparent"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-100 dark:bg-indigo-900/40 mb-4">
            <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400 mr-2" />
            <span className="text-sm font-medium text-indigo-800 dark:text-indigo-300">
              {t("landing.ugcGenerator.badge")}
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t("landing.ugcGenerator.title")}
          </h2>
          <p className="max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-300">
            {t("landing.ugcGenerator.description")}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
          <Tabs
            defaultValue="image"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <div className="border-b border-gray-200 dark:border-gray-700">
              <div className="px-6 pt-6">
                <TabsList className="grid w-full grid-cols-2 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
                  <TabsTrigger
                    value="image"
                    className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800"
                  >
                    <ImageIcon className="w-4 h-4 mr-2" />
                    {t("landing.ugcGenerator.tabs.images")}
                  </TabsTrigger>
                  <TabsTrigger
                    value="video"
                    className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800"
                  >
                    <Video className="w-4 h-4 mr-2" />
                    {t("landing.ugcGenerator.tabs.videos")}
                  </TabsTrigger>
                </TabsList>
              </div>
            </div>

            <TabsContent value="image" className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-6 border border-gray-100 dark:border-gray-700">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2 flex items-center">
                      <MessageSquareText className="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400" />
                      {t("landing.ugcGenerator.prompt.title")}
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 p-4 rounded-md border border-gray-200 dark:border-gray-700">
                      {t("landing.ugcGenerator.prompt.imagePrompt")}
                    </p>

                    <div className="mt-5 space-y-3">
                      <div className="flex items-center">
                        <ThumbsUp className="w-4 h-4 text-gray-500 dark:text-gray-400 mr-2" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {t("landing.ugcGenerator.prompt.imageFeature1")}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <User className="w-4 h-4 text-gray-500 dark:text-gray-400 mr-2" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {t("landing.ugcGenerator.prompt.imageFeature2")}
                        </span>
                      </div>
                    </div>

                    <div className="mt-6">
                      <Button className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700">
                        <Sparkles className="w-4 h-4 mr-2" />
                        {t("landing.ugcGenerator.prompt.tryImageGeneration")}
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                    {t("landing.ugcGenerator.results.imageTitle")}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {t("landing.ugcGenerator.results.imageDescription")}
                  </p>

                  <div className="grid grid-cols-2 gap-4">
                    {imageResults.map((img, index) => (
                      <div
                        key={index}
                        className={`relative rounded-lg overflow-hidden border-2 ${
                          index === 0
                            ? "border-indigo-600 dark:border-indigo-500 ring-2 ring-indigo-600/30"
                            : "border-transparent hover:border-gray-300 dark:hover:border-gray-600"
                        } cursor-pointer transition-all`}
                      >
                        <div className="aspect-square">
                          <img
                            src={img}
                            alt={`Generated professional image ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        {index === 0 && (
                          <div className="absolute top-2 right-2 bg-indigo-600 text-white text-xs font-medium px-2 py-1 rounded-full">
                            {t("landing.ugcGenerator.results.selected")}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="video" className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-6 border border-gray-100 dark:border-gray-700">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2 flex items-center">
                      <MessageSquareText className="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400" />
                      {t("landing.ugcGenerator.prompt.title")}
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 p-4 rounded-md border border-gray-200 dark:border-gray-700">
                      {t("landing.ugcGenerator.prompt.videoPrompt")}
                    </p>

                    <div className="mt-5 space-y-3">
                      <div className="flex items-center">
                        <ThumbsUp className="w-4 h-4 text-gray-500 dark:text-gray-400 mr-2" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {t("landing.ugcGenerator.prompt.videoFeature1")}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <User className="w-4 h-4 text-gray-500 dark:text-gray-400 mr-2" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {t("landing.ugcGenerator.prompt.videoFeature2")}
                        </span>
                      </div>
                    </div>

                    <div className="mt-6">
                      <Button className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700">
                        <Sparkles className="w-4 h-4 mr-2" />
                        {t("landing.ugcGenerator.prompt.tryVideoGeneration")}
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                    {t("landing.ugcGenerator.results.videoTitle")}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {t("landing.ugcGenerator.results.videoDescription")}
                  </p>

                  <div className="aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600 relative">
                    {/* In a real implementation, this would be an actual video */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <Video className="w-16 h-16 text-indigo-600 dark:text-indigo-400 mx-auto mb-4" />
                        <p className="text-gray-700 dark:text-gray-300">
                          {t("landing.ugcGenerator.results.videoCaption")}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                          {t("landing.ugcGenerator.results.videoDetails")}
                        </p>
                      </div>
                    </div>

                    {/* Video play button */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <button className="w-16 h-16 rounded-full bg-indigo-600/90 text-white flex items-center justify-center shadow-lg hover:bg-indigo-700 transition-colors">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="white"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polygon points="5 3 19 12 5 21 5 3"></polygon>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 dark:text-gray-300">
            {t("landing.ugcGenerator.footer")}
          </p>
        </div>
      </div>
    </section>
  );
}
