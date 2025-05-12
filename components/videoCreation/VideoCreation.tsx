"use client";

import { motion } from "framer-motion";
import {
  ImageIcon,
  VideoIcon,
  Wand2,
  RefreshCw,
  Sparkles,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useSearchParams } from "next/navigation";
import { graphql } from "../../gql";
import { useMutation, useQuery } from "urql";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Image } from "../../gql/graphql";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ImageGallery } from "../gallery/ImageGallery";
import { VideoGallery } from "../gallery/VideoGallery";

const ImageByIdQuery = graphql(/* GraphQL */ `
  query ImageById($id: ID!) {
    node(id: $id) {
      ... on Image {
        id
        prompt
        imageUrl
      }
    }
  }
`);

const VideoCreationMutation = graphql(/* GraphQL */ `
  mutation VideoCreation($input: VideoCreationInput!) {
    videoCreation(input: $input) {
      id
      status
    }
  }
`);

export default function VideoCreation() {
  const searchParams = useSearchParams();

  const [videoPrompt, setVideoPrompt] = useState("");
  const [negativePrompt, setNegativePrompt] = useState("");
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [shouldRefetch, setShouldRefetch] = useState(false);
  const [createdVideoId, setCreatedVideoId] = useState<string | null>(null);

  const image = searchParams?.get("image");

  const [, generateVideo] = useMutation(VideoCreationMutation);

  const [result] = useQuery({
    query: ImageByIdQuery,
    variables: { id: image || "" },
    pause: !image,
  });

  const { data, fetching, error } = result;
  const imageData = data?.node as Image | null;

  const handleGenerateVideo = async () => {
    if (!videoPrompt.trim() || !imageData) return;

    setIsGeneratingVideo(true);
    setVideoUrl(null);

    try {
      setShouldRefetch(true);

      const result = await generateVideo({
        input: {
          prompt: videoPrompt,
          imageId: image || "",
          negativePrompt,
        },
      });

      setCreatedVideoId(result?.data?.videoCreation?.id || null);
    } catch (error) {
      console.error("Error generating video:", error);
    } finally {
      setIsGeneratingVideo(false);
    }
  };

  const handleDownloadVideo = async () => {
    if (!videoUrl) return;

    try {
      const response = await fetch(videoUrl);
      if (!response.ok) throw new Error("Network response was not ok");

      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = "generated-video.mp4";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Error downloading video:", error);
    }
  };

  if (fetching && !imageData) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-8 flex justify-center items-center h-screen">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full"
        >
          {/* Loading Skeleton for Image Preview */}
          <Card className="border border-purple-100 dark:border-purple-900/30 shadow-lg bg-white/90 backdrop-blur-sm dark:bg-gray-800/90 overflow-hidden">
            <CardContent className="p-8">
              <div className="flex items-center gap-2 mb-4">
                <Skeleton className="h-5 w-5 rounded-full" />
                <Skeleton className="h-6 w-28" />
              </div>
              <Skeleton className="aspect-square w-full rounded-lg" />
            </CardContent>
          </Card>

          {/* Loading Skeleton for Prompt */}
          <Card className="border border-purple-100 dark:border-purple-900/30 shadow-lg bg-white/90 backdrop-blur-sm dark:bg-gray-800/90 overflow-hidden">
            <CardContent className="p-8">
              <div className="flex items-center gap-2 mb-4">
                <Skeleton className="h-5 w-5 rounded-full" />
                <Skeleton className="h-6 w-36" />
              </div>
              <Skeleton className="h-5 w-full mb-4" />
              <Skeleton className="h-24 w-full rounded-md" />
              <div className="flex justify-end gap-3 mt-4">
                <Skeleton className="h-10 w-24 rounded-md" />
                <Skeleton className="h-10 w-36 rounded-md" />
              </div>
            </CardContent>
          </Card>

          {/* Loading Skeleton for Video Output */}
          <Card className="border border-purple-100 dark:border-purple-900/30 shadow-lg bg-white/90 backdrop-blur-sm dark:bg-gray-800/90 overflow-hidden">
            <CardContent className="p-8">
              <div className="flex items-center gap-2 mb-4">
                <Skeleton className="h-5 w-5 rounded-full" />
                <Skeleton className="h-6 w-32" />
              </div>
              <Skeleton className="aspect-video w-full rounded-lg" />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto max-w-7xl px-4 flex justify-center items-center h-screen">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="max-w-md w-full bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-lg p-8 shadow-md"
        >
          <VideoIcon className="h-16 w-16 text-red-400 mx-auto mb-6" />
          <h3 className="text-2xl font-medium text-red-700 dark:text-red-400 mb-3 text-center">
            Error Loading Image
          </h3>
          <p className="text-red-600 dark:text-red-300 text-center mb-6">
            {error.message}
          </p>
          <div className="flex justify-center">
            <Button
              variant="outline"
              className="border-red-200 text-red-700 hover:bg-red-50 dark:border-red-800/30 dark:text-red-400 dark:hover:bg-red-900/20"
              onClick={() => window.history.back()}
            >
              Go Back
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!imageData && !fetching) {
    return (
      <>
        <div className="container mx-auto max-w-7xl px-4 py-8 min-h-screen flex flex-col">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-md w-full mx-auto bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30 rounded-lg p-4 shadow-md"
          >
            <div className="flex items-center gap-3">
              <div className="bg-amber-100 dark:bg-amber-700/20 p-2 rounded-full w-10 h-10 flex items-center justify-center">
                <ImageIcon className="h-5 w-5 text-amber-500 dark:text-amber-300" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-medium text-amber-800 dark:text-amber-300 mb-1">
                  No Image Selected
                </h3>
                <p className="text-sm text-amber-700 dark:text-amber-200">
                  Please select an image from the gallery below.
                </p>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-8 flex-grow"
          >
            <h2 className="text-xl font-medium text-gray-800 dark:text-gray-200 mb-4 text-center">
              Select an image from your gallery
            </h2>
            <div className="max-w-4xl mx-auto">
              <ImageGallery />
            </div>
          </motion.div>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50 dark:from-gray-900 dark:to-purple-950/30">
      <div className="container mx-auto max-w-7xl px-6 py-12 flex justify-center items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="grid grid-cols-1 md:grid-cols-5 gap-8 w-full"
        >
          {/* Source Image */}
          <Card className="border border-purple-100 dark:border-purple-900/30 shadow-lg bg-white/95 backdrop-blur-sm dark:bg-gray-800/95 overflow-hidden hover:shadow-xl transition-all duration-300 md:col-span-2 rounded-xl">
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <ImageIcon className="h-5 w-5 text-purple-500" />
                  Source Image
                </h3>
                <Badge
                  variant="outline"
                  className="text-sm py-1 px-2 bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800/30"
                >
                  Original
                </Badge>
              </div>
              <div className="aspect-square relative overflow-hidden rounded-lg border border-purple-100 dark:border-purple-900/50 shadow-inner group">
                {imageData?.imageUrl ? (
                  <>
                    <img
                      src={imageData.imageUrl}
                      alt="Selected image"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {imageData.prompt && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 text-white text-sm truncate cursor-help">
                              {imageData.prompt}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs bg-gray-900/95 text-white border-purple-500/20 backdrop-blur-md">
                            <p>{imageData.prompt}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-700">
                    <p className="text-gray-500 dark:text-gray-400 text-base">
                      No image selected
                    </p>
                  </div>
                )}
              </div>

              {/* Prompt Input Below Image */}
              <div className="mt-6 space-y-5">
                <div className="space-y-3">
                  <h3 className="text-base font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-purple-500" />
                    Animation Description
                  </h3>
                  <Textarea
                    placeholder="Describe how you want your image to animate..."
                    className="min-h-[100px] text-base resize-none border-purple-100 dark:border-purple-900/50 focus:border-purple-300 focus:ring-purple-500 transition-colors duration-200 rounded-lg"
                    value={videoPrompt}
                    onChange={(e) => setVideoPrompt(e.target.value)}
                    disabled={isGeneratingVideo}
                  />
                </div>

                <div className="space-y-3">
                  <h3 className="text-base font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-red-500" />
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="cursor-help border-b border-dotted border-gray-400">
                            Negative Prompt
                          </span>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs bg-gray-900/95 text-white border-red-500/20 backdrop-blur-md">
                          <p>
                            Specify what you don&apos;t want to see in your
                            animation. This helps the AI avoid unwanted
                            elements.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </h3>
                  <Textarea
                    placeholder="Specify what you don't want in your animation..."
                    className="min-h-[80px] text-base resize-none border-red-100 dark:border-red-900/50 focus:border-red-300 focus:ring-red-500 transition-colors duration-200 rounded-lg"
                    value={negativePrompt}
                    onChange={(e) => setNegativePrompt(e.target.value)}
                    disabled={isGeneratingVideo}
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => setVideoPrompt("")}
                    disabled={!videoPrompt.trim() || isGeneratingVideo}
                    className="text-sm border-purple-200 text-purple-700 hover:bg-purple-50 dark:border-purple-900/30 dark:text-purple-400 dark:hover:bg-purple-900/20 transition-colors duration-200 rounded-full"
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Clear
                  </Button>
                  <Button
                    onClick={handleGenerateVideo}
                    disabled={
                      isGeneratingVideo ||
                      !videoPrompt.trim() ||
                      !imageData?.imageUrl
                    }
                    className="text-sm bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg rounded-full"
                  >
                    {isGeneratingVideo ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      <>
                        <Wand2 className="mr-2 h-4 w-4" />
                        Generate Video
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Video Output */}
          <Card className="border border-purple-100 dark:border-purple-900/30 shadow-lg bg-white/95 backdrop-blur-sm dark:bg-gray-800/95 overflow-hidden md:col-span-3 hover:shadow-xl transition-all duration-300 rounded-xl">
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <VideoIcon className="h-5 w-5 text-purple-500" />
                  Generated Video
                </h3>
                {videoUrl && (
                  <Badge className="text-sm py-1 px-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-sm rounded-full">
                    Ready
                  </Badge>
                )}
                {isGeneratingVideo && (
                  <Badge className="text-sm py-1 px-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 animate-pulse shadow-sm rounded-full">
                    Processing
                  </Badge>
                )}
              </div>
              <div
                className="relative overflow-hidden rounded-xl border border-purple-100 dark:border-purple-900/50 bg-gray-100 dark:bg-gray-700 shadow-inner w-full h-auto"
                style={{ aspectRatio: "16/9" }}
              >
                {isGeneratingVideo ? (
                  <div className="text-center p-8 h-full flex flex-col items-center justify-center">
                    <div className="relative w-24 h-24 mb-6">
                      <svg
                        className="animate-spin h-24 w-24 text-purple-600"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Sparkles className="h-10 w-10 text-white animate-pulse" />
                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 font-medium text-lg mb-3">
                      Creating your video...
                    </p>
                    <div className="max-w-md">
                      <p className="text-base text-gray-500 dark:text-gray-400">
                        We&apos;re bringing your image to life with AI magic!
                        This typically takes 1-2 minutes.
                      </p>
                    </div>
                    <div className="w-full max-w-sm bg-gray-200 dark:bg-gray-600 rounded-full h-3 mt-6 overflow-hidden">
                      <motion.div
                        className="bg-gradient-to-r from-purple-600 to-indigo-600 h-3 rounded-full"
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 60, ease: "linear" }}
                      />
                    </div>
                  </div>
                ) : videoUrl ? (
                  <div className="relative w-full h-full group">
                    <video
                      src={videoUrl}
                      controls
                      autoPlay
                      loop
                      className="w-full h-full object-contain"
                    >
                      Your browser does not support the video tag.
                    </video>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-6 pointer-events-none">
                      <p className="text-white text-base font-medium">
                        Hover to see controls
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-8 h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
                    <VideoIcon className="h-16 w-16 text-purple-400 mx-auto mb-4 opacity-75" />
                    <p className="text-gray-600 dark:text-gray-300 font-medium text-lg mb-3">
                      {videoPrompt
                        ? "Your video will appear here once generated"
                        : "Enter a prompt to generate a video"}
                    </p>
                    <p className="text-base text-gray-500 dark:text-gray-400 max-w-md">
                      Click the &quot;Generate Video&quot; button to transform
                      your static image into a dynamic video
                    </p>
                  </div>
                )}
              </div>
              {videoUrl && (
                <div className="flex justify-end mt-6">
                  <Button
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg rounded-full"
                    onClick={handleDownloadVideo}
                  >
                    <Download className="mr-2 h-5 w-5" />
                    Download Video
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
      <div className="container mx-auto max-w-7xl px-6 pb-16">
        <VideoGallery
          shouldRefetch={shouldRefetch}
          setVideoUrl={setVideoUrl}
          createdVideoId={createdVideoId}
        />
      </div>
    </div>
  );
}
