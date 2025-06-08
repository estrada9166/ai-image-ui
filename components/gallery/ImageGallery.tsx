"use client";

import type React from "react";

import Link from "next/link";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import {
  GenAiStatusEnum,
  ImageTypeOptionsEnum,
  AiModelOptionsEnum,
  AspectRatioOptionsEnum,
  CameraOptionsEnum,
} from "@/gql/graphql";
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
  ChevronRight,
  Loader2,
  AlertTriangle,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { SelectedImageModal } from "../common/SelectedImageModal";

type Image = {
  id: string;
  imageUrl?: string | null;
  prompt?: string | null;
  status: GenAiStatusEnum;
  thumbnailUrl?: string | null;
  model?: AiModelOptionsEnum | null;
  camera?: CameraOptionsEnum | null;
  aspectRatio: AspectRatioOptionsEnum;
  originalImages?:
    | {
        id: string;
        imageUrl?: string | null;
      }[]
    | null;
  isExample?: boolean | null;
};

export type ImageWithIndex = Image & {
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
          camera
          aspectRatio
          prompt
          status
          imageUrl
          thumbnailUrl
          model
          isExample
          originalImages {
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
  multiSelect = false,
  selectedImages = [],
  onImagesSelect,
  maxImages = 4,
}: {
  type?: ImageTypeOptionsEnum[];
  shouldRefetch?: boolean;
  showPrompt?: boolean;
  redirectToVideoCreationOnClick?: boolean;
  loadPartialGallery?: boolean;
  tab?:
    | "images"
    | "edited-images"
    | "restored-images"
    | "user-uploaded"
    | "virtual-try-on";
  createdImageId?: string | null;
  setCreatedImageUrl?: (imageUrl: string) => void;
  multiSelect?: boolean;
  selectedImages?: ImageWithIndex[];
  onImagesSelect?: (images: ImageWithIndex[]) => void;
  maxImages?: number;
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

    if (multiSelect) {
      if (isSelectionDisabled(image.id)) {
        // Show feedback that selection is disabled (could add toast here)
        return;
      }
      handleImageSelection(image, index);
    } else if (redirectToVideoCreationOnClick) {
      router.push(`/dashboard/create/video?image=${image.id}`);
    } else {
      setSelectedImage({ ...image, index });
    }
  };

  const handleImageSelection = (image: Image, index: number) => {
    if (!onImagesSelect) return;

    const imageWithIndex = { ...image, index };
    const isSelected = selectedImages?.some(
      (selected) => selected.id === image.id
    );

    if (isSelected) {
      // Always allow deselection
      const newSelection =
        selectedImages?.filter((selected) => selected.id !== image.id) || [];
      onImagesSelect(newSelection);
    } else {
      // Check if we've reached the maximum limit
      if ((selectedImages?.length || 0) >= maxImages) {
        return; // Don't allow selection if limit is reached
      }
      onImagesSelect([...(selectedImages || []), imageWithIndex]);
    }
  };

  const isImageSelected = (imageId: string) => {
    return selectedImages?.some((selected) => selected.id === imageId) || false;
  };

  const isSelectionDisabled = (imageId: string) => {
    return (
      multiSelect &&
      !isImageSelected(imageId) &&
      (selectedImages?.length || 0) >= maxImages
    );
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
        {data?.images.edges.map((image, index) => {
          if (
            onImagesSelect &&
            (image.node.status === GenAiStatusEnum.Failed ||
              image.node.status === GenAiStatusEnum.Pending)
          ) {
            return null;
          }

          return (
            <motion.div
              key={`${image.node.id}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className={`group aspect-square relative rounded-xl overflow-hidden ${
                image.node.status !== GenAiStatusEnum.Pending
                  ? "cursor-pointer"
                  : "cursor-default"
              } transition-all duration-300 hover:shadow-xl hover:scale-[1.02] bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 ${
                multiSelect && isImageSelected(image.node.id)
                  ? "ring-4 ring-blue-500 ring-opacity-75"
                  : ""
              } ${
                isSelectionDisabled(image.node.id)
                  ? "opacity-50 cursor-not-allowed hover:scale-100"
                  : ""
              }`}
              onClick={() => handleImageClick(image.node, index)}
            >
              {/* Multi-select checkbox */}
              {multiSelect &&
                image.node.status === GenAiStatusEnum.Generated && (
                  <div className="absolute top-3 left-3 z-20">
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        isImageSelected(image.node.id)
                          ? "bg-blue-500 border-blue-500 text-white"
                          : isSelectionDisabled(image.node.id)
                          ? "bg-gray-300 border-gray-400 cursor-not-allowed"
                          : "bg-white/80 border-gray-300 hover:border-blue-400"
                      }`}
                    >
                      {isImageSelected(image.node.id) && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="text-white"
                        >
                          ✓
                        </motion.div>
                      )}
                    </div>
                  </div>
                )}

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

              {/* Example badge */}
              {image.node.isExample && (
                <div className="absolute top-3 right-3 bg-purple-600/90 backdrop-blur-sm px-2 py-1 rounded-md text-white text-xs font-medium flex items-center gap-1 shadow-lg z-10">
                  <Sparkles className="w-3 h-3" />
                  <span>{t("imageGallery.example")}</span>
                </div>
              )}

              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Action buttons - only show when not in multiSelect mode */}
              {!multiSelect &&
                image.node.status !== GenAiStatusEnum.Pending &&
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

                    <Link
                      href={`/dashboard/create/video?image=${image.node.id}`}
                    >
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
                        handleDownloadImage(image.node.imageUrl, e)
                      }
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
          );
        })}
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

      {!multiSelect && (
        <SelectedImageModal
          selectedImage={selectedImage}
          closeModal={closeModal}
          handleDownloadImage={handleDownloadImage}
          tab={tab}
        />
      )}
    </>
  );
}
