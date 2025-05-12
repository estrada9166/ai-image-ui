"use client";

import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { GenAiStatusEnum } from "@/gql/graphql";
import { Skeleton } from "../ui/skeleton";
import { graphql } from "../../gql";
import { useQuery } from "urql";
import { Download } from "lucide-react";

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
  shouldRefetch,
  setVideoUrl,
  createdVideoId,
}: {
  shouldRefetch?: boolean;
  setVideoUrl?: (videoUrl: string) => void;
  createdVideoId?: string | null;
}) {
  const [after, setAfter] = useState<string | null | undefined>();

  const [{ data }, reExecuteQuery] = useQuery({
    query: VideoGalleryQuery,
    variables: { first: 30, after },
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
      // Immediately execute once
      reExecuteQuery({ requestPolicy: "network-only" });

      // Set up interval to check every 5 seconds
      intervalId = setInterval(() => {
        reExecuteQuery({ requestPolicy: "network-only" });
      }, 4000);
    }

    // Clean up the interval on unmount
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [data?.videos.edges, reExecuteQuery]);

  const handleVideoClick = (video: Video, index: number) => {
    setSelectedVideo({ ...video, index });
  };

  const closeModal = () => {
    setSelectedVideo(null);
  };

  const handleDownloadVideo = async (
    videoUrl: string | null | undefined,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
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

  return (
    <>
      <InfiniteScroll
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
        dataLength={data?.videos.edges.length ?? 0}
        next={() => setAfter(data?.videos.pageInfo.endCursor)}
        hasMore={data?.videos.pageInfo.hasNextPage ?? false}
        loader={<Skeleton className="w-full h-full" />}
      >
        {data?.videos.edges.map((video: { node: Video }, index: number) => (
          <div
            key={`${video.node.id}-${index}`}
            className="aspect-square relative rounded-lg overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-md"
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
              <video
                src={video.node.videoUrl || ""}
                poster={
                  video.node.videoUrl ? undefined : "/video-placeholder.jpg"
                }
                className="w-full h-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
            <button
              onClick={(e) => handleDownloadVideo(video.node.videoUrl, e)}
              className="absolute top-2 right-2 p-1.5 rounded-full bg-purple-500 text-white hover:bg-purple-600 transition-colors transform scale-110 shadow-md opacity-70 hover:opacity-100"
              aria-label="Download video"
              title="Download video"
            >
              <Download size={16} />
              <span className="sr-only">Download video</span>
            </button>
            <div className="absolute bottom-0 left-0 right-0 p-3 text-white text-base font-semibold">
              {video.node.prompt || `Generated video ${index + 1}`}
            </div>
          </div>
        ))}
      </InfiniteScroll>

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
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
              aria-label="Close modal"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
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
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-black/50 text-white">
              {selectedVideo.prompt ||
                `Generated video ${selectedVideo.index + 1}`}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
