"use client";

import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { GenAiStatusEnum } from "@/gql/graphql";
import { Skeleton } from "../ui/skeleton";
import { graphql } from "../../gql";
import { useQuery } from "urql";
import { Download } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

type Video = {
  id: string;
  videoUrl?: string | null;
  prompt?: string | null;
  negativePrompt?: string | null;
  status: string;
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
      }, 6000); // Check every 6 seconds
    }

    // Clean up the interval on unmount
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [data?.videos?.edges?.length, reExecuteQuery]);

  const handleVideoClick = (video: Video, index: number) => {
    // Only allow clicking if the video is not pending
    if (video.status !== GenAiStatusEnum.Pending) {
      setSelectedVideo({ ...video, index });
    }
  };

  const closeModal = () => {
    setSelectedVideo(null);
  };

  const handleDownloadVideo = async (video: Video, e: React.MouseEvent) => {
    e.stopPropagation();
    // Don't allow download if video is pending
    if (video.status === GenAiStatusEnum.Pending || !video.videoUrl) return;

    try {
      const response = await fetch(video.videoUrl);
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

  return (
    <>
      <InfiniteScroll
        className="grid grid-cols-1 md:grid-cols-5 gap-4"
        dataLength={data?.videos.edges.length ?? 0}
        next={() => setAfter(data?.videos.pageInfo.endCursor)}
        hasMore={
          loadPartialGallery
            ? false
            : data?.videos.pageInfo.hasNextPage ?? false
        }
        loader={<Skeleton className="w-full h-full" />}
      >
        {data?.videos.edges.map((video: { node: Video }, index: number) => (
          <div
            key={`${video.node.id}-${index}`}
            className={`aspect-square relative rounded-lg overflow-hidden ${
              video.node.status !== GenAiStatusEnum.Pending
                ? "cursor-pointer"
                : "cursor-default"
            } transition-all duration-300 hover:shadow-md`}
            onClick={() => handleVideoClick(video.node, index)}
          >
            {video.node.status === GenAiStatusEnum.Pending ? (
              <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                <div className="flex flex-col items-center">
                  <svg
                    className="animate-spin h-10 w-10 text-purple-500 mb-2"
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
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Generating video...
                  </p>
                </div>
              </div>
            ) : (
              <div className="relative w-full h-full">
                <video
                  src={video.node.videoUrl || ""}
                  poster={
                    video.node.videoUrl ? undefined : "/video-placeholder.jpg"
                  }
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="bg-black/50 rounded-full p-3 backdrop-blur-sm shadow-lg flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="white"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="opacity-90"
                      style={{
                        marginLeft: "2px",
                      }} /* Slight adjustment to visually center the triangle */
                    >
                      <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                  </div>
                </div>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
            {video.node.status !== GenAiStatusEnum.Pending && (
              <button
                onClick={(e) => handleDownloadVideo(video.node, e)}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-purple-500 text-white hover:bg-purple-600 transition-colors transform scale-110 shadow-md opacity-70 hover:opacity-100"
                aria-label="Download video"
                title="Download video"
              >
                <Download size={16} />
                <span className="sr-only">Download video</span>
              </button>
            )}
            {showPrompt && (
              <div className="absolute bottom-0 left-0 right-0 p-3 text-white text-base font-semibold">
                {video.node.prompt || `Generated video ${index + 1}`}
              </div>
            )}
          </div>
        ))}
      </InfiniteScroll>

      {loadPartialGallery && data?.videos.pageInfo.hasNextPage && (
        <Link href="/dashboard/gallery?tab=videos">
          <div className="col-span-full py-6 flex justify-center">
            <Button className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-medium px-6 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2">
              <span>View more in gallery</span>
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
                <path d="M5 12h14"></path>
                <path d="m12 5 7 7-7 7"></path>
              </svg>
            </Button>
          </div>
        </Link>
      )}

      {selectedVideo && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <video
              src={selectedVideo.videoUrl || ""}
              controls
              autoPlay
              className="w-full h-auto max-h-[90vh] object-contain"
            />
            <div className="absolute top-4 right-4 flex flex-col gap-2">
              <button
                onClick={closeModal}
                className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                aria-label="Close modal"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
              <button
                onClick={(e) => handleDownloadVideo(selectedVideo, e)}
                className="p-2 rounded-full bg-purple-500 text-white hover:bg-purple-600 transition-colors shadow-md opacity-90 hover:opacity-100"
                aria-label="Download video"
                title="Download video"
              >
                <Download size={18} />
                <span className="sr-only">Download video</span>
              </button>
            </div>
            <div className="p-2 bg-black/50 text-white">
              {selectedVideo.prompt ||
                `Generated video ${selectedVideo.index + 1}`}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
