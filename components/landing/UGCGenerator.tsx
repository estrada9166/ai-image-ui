"use client";

import React, { useState, useRef, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  ImageIcon,
  Video,
  Sparkles,
  MessageSquareText,
  ThumbsUp,
  User,
  Play,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import Link from "next/link";

export default function UGCGenerator() {
  const [activeTab, setActiveTab] = useState("image");
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const { t } = useTranslation();
  const videoRef = useRef<HTMLVideoElement>(null);

  // Handle video loading when tab changes
  useEffect(() => {
    if (activeTab === "video" && videoRef.current) {
      // Load the video source when the video tab is active
      videoRef.current.src = "/examples/ugc/ugc-video.mp4";
      videoRef.current.load();

      // Add event listener to track when video is loaded
      const handleVideoLoaded = () => setIsVideoLoaded(true);
      videoRef.current.addEventListener("loadeddata", handleVideoLoaded);

      // Add event listener to track when video ends
      const handleVideoEnded = () => setIsPlaying(false);
      videoRef.current.addEventListener("ended", handleVideoEnded);

      return () => {
        if (videoRef.current) {
          videoRef.current.removeEventListener("loadeddata", handleVideoLoaded);
          videoRef.current.removeEventListener("ended", handleVideoEnded);
        }
      };
    }
  }, [activeTab]);

  const handlePlayVideo = () => {
    if (videoRef.current) {
      videoRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((error) => {
          console.error("Error playing video:", error);
        });
    }
  };

  return (
    <section
      id="ugc-generator"
      className="py-12 sm:py-16 md:py-20 relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-indigo-50/50 to-transparent dark:from-indigo-950/10 dark:to-transparent"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <div className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-indigo-100 dark:bg-indigo-900/40 mb-3 sm:mb-4">
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-indigo-600 dark:text-indigo-400 mr-1.5 sm:mr-2" />
            <span className="text-xs sm:text-sm font-medium text-indigo-800 dark:text-indigo-300">
              {t("landing.ugcGenerator.badge")}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
            {t("landing.ugcGenerator.title")}
          </h2>
          <p className="max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300">
            {t("landing.ugcGenerator.description")}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
          <Tabs
            defaultValue="image"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <div className="border-b border-gray-200 dark:border-gray-700">
              <div className="px-4 sm:px-6 pt-4 sm:pt-6">
                <TabsList className="grid w-full grid-cols-2 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
                  <TabsTrigger
                    value="image"
                    className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 py-1.5 sm:py-2 text-sm sm:text-base"
                  >
                    <ImageIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                    {t("landing.ugcGenerator.tabs.images")}
                  </TabsTrigger>
                  <TabsTrigger
                    value="video"
                    className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 py-1.5 sm:py-2 text-sm sm:text-base"
                  >
                    <Video className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                    {t("landing.ugcGenerator.tabs.videos")}
                  </TabsTrigger>
                </TabsList>
              </div>
            </div>

            <TabsContent value="image" className="p-4 sm:p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                <div className="space-y-4 sm:space-y-6">
                  <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 sm:p-6 border border-gray-100 dark:border-gray-700">
                    <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-2 flex items-center">
                      <MessageSquareText className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2 text-indigo-600 dark:text-indigo-400" />
                      {t("landing.ugcGenerator.prompt.title")}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-md border border-gray-200 dark:border-gray-700">
                      {t("landing.ugcGenerator.prompt.imagePrompt")}
                    </p>

                    <div className="mt-4 sm:mt-5 space-y-2 sm:space-y-3">
                      <div className="flex items-center">
                        <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500 dark:text-gray-400 mr-1.5 sm:mr-2" />
                        <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                          {t("landing.ugcGenerator.prompt.imageFeature2")}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 sm:mt-6">
                      <Link href="#pricing">
                        <Button className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-sm sm:text-base py-1.5 sm:py-2">
                          <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                          {t("landing.ugcGenerator.prompt.tryImageGeneration")}
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-1">
                    {t("landing.ugcGenerator.results.imageTitle")}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2 sm:mb-4">
                    {t("landing.ugcGenerator.results.imageDescription")}
                  </p>

                  <div className="grid grid-cols-1 gap-4">
                    <div className="relative rounded-lg overflow-hidden border-2 border-indigo-600 dark:border-indigo-500 ring-2 ring-indigo-600/30 cursor-pointer transition-all duration-300 hover:shadow-lg">
                      <div className="aspect-square">
                        <img
                          src="/examples/ugc/ugc.png"
                          alt={`Generated professional image`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute top-2 right-2 bg-indigo-600 text-white text-xs font-medium px-2 py-0.5 sm:py-1 rounded-full">
                        {t("landing.ugcGenerator.results.selected")}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="video" className="p-4 sm:p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                <div className="space-y-4 sm:space-y-6">
                  <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 sm:p-6 border border-gray-100 dark:border-gray-700">
                    <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-2 flex items-center">
                      <MessageSquareText className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2 text-indigo-600 dark:text-indigo-400" />
                      {t("landing.ugcGenerator.prompt.title")}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-md border border-gray-200 dark:border-gray-700">
                      {t("landing.ugcGenerator.prompt.videoPrompt")}
                    </p>

                    <div className="mt-4 sm:mt-5 space-y-2 sm:space-y-3">
                      <div className="flex items-center">
                        <ThumbsUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500 dark:text-gray-400 mr-1.5 sm:mr-2" />
                        <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                          {t("landing.ugcGenerator.prompt.videoFeature1")}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500 dark:text-gray-400 mr-1.5 sm:mr-2" />
                        <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                          {t("landing.ugcGenerator.prompt.videoFeature2")}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 sm:mt-6">
                      <Link href="#pricing">
                        <Button className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-sm sm:text-base py-1.5 sm:py-2">
                          <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                          {t("landing.ugcGenerator.prompt.tryVideoGeneration")}
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-1">
                    {t("landing.ugcGenerator.results.videoTitle")}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2 sm:mb-4">
                    {t("landing.ugcGenerator.results.videoDescription")}
                  </p>

                  <div className="grid grid-cols-1 gap-4">
                    <div className="relative rounded-lg overflow-hidden border-2 border-indigo-600 dark:border-indigo-500 ring-2 ring-indigo-600/30 cursor-pointer transition-all duration-300 hover:shadow-lg">
                      <div className="aspect-square relative">
                        <video
                          ref={videoRef}
                          className="w-full h-full object-cover"
                          controls={isVideoLoaded}
                          playsInline
                          preload="metadata"
                          poster="/examples/ugc/ugc.png"
                          onError={(e) => console.error("Video error:", e)}
                        >
                          <source
                            src="/examples/ugc/ugc-video.mp4"
                            type="video/mp4"
                          />
                          {t(
                            "landing.ugcGenerator.results.browserDoesNotSupportVideo"
                          )}
                        </video>

                        {/* Video play button overlay - only show if video is not playing */}
                        {(!isVideoLoaded ||
                          (videoRef.current && videoRef.current.paused)) &&
                          !isPlaying && (
                            <div
                              className="absolute inset-0 flex items-center justify-center cursor-pointer bg-black/20 backdrop-blur-sm transition-opacity duration-300"
                              onClick={handlePlayVideo}
                            >
                              <button className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-indigo-600/90 text-white flex items-center justify-center shadow-lg hover:bg-indigo-700 transition-colors duration-300 transform hover:scale-105">
                                <Play
                                  className="w-5 h-5 sm:w-6 sm:h-6 ml-0.5 sm:ml-1"
                                  fill="white"
                                />
                              </button>
                            </div>
                          )}
                      </div>
                      <div className="absolute top-2 right-2 bg-indigo-600 text-white text-xs font-medium px-2 py-0.5 sm:py-1 rounded-full">
                        {t("landing.ugcGenerator.results.selected")}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="text-center mt-6 sm:mt-8 md:mt-12">
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
            {t("landing.ugcGenerator.footer")}
          </p>
        </div>
      </div>
    </section>
  );
}
