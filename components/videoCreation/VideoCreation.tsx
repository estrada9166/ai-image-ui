"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ImageIcon, VideoIcon, Wand2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useSearchParams } from "next/navigation";

import { graphql } from "../../gql";
import { useMutation, useQuery } from "urql";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Image } from "../../gql/graphql";

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
    videoCreation(input: $input)
  }
`);

export default function VideoCreation() {
  const searchParams = useSearchParams();

  const [videoPrompt, setVideoPrompt] = useState("");
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);

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

    try {
      await generateVideo({
        input: {
          prompt: videoPrompt,
          imageId: image || "",
        },
      });
    } catch (error) {
      console.error("Error generating video:", error);
    } finally {
      setIsGeneratingVideo(false);
    }
  };

  if (fetching && !imageData) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Loading Skeleton for Image Preview */}
          <Card className="border border-purple-100 dark:border-purple-900/30 shadow-lg bg-white/90 backdrop-blur-sm dark:bg-gray-800/90">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Skeleton className="h-5 w-5 rounded-full" />
                <Skeleton className="h-6 w-32" />
              </div>
              <Skeleton className="aspect-square w-full rounded-lg" />
            </CardContent>
          </Card>

          {/* Loading Skeleton for Video Generation */}
          <Card className="border border-purple-100 dark:border-purple-900/30 shadow-lg bg-white/90 backdrop-blur-sm dark:bg-gray-800/90">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Skeleton className="h-5 w-5 rounded-full" />
                    <Skeleton className="h-6 w-40" />
                  </div>
                  <Skeleton className="h-4 w-64 mb-4" />
                  <Skeleton className="min-h-[120px] w-full rounded-md" />
                </div>
                <div className="flex justify-end gap-2">
                  <Skeleton className="h-10 w-24 rounded-md" />
                  <Skeleton className="h-10 w-36 rounded-md" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500">Error loading image: {error.message}</p>
      </div>
    );
  }

  if (!imageData && !fetching) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500">No image data found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Selected Image Preview */}
        <Card className="border border-purple-100 dark:border-purple-900/30 shadow-lg bg-white/90 backdrop-blur-sm dark:bg-gray-800/90">
          <CardContent className="p-6">
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-purple-500" />
              Selected Image
            </h3>
            <div className="aspect-square relative overflow-hidden rounded-lg border border-purple-100 dark:border-purple-900/50">
              {imageData?.imageUrl ? (
                <img
                  src={imageData.imageUrl}
                  alt="Selected image"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-700">
                  <p className="text-gray-500 dark:text-gray-400">
                    No image selected
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Video Generation */}
        <Card className="border border-purple-100 dark:border-purple-900/30 shadow-lg bg-white/90 backdrop-blur-sm dark:bg-gray-800/90">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                  <VideoIcon className="h-5 w-5 text-purple-500" />
                  Bring your image to life
                </h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                  Describe how you want your image to animate
                </p>
                <Textarea
                  placeholder="Add gentle ripples to the lake, subtle swaying of the trees in the breeze, and soft smoke rising from the cabin chimney..."
                  className="min-h-[120px] resize-none border-purple-100 dark:border-purple-900/50 focus:border-purple-300 focus:ring-purple-500"
                  value={videoPrompt}
                  onChange={(e) => setVideoPrompt(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setVideoPrompt("")}
                  disabled={!videoPrompt.trim() || isGeneratingVideo}
                  className="border-purple-200 text-purple-700 hover:bg-purple-50 dark:border-purple-900/30 dark:text-purple-400 dark:hover:bg-purple-900/20"
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
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all"
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
                      Animating...
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
      </div>

      {/* Video Result */}
      <AnimatePresence>
        {imageData?.imageUrl && videoPrompt && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border border-purple-100 dark:border-purple-900/30 shadow-lg bg-white/90 backdrop-blur-sm dark:bg-gray-800/90">
              <CardContent className="p-6">
                <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
                  <VideoIcon className="h-5 w-5 text-purple-500" />
                  Generated Video
                </h3>
                <div className="aspect-video relative overflow-hidden rounded-lg border border-purple-100 dark:border-purple-900/50 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                  {isGeneratingVideo ? (
                    <div className="text-center p-8">
                      <svg
                        className="animate-spin h-12 w-12 text-purple-600 mx-auto mb-4"
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
                      <p className="text-gray-600 dark:text-gray-300 font-medium">
                        Creating your video...
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        This may take a minute or two. We&apos;re bringing your
                        image to life!
                      </p>
                    </div>
                  ) : (
                    <div className="text-center p-8">
                      <VideoIcon className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                      <p className="text-gray-600 dark:text-gray-300 font-medium">
                        {videoPrompt
                          ? "Your video will appear here once generated"
                          : "Enter a prompt to generate a video"}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        Click the &quot;Generate Video&quot; button to start the
                        process
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
