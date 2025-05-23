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
  AlertTriangle,
} from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { createPortal } from "react-dom";
import ReactCompareImage from "react-compare-image";

type Image = {
  id: string;
  imageUrl?: string | null;
  prompt?: string | null;
  status: GenAiStatusEnum;
  thumbnailUrl?: string | null;
  originalImage?: {
    id: string;
    imageUrl?: string | null;
  } | null;
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
          thumbnailUrl
          originalImage {
            id
            imageUrl
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

export function ImageGallery({
  type,
  shouldRefetch,
  showPrompt = true,
  redirectToVideoCreationOnClick = false,
  loadPartialGallery = false,
  tab = "images",
  createdImageId,
  setCreatedImageUrl,
}: {
  type?: ImageTypeOptionsEnum[];
  shouldRefetch?: boolean;
  showPrompt?: boolean;
  redirectToVideoCreationOnClick?: boolean;
  loadPartialGallery?: boolean;
  tab?: "images" | "edited-images" | "restored-images";
  createdImageId?: string | null;
  setCreatedImageUrl?: (imageUrl: string) => void;
}) {
  const { t } = useTranslation();
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
    if (createdImageId && setCreatedImageUrl) {
      const image = data?.images.edges.find(
        (image: { node: Image }) => image.node.id === createdImageId
      );

      if (image?.node.imageUrl) {
        setCreatedImageUrl(image.node.imageUrl);
      }
    }
  }, [createdImageId, data?.images.edges, setCreatedImageUrl]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    if (hasPendingImage) {
      // Immediately execute once
      reExecuteQuery({ requestPolicy: "network-only" });

      // Set up interval to check every 5 seconds
      intervalId = setInterval(() => {
        reExecuteQuery({ requestPolicy: "network-only" });
      }, 10000);
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
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    if (!imageUrl) return;

    try {
      const link = document.createElement("a");
      link.href = imageUrl;
      link.download = ""; // you can also set a default filename here
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
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
                {t("imageGallery.loadingMoreImages")}
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
                    {t("imageGallery.generatingImage")}
                  </p>
                </div>
              </div>
            ) : image.node.status === GenAiStatusEnum.Failed ? (
              <div className="w-full h-full flex items-center justify-center">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 flex items-center justify-center">
                    <AlertTriangle className="w-12 h-12 text-red-500" />
                  </div>
                  <p className="mt-4 text-sm font-medium text-gray-600 dark:text-gray-300">
                    {t("imageGallery.errorGeneratingImage")}
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors duration-300"></div>
                <img
                  src={image.node.thumbnailUrl || image.node.imageUrl || ""}
                  alt={`Generated image ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </>
            )}

            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Action buttons */}
            {image.node.status !== GenAiStatusEnum.Pending &&
              image.node.status !== GenAiStatusEnum.Failed &&
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
                    onClick={(e) => handleDownloadImage(image.node.imageUrl, e)}
                    className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors shadow-lg backdrop-blur-sm"
                    aria-label="Download image"
                    title="Download image"
                  >
                    <Download className="w-4 h-4" />
                  </motion.button>
                </div>
              )}

            {/* Prompt text */}
            {showPrompt &&
              image.node.prompt &&
              image.node.status !== GenAiStatusEnum.Failed && (
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <p className="text-white/90 text-xs md:text-sm leading-relaxed">
                    {image.node.prompt}
                  </p>
                </div>
              )}
          </motion.div>
        ))}
      </InfiniteScroll>

      {/* View more button */}
      {loadPartialGallery && data?.images.pageInfo.hasNextPage && (
        <Link href={`/dashboard/gallery?tab=${tab}`}>
          <div className="col-span-full py-8 flex justify-center">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Button className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-medium px-8 py-3 rounded-full shadow-lg hover:shadow-purple-500/20 transition-all duration-300 flex items-center gap-2 h-auto">
                <span>{t("imageGallery.viewFullGallery")}</span>
                <ChevronRight className="w-5 h-5" />
              </Button>
            </motion.div>
          </div>
        </Link>
      )}

      {/* Image modal */}
      {selectedImage &&
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
              <div className="flex-1 bg-gradient-to-b from-gray-900/50 to-black max-h-[50vh] md:max-h-[85vh]">
                {selectedImage.status === GenAiStatusEnum.Failed ? (
                  <div className="w-full h-full flex items-center justify-center p-8">
                    <div className="flex flex-col items-center text-center">
                      <AlertTriangle className="w-12 h-12 md:w-16 md:h-16 text-red-500 mb-4" />
                      <h3 className="text-lg md:text-xl font-bold text-white mb-2">
                        {t("imageGallery.errorGeneratingImage")}
                      </h3>
                      <p className="text-gray-400 max-w-md text-sm md:text-base">
                        {t("imageGallery.errorGeneratingImageDescription")}
                      </p>
                    </div>
                  </div>
                ) : tab === "restored-images" &&
                  selectedImage.originalImage?.imageUrl &&
                  selectedImage.imageUrl ? (
                  <div className="h-full max-h-[50vh] md:max-h-[85vh] overflow-hidden">
                    <ReactCompareImage
                      leftImage={selectedImage.originalImage.imageUrl}
                      rightImage={selectedImage.imageUrl}
                      sliderLineWidth={2}
                      sliderLineColor="#ffffff"
                      leftImageAlt="Original image"
                      rightImageAlt="Restored image"
                      leftImageLabel="Original"
                      rightImageLabel="Restored"
                      sliderPositionPercentage={0.5}
                      leftImageCss={{
                        objectFit: "contain",
                        height: "100%",
                        maxHeight: "50vh",
                        width: "100%",
                      }}
                      rightImageCss={{
                        objectFit: "contain",
                        height: "100%",
                        maxHeight: "50vh",
                        width: "100%",
                      }}
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full max-h-[50vh] md:max-h-[85vh]">
                    <img
                      src={selectedImage.imageUrl || ""}
                      alt={
                        selectedImage.prompt ||
                        `Generated image ${selectedImage.index + 1}`
                      }
                      className="w-full h-auto max-h-[50vh] md:max-h-[85vh] object-contain"
                    />
                  </div>
                )}
              </div>

              <div className="md:w-72 bg-gradient-to-r from-gray-900/90 to-gray-800/90 backdrop-blur-md p-4 md:p-6 flex flex-col">
                <div className="flex justify-end mb-2 md:mb-4">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={closeModal}
                    className="p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors backdrop-blur-sm"
                    aria-label="Close modal"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>

                {selectedImage.status !== GenAiStatusEnum.Failed && (
                  <div className="flex flex-col gap-2 md:gap-3 mt-1 md:mt-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) =>
                        handleDownloadImage(selectedImage.imageUrl, e)
                      }
                      className="flex items-center justify-center gap-2 p-2 md:p-3 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-medium transition-all duration-300 shadow-lg hover:shadow-purple-500/20 text-sm md:text-base"
                      aria-label="Download image"
                      title="Download image"
                    >
                      <Download className="w-4 h-4 md:w-5 md:h-5" />
                      <span>{t("imageGallery.download")}</span>
                    </motion.button>

                    <Link
                      href={`/dashboard/edit/image?image=${selectedImage.id}`}
                      className="w-full"
                    >
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center justify-center gap-2 p-2 md:p-3 w-full rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-medium transition-all duration-300 shadow-lg hover:shadow-green-500/20 text-sm md:text-base"
                        aria-label="Edit image"
                        title="Edit this image"
                      >
                        <Edit className="w-4 h-4 md:w-5 md:h-5" />
                        <span>{t("imageGallery.edit")}</span>
                      </motion.button>
                    </Link>

                    <Link
                      href={`/dashboard/create/video?image=${selectedImage.id}`}
                      className="w-full"
                    >
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center justify-center gap-2 p-2 md:p-3 w-full rounded-xl bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white font-medium transition-all duration-300 shadow-lg hover:shadow-purple-500/20 text-sm md:text-base"
                        aria-label="Animate image"
                        title="Animate this image"
                      >
                        <Video className="w-4 h-4 md:w-5 md:h-5" />
                        <span>{t("imageGallery.animate")}</span>
                      </motion.button>
                    </Link>
                  </div>
                )}

                {selectedImage.prompt &&
                  selectedImage.status !== GenAiStatusEnum.Failed && (
                    <div className="mt-3 md:mt-auto">
                      <h3 className="text-white text-xs md:text-sm font-medium mb-2 md:mb-3 flex items-center gap-2">
                        <span className="h-1 w-4 md:w-5 bg-purple-500 rounded-full"></span>
                        Prompt
                      </h3>
                      <div className="bg-black/30 rounded-xl p-3 md:p-4 border border-white/5 hover:border-purple-500/30 transition-colors duration-300">
                        <p className="text-white/90 text-xs leading-relaxed max-h-24 md:max-h-none overflow-y-auto">
                          {selectedImage.prompt}
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
