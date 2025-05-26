"use client";

import type React from "react";

import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { GenAiStatusEnum } from "@/gql/graphql";
import { graphql } from "../../gql";
import { useQuery } from "urql";
import {
  Download,
  X,
  ChevronRight,
  Loader2,
  Play,
  AlertTriangle,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EmptyGalleryState } from "./EmptyGalleryState";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { createPortal } from "react-dom";

type Video = {
  id: string;
  videoUrl?: string | null;
  prompt?: string | null;
  negativePrompt?: string | null;
  status: string;
  originalImage?: {
    id: string;
    thumbnailUrl?: string | null;
  } | null;
  isExample?: boolean | null;
};

type VideoWithIndex = Video & {
  index: number;
};

const VideoGalleryQuery = graphql(/* GraphQL */ `
  query VideoGallery($first: Int, $after: String) {
    videos(first: $first, after: $after) {
      edges {
        node {
          id
          prompt
          negativePrompt
          status
          videoUrl
          isExample
          originalImages {
            id
            thumbnailUrl
          }
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
`);

export function VideoGallery({
  showPrompt = true,
  shouldRefetch,
  setVideoUrl,
  createdVideoId,
  loadPartialGallery = false,
}: {
  showPrompt?: boolean;
  shouldRefetch?: boolean;
  setVideoUrl?: (videoUrl: string) => void;
  createdVideoId?: string | null;
  loadPartialGallery?: boolean;
}) {
  const { t } = useTranslation();
  const [after, setAfter] = useState<string | null | undefined>();

  const [{ data }, reExecuteQuery] = useQuery({
    query: VideoGalleryQuery,
    variables: { first: loadPartialGallery ? 5 : 20, after },
  });

  const [selectedVideo, setSelectedVideo] = useState<VideoWithIndex | null>(
    null
  );

  useEffect(() => {
    if (createdVideoId && setVideoUrl) {
      const video = data?.videos.edges.find(
        (video: { node: Video }) => video.node.id === createdVideoId
      );
      if (video?.node.videoUrl) {
        setVideoUrl(video.node.videoUrl);
      }
    }
  }, [createdVideoId, data?.videos.edges, setVideoUrl]);

  useEffect(() => {
    if (shouldRefetch) {
      reExecuteQuery({ requestPolicy: "network-only" });
    }
  }, [shouldRefetch, reExecuteQuery]);

  useEffect(() => {
    const hasPendingVideo = data?.videos.edges.some(
      (video: { node: Video }) => video.node.status === GenAiStatusEnum.Pending
    );

    let intervalId: NodeJS.Timeout | null = null;

    if (hasPendingVideo) {
      intervalId = setInterval(() => {
        reExecuteQuery({ requestPolicy: "network-only" });
      }, 10000); // Check every 10 seconds
    }

    // Clean up the interval on unmount
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [data?.videos?.edges, reExecuteQuery]);

  const handleVideoClick = (video: Video, index: number) => {
    // Only allow clicking if the video is not pending or failed
    if (
      video.status !== GenAiStatusEnum.Pending &&
      video.status !== GenAiStatusEnum.Failed
    ) {
      setSelectedVideo({ ...video, index });
    }
  };

  const closeModal = () => {
    setSelectedVideo(null);
  };

  const handleDownloadVideo = async (video: Video, e: React.MouseEvent) => {
    e.stopPropagation();
    // Don't allow download if video is pending or failed
    if (
      video.status === GenAiStatusEnum.Pending ||
      video.status === GenAiStatusEnum.Failed ||
      !video.videoUrl
    )
      return;

    try {
      const link = document.createElement("a");
      link.href = video.videoUrl;
      link.download = ""; // you can also set a default filename here
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading video:", error);
    }
  };

  if (data?.videos.edges.length === 0) {
    return <EmptyGalleryState tab="video" />;
  }

  return (
    <>
      <InfiniteScroll
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5"
        dataLength={data?.videos.edges.length ?? 0}
        next={() => setAfter(data?.videos.pageInfo.endCursor)}
        hasMore={
          loadPartialGallery
            ? false
            : data?.videos.pageInfo.hasNextPage ?? false
        }
        loader={
          <div className="col-span-full py-6 flex justify-center">
            <div className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin text-purple-500" />
              <span className="text-sm text-muted-foreground">
                {t("videoGallery.loadingMoreVideos")}
              </span>
            </div>
          </div>
        }
      >
        {data?.videos.edges.map((video: { node: Video }, index: number) => (
          <motion.div
            key={`${video.node.id}-${index}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className={`group aspect-square relative rounded-xl overflow-hidden ${
              video.node.status !== GenAiStatusEnum.Pending &&
              video.node.status !== GenAiStatusEnum.Failed
                ? "cursor-pointer"
                : "cursor-default"
            } transition-all duration-300 hover:shadow-xl hover:scale-[1.02] bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800`}
            onClick={() => handleVideoClick(video.node, index)}
          >
            {video.node.status === GenAiStatusEnum.Pending ? (
              <div className="w-full h-full flex items-center justify-center">
                <div className="flex flex-col items-center">
                  <div className="relative w-16 h-16">
                    <div className="absolute inset-0 rounded-full border-t-2 border-purple-500 animate-spin"></div>
                    <div className="absolute inset-2 rounded-full border-t-2 border-purple-300 animate-spin animation-delay-150"></div>
                    <div className="absolute inset-4 rounded-full border-t-2 border-purple-200 animate-spin animation-delay-300"></div>
                  </div>
                  <p className="mt-4 text-sm font-medium text-gray-600 dark:text-gray-300">
                    {t("videoGallery.generatingVideo")}
                  </p>
                </div>
              </div>
            ) : video.node.status === GenAiStatusEnum.Failed ? (
              <div className="w-full h-full flex items-center justify-center">
                <div className="flex flex-col items-center">
                  <div className="relative w-16 h-16 flex items-center justify-center">
                    <AlertTriangle className="w-12 h-12 text-red-500" />
                  </div>
                  <p className="mt-4 text-sm font-medium text-red-500 dark:text-red-400">
                    {t("videoGallery.generationFailed")}
                  </p>
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center max-w-[80%]">
                    {t("videoGallery.tryAgain")}
                  </p>
                </div>
              </div>
            ) : (
              <div className="relative w-full h-full overflow-hidden">
                {video.node.isExample && (
                  <div className="absolute top-3 left-3 z-10 bg-purple-600/90 backdrop-blur-sm px-3 py-1 rounded-md text-white text-sm font-medium flex items-center gap-1.5 shadow-lg">
                    <Sparkles className="w-4 h-4" />
                    <span>{t("videoGallery.example")}</span>
                  </div>
                )}
                <video
                  src={video.node.videoUrl || ""}
                  poster={video.node.originalImage?.thumbnailUrl ?? undefined}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Play button overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0.8 }}
                    whileHover={{ scale: 1, opacity: 1 }}
                    className="bg-black/30 rounded-full p-3.5 backdrop-blur-sm shadow-lg flex items-center justify-center group-hover:bg-black/50 transition-all duration-300"
                  >
                    <Play className="w-6 h-6 text-white fill-white" />
                  </motion.div>
                </div>
              </div>
            )}

            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Action buttons */}
            {video.node.status !== GenAiStatusEnum.Pending &&
              video.node.status !== GenAiStatusEnum.Failed && (
                <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-x-2 group-hover:translate-x-0 z-10">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => handleDownloadVideo(video.node, e)}
                    className="p-2 rounded-full bg-purple-500 text-white hover:bg-purple-600 transition-colors shadow-lg backdrop-blur-sm"
                    aria-label="Download video"
                    title="Download video"
                  >
                    <Download className="w-4 h-4" />
                  </motion.button>
                </div>
              )}

            {/* Prompt text - more subtle */}
            {showPrompt &&
              video.node.prompt &&
              video.node.status !== GenAiStatusEnum.Failed && (
                <>
                  {/* Always visible subtle indicator */}
                  <div className="absolute bottom-2 left-2 right-2 p-1.5 bg-black/10 backdrop-blur-sm rounded-md opacity-40 transition-opacity duration-300 group-hover:opacity-0 z-0">
                    <p className="text-xs text-white/90 line-clamp-1 truncate">
                      {video.node.prompt || `Generated video ${index + 1}`}
                    </p>
                  </div>

                  {/* Full prompt on hover */}
                  <div className="absolute bottom-2 left-2 right-2 p-2 bg-black/40 backdrop-blur-sm rounded-md opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0 z-0">
                    <p className="text-xs text-white line-clamp-2">
                      {video.node.prompt || `Generated video ${index + 1}`}
                    </p>
                  </div>
                </>
              )}
          </motion.div>
        ))}
      </InfiniteScroll>

      {/* View more button */}
      {loadPartialGallery && data?.videos.pageInfo.hasNextPage && (
        <Link href="/dashboard/gallery?tab=videos">
          <div className="col-span-full py-8 flex justify-center">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Button className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-medium px-8 py-3 rounded-full shadow-lg hover:shadow-purple-500/20 transition-all duration-300 flex items-center gap-2 h-auto">
                <span>{t("videoGallery.viewFullGallery")}</span>
                <ChevronRight className="w-5 h-5" />
              </Button>
            </motion.div>
          </div>
        </Link>
      )}

      {/* Video modal */}
      {selectedVideo &&
        createPortal(
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4 overflow-y-auto"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", damping: 25 }}
              className="relative max-w-6xl w-full rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-2xl border border-white/10 my-4 md:my-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex-1 bg-gradient-to-b from-gray-900/50 to-black max-h-[50vh] md:max-h-[85vh] relative">
                {selectedVideo.isExample && (
                  <div className="absolute top-3 left-3 z-10 bg-purple-600/90 backdrop-blur-sm px-3 py-1 rounded-md text-white text-sm font-medium flex items-center gap-1.5 shadow-lg">
                    <Sparkles className="w-4 h-4" />
                    <span>{t("videoGallery.example")}</span>
                  </div>
                )}
                <video
                  src={selectedVideo.videoUrl || ""}
                  controls
                  autoPlay
                  className="w-full h-auto max-h-[50vh] md:max-h-[85vh] object-contain"
                  poster={
                    selectedVideo.originalImage?.thumbnailUrl ?? undefined
                  }
                />
              </div>

              <div className="md:w-72 bg-gradient-to-r from-gray-900/90 to-gray-800/90 backdrop-blur-md p-4 md:p-6 flex flex-col">
                <div className="flex justify-end mb-2 md:mb-4">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={closeModal}
                    className="p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-all duration-300 backdrop-blur-sm hover:shadow-lg hover:shadow-purple-500/20"
                    aria-label="Close modal"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>

                <div className="flex flex-col gap-2 md:gap-4 mb-4 md:mb-8">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => handleDownloadVideo(selectedVideo, e)}
                    className="flex items-center justify-center gap-2 p-2 md:p-3 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-medium transition-all duration-300 shadow-lg hover:shadow-purple-500/20 text-sm md:text-base"
                    aria-label="Download video"
                    title="Download video"
                  >
                    <Download className="w-4 h-4 md:w-5 md:h-5" />
                    <span>{t("videoGallery.download")}</span>
                  </motion.button>
                </div>

                {selectedVideo.prompt && (
                  <div className="mt-auto">
                    <h3 className="text-white text-xs md:text-sm font-medium mb-2 md:mb-3 flex items-center gap-2">
                      <span className="h-1 w-5 bg-purple-500 rounded-full"></span>
                      Prompt
                    </h3>
                    <div className="bg-black/30 rounded-xl p-3 md:p-4 border border-white/5 hover:border-purple-500/30 transition-colors duration-300">
                      <p className="text-white/90 text-xs leading-relaxed">
                        {selectedVideo.prompt}
                      </p>
                    </div>
                  </div>
                )}

                {selectedVideo.negativePrompt && (
                  <div className="mt-3">
                    <h3 className="text-white text-xs md:text-sm font-medium mb-2 md:mb-3 flex items-center gap-2">
                      <span className="h-1 w-5 bg-purple-500 rounded-full"></span>
                      {t("videoGallery.negativePrompt")}
                    </h3>
                    <div className="bg-black/30 rounded-xl p-3 md:p-4 border border-white/5 hover:border-purple-500/30 transition-colors duration-300">
                      <p className="text-white/90 text-xs leading-relaxed">
                        {selectedVideo.negativePrompt}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>,
          document.body
        )}
    </>
  );
}
