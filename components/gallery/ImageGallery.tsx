"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { GenAiStatusEnum, ImageTypeOptionsEnum } from "@/gql/graphql";
import { Skeleton } from "../ui/skeleton";
import { graphql } from "../../gql";
import { useQuery } from "urql";

type Image = {
  id: string;
  imageUrl?: string | null;
  prompt?: string | null;
  status: string;
};

type ImageWithIndex = Image & {
  index: number;
};

const ImageGalleryQuery = graphql(/* GraphQL */ `
  query ImageGallery($first: Int, $after: String, $type: ImageTypeOptionsEnum) {
    images(first: $first, after: $after, type: $type) {
      edges {
        node {
          id
          prompt
          status
          imageUrl
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
`);

export function ImageGallery({
  type,
  shouldRefetch,
}: {
  type?: ImageTypeOptionsEnum;
  shouldRefetch?: boolean;
}) {
  const [after, setAfter] = useState<string | null | undefined>();

  const [{ data }, reExecuteQuery] = useQuery({
    query: ImageGalleryQuery,
    variables: { first: 30, after, type },
  });

  const [selectedImage, setSelectedImage] = useState<ImageWithIndex | null>(
    null
  );

  useEffect(() => {
    if (shouldRefetch) {
      reExecuteQuery({ requestPolicy: "network-only" });
    }
  }, [shouldRefetch, reExecuteQuery]);

  useEffect(() => {
    const hasPendingImage = data?.images.edges.some(
      (image) => image.node.status === GenAiStatusEnum.Pending
    );

    let intervalId: NodeJS.Timeout | null = null;

    if (hasPendingImage) {
      // Immediately execute once
      reExecuteQuery({ requestPolicy: "network-only" });

      // Set up interval to check every 5 seconds
      intervalId = setInterval(() => {
        reExecuteQuery({ requestPolicy: "network-only" });
      }, 5000);
    }

    // Clean up the interval on unmount
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [data?.images.edges, reExecuteQuery]);

  const handleImageClick = (image: Image, index: number) => {
    setSelectedImage({ ...image, index });
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <>
      <InfiniteScroll
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
        dataLength={data?.images.edges.length ?? 0}
        next={() => setAfter(data?.images.pageInfo.endCursor)}
        hasMore={data?.images.pageInfo.hasNextPage ?? false}
        loader={<Skeleton className="w-full h-full" />}
      >
        {data?.images.edges.map((image, index) => (
          <div
            key={`${image.node.id}-${index}`}
            className="aspect-square relative rounded-lg overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-md"
            onClick={() => handleImageClick(image.node, index)}
          >
            {image.node.status === GenAiStatusEnum.Pending ? (
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
                    Generating image...
                  </p>
                </div>
              </div>
            ) : (
              <img
                src={image.node.imageUrl || ""}
                alt={`Generated image ${index + 1}`}
                className="w-full h-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
            <Link href={`/dashboard/video-creation?image=${image.node.id}`}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                }}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-purple-500 text-white hover:bg-purple-600 transition-colors transform scale-110 shadow-md opacity-70 hover:opacity-100"
                aria-label="Edit video"
                title="Animate this image"
              >
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
                  <polygon points="23 7 16 12 23 17 23 7"></polygon>
                  <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
                </svg>
                <span className="sr-only">Animate image</span>
              </button>
            </Link>
            <div className="absolute bottom-0 left-0 right-0 p-3 text-white text-base font-semibold">
              {image.node.prompt || `Generated image ${index + 1}`}
            </div>
          </div>
        ))}
      </InfiniteScroll>

      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage.imageUrl || ""}
              alt={
                selectedImage.prompt ||
                `Generated image ${selectedImage.index + 1}`
              }
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
              {selectedImage.prompt ||
                `Generated image ${selectedImage.index + 1}`}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
