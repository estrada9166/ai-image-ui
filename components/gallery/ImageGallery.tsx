"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { GenAiStatusEnum, ImageTypeOptionsEnum } from "@/gql/graphql";
import { Skeleton } from "../ui/skeleton";
import { graphql } from "../../gql";
import { useQuery } from "urql";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

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
  query ImageGallery(
    $first: Int
    $after: String
    $type: [ImageTypeOptionsEnum!]!
  ) {
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
  showPrompt = true,
  redirectToVideoCreationOnClick = false,
  loadPartialGallery = false,
  tab = "images",
}: {
  type?: ImageTypeOptionsEnum[];
  shouldRefetch?: boolean;
  showPrompt?: boolean;
  redirectToVideoCreationOnClick?: boolean;
  loadPartialGallery?: boolean;
  tab?: "images" | "edited-images";
}) {
  const router = useRouter();
  const [after, setAfter] = useState<string | null | undefined>();

  const [{ data }, reExecuteQuery] = useQuery({
    query: ImageGalleryQuery,
    variables: { first: loadPartialGallery ? 5 : 20, after, type: type || [] },
  });

  const [selectedImage, setSelectedImage] = useState<ImageWithIndex | null>(
    null
  );

  useEffect(() => {
    return;
    if (shouldRefetch) {
      reExecuteQuery({ requestPolicy: "network-only" });
    }
  }, [shouldRefetch, reExecuteQuery]);

  useEffect(() => {
    return;
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
    if (image.status === GenAiStatusEnum.Pending) return;

    if (redirectToVideoCreationOnClick) {
      router.push(`/dashboard/video-creation?image=${image.id}`);
    } else {
      setSelectedImage({ ...image, index });
    }
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const handleDownloadImage = async (
    imageUrl: string | null | undefined,
    e: React.MouseEvent,
    status: string
  ) => {
    e.stopPropagation();
    if (!imageUrl || status === GenAiStatusEnum.Pending) return;

    try {
      const response = await fetch(imageUrl);
      if (!response.ok) throw new Error("Network response was not ok");

      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = "generated-image.png";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Error downloading image:", error);
    }
  };

  return (
    <>
      <InfiniteScroll
        className="grid grid-cols-1 md:grid-cols-5 gap-4"
        dataLength={data?.images.edges.length ?? 0}
        next={() => {
          if (data?.images.pageInfo.endCursor) {
            setAfter(data.images.pageInfo.endCursor);
          }
        }}
        hasMore={
          loadPartialGallery
            ? false
            : data?.images.pageInfo.hasNextPage ?? false
        }
        loader={
          <div className="col-span-full py-4 flex justify-center">
            <Skeleton className="w-32 h-32" />
          </div>
        }
      >
        {data?.images.edges.map((image, index) => (
          <div
            key={`${image.node.id}-${index}`}
            className={`aspect-square relative rounded-lg overflow-hidden ${
              image.node.status !== GenAiStatusEnum.Pending
                ? "cursor-pointer"
                : "cursor-default"
            } transition-all duration-300 hover:shadow-md`}
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
            <div className="absolute top-2 right-2 flex flex-col gap-2">
              {image.node.status !== GenAiStatusEnum.Pending &&
                !redirectToVideoCreationOnClick && (
                  <>
                    <Link href={`/dashboard/image-edit?image=${image.node.id}`}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        className="p-1.5 rounded-full bg-green-500 text-white hover:bg-green-600 transition-colors transform scale-110 shadow-md opacity-70 hover:opacity-100"
                        aria-label="Edit image"
                        title="Edit this image"
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
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                        <span className="sr-only">Edit image</span>
                      </button>
                    </Link>
                    <Link
                      href={`/dashboard/video-creation?image=${image.node.id}`}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        className="p-1.5 rounded-full bg-purple-500 text-white hover:bg-purple-600 transition-colors transform scale-110 shadow-md opacity-70 hover:opacity-100"
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
                          <rect
                            x="1"
                            y="5"
                            width="15"
                            height="14"
                            rx="2"
                            ry="2"
                          ></rect>
                        </svg>
                        <span className="sr-only">Animate image</span>
                      </button>
                    </Link>
                    <button
                      onClick={(e) => {
                        handleDownloadImage(
                          image.node.imageUrl,
                          e,
                          image.node.status
                        );
                      }}
                      className="p-1.5 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors transform scale-110 shadow-md opacity-70 hover:opacity-100"
                      aria-label="Download image"
                      title="Download image"
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
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                      </svg>
                      <span className="sr-only">Download image</span>
                    </button>
                  </>
                )}
            </div>
            {showPrompt && (
              <div className="absolute bottom-0 left-0 right-0 p-3 text-white text-base font-semibold">
                {image.node.prompt}
              </div>
            )}
          </div>
        ))}
      </InfiniteScroll>

      {loadPartialGallery && data?.images.pageInfo.hasNextPage && (
        <Link href={`/dashboard/gallery?tab=${tab}`}>
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

            <div className="absolute top-4 right-4 flex flex-col gap-3">
              <button
                onClick={closeModal}
                className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
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
              <Link href={`/dashboard/image-edit?image=${selectedImage.id}`}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="p-2 rounded-full bg-green-500 text-white hover:bg-green-600 transition-colors shadow-md opacity-70 hover:opacity-100"
                  aria-label="Edit image"
                  title="Edit this image"
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
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                  <span className="sr-only">Edit image</span>
                </button>
              </Link>
              <Link
                href={`/dashboard/video-creation?image=${selectedImage.id}`}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="p-2 rounded-full bg-purple-500 text-white hover:bg-purple-600 transition-colors shadow-md opacity-70 hover:opacity-100"
                  aria-label="Edit video"
                  title="Animate this image"
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
                    <polygon points="23 7 16 12 23 17 23 7"></polygon>
                    <rect
                      x="1"
                      y="5"
                      width="15"
                      height="14"
                      rx="2"
                      ry="2"
                    ></rect>
                  </svg>
                  <span className="sr-only">Animate image</span>
                </button>
              </Link>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownloadImage(
                    selectedImage.imageUrl,
                    e,
                    selectedImage.status
                  );
                }}
                className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors shadow-md opacity-70 hover:opacity-100"
                aria-label="Download image"
                title="Download image"
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
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                <span className="sr-only">Download image</span>
              </button>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-black/50 text-white">
              {selectedImage.prompt}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
