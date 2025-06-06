"use client";

import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ImageIcon, Sparkles, X, ArrowLeftRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { EmptySourceImage } from "../common/EmptySourceImage";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { Image, ImageTypeOptionsEnum } from "@/gql/graphql";
import { graphql } from "../../gql";
import { useMutation, useQuery } from "urql";
import { ImageByIdQuery } from "../common/ImageByIdQuery";
import { motion } from "framer-motion";
import { ImageGallery } from "../gallery/ImageGallery";
import { useTranslation } from "react-i18next";
import { Checkout } from "../checkout/Checkout";
import { useUsageQuery } from "../common/useUsageQuery";
import ReactCompareImage from "react-compare-image";
// Component for source image display
interface SourceImageDisplayProps {
  imageUrl: string;
  prompt?: string | null;
  onRemove: () => void;
}

const RestoreImageMutation = graphql(/* GraphQL */ `
  mutation ImageRestore($input: ImageRestoreInput!) {
    imageRestore(input: $input) {
      id
      prompt
      status
      imageUrl
    }
  }
`);

const SourceImageDisplay = ({
  imageUrl,
  prompt,
  onRemove,
}: SourceImageDisplayProps) => (
  <div className="relative group h-full">
    <img
      src={imageUrl}
      alt="Selected image"
      className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
    />
    <button
      onClick={onRemove}
      className="absolute top-2 right-2 bg-black/60 text-white p-1.5 rounded-full opacity-100 transition-opacity duration-200 hover:bg-black/80"
      title="Remove image"
    >
      <X className="h-4 w-4" />
    </button>
    {prompt && (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 text-white text-sm truncate cursor-help">
              {prompt}
            </div>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs bg-gray-900/95 text-white border-purple-500/20 backdrop-blur-md">
            <p>{prompt}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )}
  </div>
);

// Component for prompt action buttons
interface PromptActionsProps {
  onRestore: () => void;
  isRestoring: boolean;
  hasImage: boolean;
}

const PromptActions = ({
  onRestore,
  isRestoring,
  hasImage,
}: PromptActionsProps) => {
  const { t } = useTranslation();
  const { data: usageData } = useUsageQuery();

  const [canRestoreImage, setCanRestoreImage] = useState(false);

  useEffect(() => {
    const imageCreationUsage =
      usageData?.me?.planFeaturesUsage?.imageRestoration;
    if (
      !imageCreationUsage ||
      imageCreationUsage.used >= imageCreationUsage.limit
    ) {
      setCanRestoreImage(false);
    } else {
      setCanRestoreImage(true);
    }
  }, [usageData]);

  return (
    <div className="flex justify-end gap-3 pt-2">
      {canRestoreImage ? (
        <Button
          onClick={onRestore}
          disabled={isRestoring || !hasImage}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all duration-300 rounded-full"
        >
          {isRestoring ? (
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
              {t("restoreImage.restoringImage")}
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              {t("restoreImage.restoreImage")}
            </>
          )}
        </Button>
      ) : (
        <Checkout
          trigger={
            <Button
              disabled={isRestoring || !hasImage}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all duration-300 rounded-full"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              {t("restoreImage.restoreImage")}
            </Button>
          }
        />
      )}
    </div>
  );
};

// Component for processing state in restored image
const ProcessingRestoredImage = () => {
  const { t } = useTranslation();

  return (
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
        {t("restoreImage.restoringImage")}
      </p>
      <div className="max-w-md">
        <p className="text-base text-gray-500 dark:text-gray-400">
          {t("restoreImage.restoringImageDescription")}
        </p>
      </div>
    </div>
  );
};

// Main component
export default function RestoreImage() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();

  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [restoredImageUrl, setRestoredImageUrl] = useState<string | null>(null);
  const [imageData, setImageData] = useState<Image | null>(null);
  const [showBeforeAfter, setShowBeforeAfter] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageId, setImageId] = useState<string | null>(null);
  const [shouldRefetch, setShouldRefetch] = useState(false);
  const [image, setImage] = useState<string | null>(searchParams?.get("image"));
  const [isLoading, setIsLoading] = useState(false);

  const [, restoreImage] = useMutation(RestoreImageMutation);
  const { reexecuteQuery: reexecuteUsageQuery } = useUsageQuery();

  const [{ data }, reexecuteQuery] = useQuery({
    query: ImageByIdQuery,
    variables: { id: image || "" },
    pause: true,
  });

  useEffect(() => {
    if (image) {
      reexecuteQuery({ requestPolicy: "network-only" });
    }
  }, [image, reexecuteQuery]);

  useEffect(() => {
    if (imageId && !restoredImageUrl) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
      setShouldRefetch(false);
    }
  }, [imageId, restoredImageUrl]);

  useEffect(() => {
    if (data?.node) {
      setImageData(data.node as Image);
    }
  }, [data, searchParams]);

  // Handle file change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedImage(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Reset restored image when new image is uploaded
      setRestoredImageUrl(null);
      setShowBeforeAfter(false);
    }
  };

  // Handle remove image
  const handleRemoveImage = () => {
    setUploadedImage(null);
    setPreviewUrl(null);
    setRestoredImageUrl(null);
    setShowBeforeAfter(false);
    setImage(null);
    setImageData(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Handle restore image
  const handleRestoreImage = async () => {
    if (!uploadedImage && !imageData) return;

    setIsLoading(true);
    setRestoredImageUrl(null);

    try {
      let imageId = null;

      if (imageData) {
        const result = await restoreImage({
          input: { imageId: imageData.id },
        });

        imageId = result.data?.imageRestore.id;
      } else if (uploadedImage) {
        const formData = new FormData();

        formData.append("file", uploadedImage);

        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/upload/restore`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
          }
        );

        imageId = response.data.id;
        setImage(response.data?.originalImages?.id || null);
      }

      if (imageId) {
        setImageId(imageId);
      }
      setShouldRefetch(true);
      reexecuteUsageQuery({
        requestPolicy: "network-only",
      });
    } catch (error) {
      console.error("Error editing image:", error);
    }
  };

  // Handle upload click
  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Toggle between side-by-side and before/after view
  const toggleBeforeAfterView = () => {
    setShowBeforeAfter(!showBeforeAfter);
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center gap-x-2 mb-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            {t("restoreImage.imageRestoration")}
          </h1>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Source Image Card */}
        <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border border-purple-100/30 dark:border-purple-800/30 shadow-xl overflow-hidden rounded-xl">
          <CardContent className="p-6 lg:p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-x-2">
                <div className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg shadow-sm">
                  <ImageIcon className="h-4 w-4 text-white" />
                </div>
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
                  {t("restoreImage.originalImage")}
                </h3>
              </div>
              <Badge
                variant="outline"
                className="text-sm py-1 px-3 bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800/30 rounded-full"
              >
                {t("restoreImage.before")}
              </Badge>
            </div>

            <div className="aspect-[4/3] relative overflow-hidden rounded-xl border border-purple-100/50 dark:border-purple-900/50 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 shadow-inner mb-6">
              {imageData?.imageUrl || previewUrl ? (
                <SourceImageDisplay
                  imageUrl={imageData?.imageUrl || previewUrl || ""}
                  onRemove={handleRemoveImage}
                />
              ) : (
                <EmptySourceImage
                  onUploadClick={handleUploadClick}
                  doNotRedirect
                />
              )}
            </div>

            <input
              id="image-upload"
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
            />

            <div className="bg-white/70 dark:bg-gray-800/70 rounded-xl p-4 border border-purple-100/30 dark:border-purple-800/30">
              <PromptActions
                onRestore={handleRestoreImage}
                isRestoring={isLoading}
                hasImage={!!uploadedImage || !!imageData}
              />
            </div>
          </CardContent>
        </Card>

        {/* Restored Image Card */}
        <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border border-purple-100/30 dark:border-purple-800/30 shadow-xl overflow-hidden rounded-xl">
          <CardContent className="p-6 lg:p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-x-2">
                <div className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg shadow-sm">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
                  {t("restoreImage.restoredImage")}
                </h3>
              </div>
              <Badge
                variant="outline"
                className="text-sm py-1 px-3 bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800/30 rounded-full"
              >
                {t("restoreImage.after")}
              </Badge>
            </div>

            <div className="aspect-[4/3] relative overflow-hidden rounded-xl border border-purple-100/50 dark:border-purple-900/50 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 shadow-inner mb-6">
              {isLoading ? (
                <ProcessingRestoredImage />
              ) : restoredImageUrl ? (
                <div className="w-full h-full flex items-center justify-center">
                  <img
                    src={restoredImageUrl}
                    alt="Restored image"
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="p-4 rounded-full bg-purple-100/50 dark:bg-purple-900/30 mb-4">
                    <Sparkles className="h-8 w-8 text-purple-500" />
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 text-center px-4">
                    {t("restoreImage.yourRestoredImageWillAppearHere")}
                  </p>
                </div>
              )}
            </div>

            {/* Download button for restored image */}
            {restoredImageUrl && (
              <div className="bg-white/70 dark:bg-gray-800/70 rounded-xl p-4 border border-purple-100/30 dark:border-purple-800/30">
                <div className="flex justify-center">
                  <Button
                    className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 shadow-md hover:shadow-lg transition-all duration-300 rounded-full"
                    onClick={() => {
                      // Create a temporary link to download the image
                      const link = document.createElement("a");
                      link.href = restoredImageUrl;
                      link.download = "restored-image.jpg";
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                  >
                    {t("restoreImage.downloadRestoredImage")}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Before/After Comparison */}
      {restoredImageUrl && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
        >
          <Card className="mt-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border border-purple-100/30 dark:border-purple-800/30 shadow-xl overflow-hidden rounded-xl">
            <CardContent className="p-6 lg:p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-x-2">
                  <div className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg shadow-sm">
                    <ArrowLeftRight className="h-4 w-4 text-white" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
                    {t("restoreImage.beforeAndAfterComparison")}
                  </h3>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleBeforeAfterView}
                  className="text-sm border-purple-200 text-purple-700 hover:bg-purple-50 dark:border-purple-900/30 dark:text-purple-400 dark:hover:bg-purple-900/20 transition-colors duration-200 rounded-full"
                >
                  {showBeforeAfter
                    ? t("restoreImage.sideBySide")
                    : t("restoreImage.slideView")}
                </Button>
              </div>

              <div className="bg-white/70 dark:bg-gray-800/70 rounded-xl p-4 border border-purple-100/30 dark:border-purple-800/30">
                {showBeforeAfter ? (
                  <div className="relative overflow-hidden rounded-lg">
                    <ReactCompareImage
                      leftImage={imageData?.imageUrl || previewUrl || ""}
                      rightImage={restoredImageUrl || ""}
                      sliderLineWidth={2}
                      sliderLineColor="#6366F1"
                      handleSize={40}
                      leftImageLabel={t("restoreImage.before")}
                      rightImageLabel={t("restoreImage.after")}
                      leftImageCss={{ objectFit: "contain", maxHeight: "100%" }}
                      rightImageCss={{
                        objectFit: "contain",
                        maxHeight: "100%",
                      }}
                    />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-purple-100/50 dark:border-purple-900/50 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
                      <div className="w-full h-full flex items-center justify-center">
                        <img
                          src={imageData?.imageUrl || previewUrl || ""}
                          alt="Before"
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                      <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                        {t("restoreImage.before")}
                      </div>
                    </div>
                    <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-purple-100/50 dark:border-purple-900/50 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
                      <div className="w-full h-full flex items-center justify-center">
                        <img
                          src={restoredImageUrl || ""}
                          alt="After"
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                      <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                        {t("restoreImage.after")}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Gallery Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.3 }}
        className="mt-8"
      >
        <div className="flex items-center gap-x-2 mb-6">
          <div className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg shadow-sm">
            <ImageIcon className="h-4 w-4 text-white" />
          </div>
          <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
            {t("restoreImage.yourRestoredImages")}
          </h3>
        </div>

        <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border border-purple-100/30 dark:border-purple-800/30 shadow-xl overflow-hidden rounded-xl">
          <CardContent className="p-6">
            <ImageGallery
              type={[ImageTypeOptionsEnum.Restored]}
              shouldRefetch={shouldRefetch}
              showPrompt={false}
              loadPartialGallery
              tab="restored-images"
              createdImageId={imageId}
              setCreatedImageUrl={setRestoredImageUrl}
            />
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
