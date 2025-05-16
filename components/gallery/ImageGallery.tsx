"use client";

import type React from "react";

import Link from "next/link";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { GenAiStatusEnum, ImageTypeOptionsEnum } from "@/gql/graphql";
import { graphql } from "../../gql";
import { useQuery } from "urql";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { EmptyGalleryState } from "./EmptyGalleryState";
import {
  Download,
  Edit,
  RotateCcw,
  Video,
  X,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";

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
  tab?: "images" | "edited-images" | "restored-images";
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
    if (shouldRefetch) {
      reExecuteQuery({ requestPolicy: "network-only" });
    }
  }, [shouldRefetch, reExecuteQuery]);

  const hasPendingImage = data?.images.edges.some(
    (image) => image.node.status === GenAiStatusEnum.Pending
  );

  useEffect(() => {
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
  }, [hasPendingImage, reExecuteQuery]);

  const handleImageClick = (image: Image, index: number) => {
    if (image.status === GenAiStatusEnum.Pending) return;

    if (redirectToVideoCreationOnClick) {
      router.push(`/dashboard/create/video?image=${image.id}`);
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
      console.log("Downloading image:", imageUrl);
      const response = await fetch(imageUrl, {
        method: "GET",
        mode: "cors",
      });
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

  if (data?.images.edges.length === 0) {
    return <EmptyGalleryState tab={tab} />;
  }

  return (
    <>
      <InfiniteScroll
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5"
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
          <div className="col-span-full py-6 flex justify-center">
            <div className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin text-purple-500" />
              <span className="text-sm text-muted-foreground">
                Loading more images...
              </span>
            </div>
          </div>
        }
      >
        {data?.images.edges.map((image, index) => (
          <motion.div
            key={`${image.node.id}-${index}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className={`group aspect-square relative rounded-xl overflow-hidden ${
              image.node.status !== GenAiStatusEnum.Pending
                ? "cursor-pointer"
                : "cursor-default"
            } transition-all duration-300 hover:shadow-xl hover:scale-[1.02] bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800`}
            onClick={() => handleImageClick(image.node, index)}
          >
            {image.node.status === GenAiStatusEnum.Pending ? (
              <div className="w-full h-full flex items-center justify-center">
                <div className="flex flex-col items-center">
                  <div className="relative w-16 h-16">
                    <div className="absolute inset-0 rounded-full border-t-2 border-purple-500 animate-spin"></div>
                    <div className="absolute inset-2 rounded-full border-t-2 border-purple-300 animate-spin animation-delay-150"></div>
                    <div className="absolute inset-4 rounded-full border-t-2 border-purple-200 animate-spin animation-delay-300"></div>
                  </div>
                  <p className="mt-4 text-sm font-medium text-gray-600 dark:text-gray-300">
                    Generating image...
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors duration-300"></div>
                <img
                  src={image.node.imageUrl || ""}
                  alt={`Generated image ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </>
            )}

            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Action buttons */}
            {image.node.status !== GenAiStatusEnum.Pending &&
              !redirectToVideoCreationOnClick && (
                <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-x-2 group-hover:translate-x-0">
                  <Link href={`/dashboard/edit/image?image=${image.node.id}`}>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => e.stopPropagation()}
                      className="p-2 rounded-full bg-green-500 text-white hover:bg-green-600 transition-colors shadow-lg backdrop-blur-sm"
                      aria-label="Edit image"
                      title="Edit this image"
                    >
                      <Edit className="w-4 h-4" />
                    </motion.button>
                  </Link>

                  {type?.includes(ImageTypeOptionsEnum.UserUploaded) && (
                    <Link
                      href={`/dashboard/edit/restore?image=${image.node.id}`}
                    >
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => e.stopPropagation()}
                        className="p-2 rounded-full bg-amber-500 text-white hover:bg-amber-600 transition-colors shadow-lg backdrop-blur-sm"
                        aria-label="Restore image"
                        title="Restore this image"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </motion.button>
                    </Link>
                  )}

                  <Link href={`/dashboard/create/video?image=${image.node.id}`}>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => e.stopPropagation()}
                      className="p-2 rounded-full bg-purple-500 text-white hover:bg-purple-600 transition-colors shadow-lg backdrop-blur-sm"
                      aria-label="Animate image"
                      title="Animate this image"
                    >
                      <Video className="w-4 h-4" />
                    </motion.button>
                  </Link>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) =>
                      handleDownloadImage(
                        image.node.imageUrl,
                        e,
                        image.node.status
                      )
                    }
                    className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors shadow-lg backdrop-blur-sm"
                    aria-label="Download image"
                    title="Download image"
                  >
                    <Download className="w-4 h-4" />
                  </motion.button>
                </div>
              )}

            {/* Prompt text - more subtle */}
            {showPrompt && image.node.prompt && (
              <>
                {/* Always visible subtle indicator */}
                <div className="absolute bottom-2 left-2 right-2 p-1.5 bg-black/10 backdrop-blur-sm rounded-md opacity-40 transition-opacity duration-300 group-hover:opacity-0">
                  <p className="text-xs text-white/90 line-clamp-1 truncate">
                    {image.node.prompt}
                  </p>
                </div>

                {/* Full prompt on hover */}
                <div className="absolute bottom-2 left-2 right-2 p-2 bg-black/40 backdrop-blur-sm rounded-md opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0">
                  <p className="text-xs text-white line-clamp-2">
                    {image.node.prompt}
                  </p>
                </div>
              </>
            )}
          </motion.div>
        ))}
      </InfiniteScroll>

      {/* View more button */}
      {loadPartialGallery && data?.images.pageInfo.hasNextPage && (
        <Link href={`/dashboard/gallery?tab=${tab}`}>
          <div className="col-span-full py-8 flex justify-center">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Button className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-medium px-8 py-6 rounded-full shadow-lg hover:shadow-purple-500/20 transition-all duration-300 flex items-center gap-2 h-auto">
                <span>View full gallery</span>
                <ChevronRight className="w-5 h-5" />
              </Button>
            </motion.div>
          </div>
        </Link>
      )}

      {/* Image modal */}
      {selectedImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", damping: 25 }}
            className="relative max-w-5xl w-full rounded-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage.imageUrl || ""}
              alt={
                selectedImage.prompt ||
                `Generated image ${selectedImage.index + 1}`
              }
              className="w-full h-auto max-h-[85vh] object-contain bg-black/50"
            />

            <div className="absolute top-4 right-4 flex flex-col gap-3">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={closeModal}
                className="p-2.5 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors backdrop-blur-sm"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </motion.button>

              <Link href={`/dashboard/edit/image?image=${selectedImage.id}`}>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => e.stopPropagation()}
                  className="p-2.5 rounded-full bg-green-500/90 text-white hover:bg-green-600 transition-colors backdrop-blur-sm"
                  aria-label="Edit image"
                  title="Edit this image"
                >
                  <Edit className="w-5 h-5" />
                </motion.button>
              </Link>

              <Link href={`/dashboard/create/video?image=${selectedImage.id}`}>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => e.stopPropagation()}
                  className="p-2.5 rounded-full bg-purple-500/90 text-white hover:bg-purple-600 transition-colors backdrop-blur-sm"
                  aria-label="Animate image"
                  title="Animate this image"
                >
                  <Video className="w-5 h-5" />
                </motion.button>
              </Link>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownloadImage(
                    selectedImage.imageUrl,
                    e,
                    selectedImage.status
                  );
                }}
                className="p-2.5 rounded-full bg-blue-500/90 text-white hover:bg-blue-600 transition-colors backdrop-blur-sm"
                aria-label="Download image"
                title="Download image"
              >
                <Download className="w-5 h-5" />
              </motion.button>
            </div>

            {selectedImage.prompt && (
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                <p className="text-white/90 text-xs md:text-sm font-medium max-w-[90%] mx-auto">
                  {selectedImage.prompt}
                </p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </>
  );
}
