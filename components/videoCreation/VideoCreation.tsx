"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ImageIcon,
  VideoIcon,
  Wand2,
  RefreshCw,
  Sparkles,
  Download,
  X,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useSearchParams, useRouter } from "next/navigation";
import { graphql } from "../../gql";
import { useMutation, useQuery } from "urql";
import { useEffect, useRef, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Image } from "../../gql/graphql";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { VideoGallery } from "../gallery/VideoGallery";
import axios from "axios";
import { EmptyState } from "./EmptyState";
import { ImageByIdQuery } from "../common/ImageByIdQuery";
import { useTranslation } from "react-i18next";
import { Checkout } from "../checkout/Checkout";
import { useMeQuery } from "../common/useMeQuery";
import { useUsageQuery } from "../common/useUsageQuery";

const VideoCreationMutation = graphql(/* GraphQL */ `
  mutation VideoCreation($input: VideoCreationInput!) {
    videoCreation(input: $input) {
      id
      status
    }
  }
`);

export default function VideoCreation() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [videoPrompt, setVideoPrompt] = useState("");
  const [negativePrompt, setNegativePrompt] = useState("");
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [shouldRefetch, setShouldRefetch] = useState(false);
  const [createdVideoId, setCreatedVideoId] = useState<string | null>(null);
  const [imageData, setImageData] = useState<Image | null>(null);
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<string | null>(searchParams?.get("image"));
  const [isLoading, setIsLoading] = useState(false);

  const [, generateVideo] = useMutation(VideoCreationMutation);
  const { data: userData } = useMeQuery();
  const { reexecuteQuery: reexecuteUsageQuery } = useUsageQuery({
    pause: true,
  });

  const [{ data, fetching, error }, reexecuteQuery] = useQuery({
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
    if (createdVideoId && !videoUrl) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
      setShouldRefetch(false);
    }
  }, [createdVideoId, videoUrl]);

  useEffect(() => {
    if (data?.node) {
      setImageData(data.node as Image);
    }
  }, [data, searchParams]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      // Calculate how many more images we can add (max 4 total including imageData)
      const currentCount = (imageData ? 1 : 0) + uploadedImages.length;
      const remainingSlots = 4 - currentCount;

      // If we can't add any more images, return early
      if (remainingSlots <= 0) {
        return;
      }

      // Take only as many files as we have slots for
      const filesToAdd = files.slice(0, remainingSlots);

      // Create preview URLs for the files we're adding
      const newPreviewUrls = await Promise.all(
        filesToAdd.map(
          (file) =>
            new Promise<string>((resolve) => {
              const reader = new FileReader();
              reader.onloadend = () => {
                resolve(reader.result as string);
              };
              reader.readAsDataURL(file);
            })
        )
      );

      // Update state with new files and previews
      setUploadedImages((prev) => [...prev, ...filesToAdd]);
      setPreviewUrls((prev) => [...prev, ...newPreviewUrls]);
    }

    // Clear the file input to allow selecting the same files again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveImage = (index: number) => {
    // Case 1: Remove imageData (from URL parameter)
    if (index === -1) {
      // First set the state variables to null
      setImage(null);
      setImageData(null);
      setPreviewUrls([]);

      // Reset video state when removing the source image
      setVideoUrl(null);
      setCreatedVideoId(null);
      setIsLoading(false);

      // Update URL parameters without triggering page reload
      if (typeof window !== "undefined") {
        const url = new URL(window.location.href);
        url.searchParams.delete("image");

        // Use router.replace to update the URL without full navigation
        router.replace(url.pathname + url.search, { scroll: false });
      }
    }
    // Case 2: Remove uploaded image
    else {
      setUploadedImages((prev) => {
        const newUploadedImages = [...prev];
        newUploadedImages.splice(index, 1);
        return newUploadedImages;
      });

      setPreviewUrls((prev) => {
        const newPreviewUrls = [...prev];
        newPreviewUrls.splice(index, 1);
        return newPreviewUrls;
      });

      // If removing the last image, reset video state
      if (uploadedImages.length === 1 && imageData === null) {
        setVideoUrl(null);
        setCreatedVideoId(null);
        setIsLoading(false);
      }
    }

    // Reset file input to allow re-uploading the same file if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleGenerateVideo = async () => {
    if (!videoPrompt.trim() || (imageData === null && previewUrls.length === 0))
      return;

    setVideoUrl(null);
    setIsLoading(true);
    try {
      if (imageData !== null && uploadedImages.length === 0) {
        const result = await generateVideo({
          input: {
            prompt: videoPrompt,
            imageId: image || "",
            negativePrompt,
          },
        });

        setCreatedVideoId(result?.data?.videoCreation?.id || null);
      } else if (uploadedImages.length > 0) {
        const formData = new FormData();

        uploadedImages.forEach((file) => {
          formData.append("files", file);
        });
        formData.append("prompt", videoPrompt);
        formData.append("negativePrompt", negativePrompt);

        if (image) {
          formData.append("imageId", image);
        }

        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/upload/video`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
          }
        );

        setCreatedVideoId(response?.data?.id || null);
        if (response?.data?.originalImages?.length === 1) {
          setImage(response?.data?.originalImages[0]?.id);
        }
      }

      reexecuteUsageQuery({
        requestPolicy: "network-only",
      });
      setShouldRefetch(true);
    } catch (error) {
      console.error(t("videoCreation.errorGeneratingVideo"), error);
    }
  };

  const handleDownloadVideo = async () => {
    if (!videoUrl) return;

    try {
      const a = document.createElement("a");
      a.href = videoUrl;
      a.download = "generated-video.mp4";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading video:", error);
    }
  };

  if (fetching && !imageData) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-8 flex justify-center items-center h-screen">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full"
        >
          {/* Loading Skeleton for Image Preview */}
          <Card className="border border-purple-100 dark:border-purple-900/30 shadow-lg bg-white/90 backdrop-blur-sm dark:bg-gray-800/90 overflow-hidden">
            <CardContent className="p-8">
              <div className="flex items-center gap-2 mb-4">
                <Skeleton className="h-5 w-5 rounded-full" />
                <Skeleton className="h-6 w-28" />
              </div>
              <Skeleton className="aspect-square w-full rounded-lg" />
            </CardContent>
          </Card>

          {/* Loading Skeleton for Prompt */}
          <Card className="border border-purple-100 dark:border-purple-900/30 shadow-lg bg-white/90 backdrop-blur-sm dark:bg-gray-800/90 overflow-hidden">
            <CardContent className="p-8">
              <div className="flex items-center gap-2 mb-4">
                <Skeleton className="h-5 w-5 rounded-full" />
                <Skeleton className="h-6 w-36" />
              </div>
              <Skeleton className="h-5 w-full mb-4" />
              <Skeleton className="h-24 w-full rounded-md" />
              <div className="flex justify-end gap-3 mt-4">
                <Skeleton className="h-10 w-24 rounded-md" />
                <Skeleton className="h-10 w-36 rounded-md" />
              </div>
            </CardContent>
          </Card>

          {/* Loading Skeleton for Video Output */}
          <Card className="border border-purple-100 dark:border-purple-900/30 shadow-lg bg-white/90 backdrop-blur-sm dark:bg-gray-800/90 overflow-hidden">
            <CardContent className="p-8">
              <div className="flex items-center gap-2 mb-4">
                <Skeleton className="h-5 w-5 rounded-full" />
                <Skeleton className="h-6 w-32" />
              </div>
              <Skeleton className="aspect-video w-full rounded-lg" />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto max-w-7xl px-4 flex justify-center items-center h-screen">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="max-w-md w-full bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-lg p-8 shadow-md"
        >
          <VideoIcon className="h-16 w-16 text-red-400 mx-auto mb-6" />
          <h3 className="text-2xl font-medium text-red-700 dark:text-red-400 mb-3 text-center">
            {t("videoCreation.errorLoadingImage")}
          </h3>
          <p className="text-red-600 dark:text-red-300 text-center mb-6">
            {error.message}
          </p>
          <div className="flex justify-center">
            <Button
              variant="outline"
              className="border-red-200 text-red-700 hover:bg-red-50 dark:border-red-800/30 dark:text-red-400 dark:hover:bg-red-900/20"
              onClick={() => window.history.back()}
            >
              {t("videoCreation.goBack")}
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
        {t("videoCreation.title")}
      </h1>

      {/* Hidden file input at the component level */}
      <input
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFileChange}
        ref={fileInputRef}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Source Image */}
        <Card className="border border-purple-100 dark:border-purple-900/30 shadow-lg bg-white/95 backdrop-blur-sm dark:bg-gray-800/95 overflow-hidden hover:shadow-xl transition-all duration-300 rounded-xl">
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-purple-500" />
                {t("videoCreation.sourceImage")}
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  (1-4 {t("videoCreation.images")})
                </span>
              </h3>
              <Badge
                variant="outline"
                className="text-sm py-1 px-2 bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800/30"
              >
                {t("videoCreation.original")}
              </Badge>
            </div>
            <div className="aspect-square relative overflow-hidden rounded-lg border border-purple-100 dark:border-purple-900/50 shadow-inner group">
              {imageData?.imageUrl || previewUrls.length > 0 ? (
                <div className="relative group h-full">
                  <div className="grid grid-cols-2 gap-2 p-2">
                    {imageData?.imageUrl && (
                      <div className="relative aspect-square">
                        <motion.img
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3 }}
                          src={imageData.imageUrl}
                          alt="Selected image"
                          className="w-full h-full object-cover rounded-lg"
                        />
                        <button
                          onClick={() => handleRemoveImage(-1)}
                          className="absolute top-1 right-1 bg-black/60 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-black/80"
                          title="Remove image"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                    {previewUrls.map((url, index) => (
                      <motion.div
                        key={index}
                        className="relative aspect-square"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <img
                          src={url}
                          alt={`Uploaded image ${index + 1}`}
                          className="w-full h-full object-cover rounded-lg"
                        />
                        <button
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-1 right-1 bg-black/60 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-black/80"
                          title="Remove image"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </motion.div>
                    ))}
                    {(imageData !== null
                      ? previewUrls.length < 3
                      : previewUrls.length < 4) && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                          duration: 0.3,
                          delay:
                            (imageData
                              ? previewUrls.length
                              : previewUrls.length) * 0.1,
                        }}
                        className="relative aspect-square border-2 border-dashed border-purple-200 dark:border-purple-700 rounded-lg flex items-center justify-center cursor-pointer hover:border-purple-400 dark:hover:border-purple-500 transition-colors duration-200"
                        onClick={() => {
                          if (fileInputRef.current) {
                            fileInputRef.current.click();
                          }
                        }}
                      >
                        <div className="text-center p-4">
                          <Upload className="h-6 w-6 text-purple-400 mx-auto mb-2" />
                          <span className="text-sm text-purple-500 dark:text-purple-400">
                            {t("videoCreation.addMoreImages")}
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {imageData?.prompt && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 text-white text-sm truncate cursor-help">
                            {imageData.prompt}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs bg-gray-900/95 text-white border-purple-500/20 backdrop-blur-md">
                          <p>{imageData.prompt}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
              ) : (
                <EmptyState
                  fileInputRef={
                    fileInputRef as React.RefObject<HTMLInputElement>
                  }
                />
              )}
            </div>

            {/* Note about multiple images */}
            {/* {previewUrls.length > 0 && (
              <div className="mt-3 text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 p-2 rounded-lg border border-amber-100 dark:border-amber-800/30">
                <p>
                  <strong>Note:</strong> Using multiple images may result in
                  slight changes to the original content. For the most accurate
                  results, consider using just one image.
                </p>
              </div>
            )} */}

            {/* Prompt Input Below Image */}
            <div className="mt-6 space-y-5">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="text-base font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-purple-500" />
                    {t("videoCreation.animationDescription")}
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setVideoPrompt(
                        t("videoCreation.defaultPrompt") ||
                          "move the camera around. Use realistic motion. Make them smile as if enjoying their travels"
                      )
                    }
                    className="text-xs text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
                  >
                    <Sparkles className="mr-1 h-3 w-3" />
                    {t("videoCreation.useDefault")}
                  </Button>
                </div>
                <Textarea
                  placeholder={t("videoCreation.placeholder")}
                  className="min-h-[100px] text-base resize-none border-purple-100 dark:border-purple-900/50 focus:border-purple-300 focus:ring-purple-500 transition-colors duration-200 rounded-lg shadow-inner"
                  value={videoPrompt}
                  onChange={(e) => setVideoPrompt(e.target.value)}
                  disabled={isLoading}
                  maxLength={1500}
                />
              </div>

              <div className="space-y-3">
                <h3 className="text-base font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-red-500" />
                  <span>{t("videoCreation.negativePrompt")}</span>
                </h3>
                <Textarea
                  placeholder={t("videoCreation.negativePromptPlaceholder")}
                  className="min-h-[80px] text-base resize-none border-red-100 dark:border-red-900/50 focus:border-red-300 focus:ring-red-500 transition-colors duration-200 rounded-lg shadow-inner"
                  value={negativePrompt}
                  onChange={(e) => setNegativePrompt(e.target.value)}
                  disabled={isLoading}
                  maxLength={1500}
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setVideoPrompt("")}
                  disabled={!videoPrompt.trim() || isLoading}
                  className="text-sm border-purple-200 text-purple-700 hover:bg-purple-50 dark:border-purple-900/30 dark:text-purple-400 dark:hover:bg-purple-900/20 transition-colors duration-200 rounded-full"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Clear
                </Button>
                {userData?.me?.hasActiveSubscription ? (
                  <Button
                    onClick={handleGenerateVideo}
                    disabled={
                      isLoading ||
                      !videoPrompt.trim() ||
                      (imageData === null && previewUrls.length === 0)
                    }
                    className="text-sm bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg rounded-full"
                  >
                    {isLoading ? (
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
                        {t("videoCreation.processing")}
                      </>
                    ) : (
                      <>
                        <Wand2 className="mr-2 h-4 w-4" />
                        {t("videoCreation.generateVideo")}
                      </>
                    )}
                  </Button>
                ) : (
                  <Checkout
                    trigger={
                      <Button
                        disabled={
                          isLoading ||
                          !videoPrompt.trim() ||
                          (imageData === null && previewUrls.length === 0)
                        }
                        className="text-sm bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg rounded-full"
                      >
                        <Wand2 className="mr-2 h-4 w-4" />
                        {t("videoCreation.generateVideo")}
                      </Button>
                    }
                  />
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Video Output */}
        <Card className="border border-purple-100 dark:border-purple-900/30 shadow-lg bg-white/95 backdrop-blur-sm dark:bg-gray-800/95 overflow-hidden hover:shadow-xl transition-all duration-300 rounded-xl">
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <VideoIcon className="h-5 w-5 text-purple-500" />
                {t("videoCreation.generatedVideo")}
              </h3>
              {videoUrl && (
                <Badge className="text-sm py-1 px-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-sm rounded-full">
                  {t("videoCreation.ready")}
                </Badge>
              )}
              {isLoading && (
                <Badge className="text-sm py-1 px-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 animate-pulse shadow-sm rounded-full">
                  {t("videoCreation.processing")}
                </Badge>
              )}
            </div>
            <div
              className="relative overflow-hidden rounded-xl border border-purple-100 dark:border-purple-900/50 bg-gray-100 dark:bg-gray-700 shadow-inner w-full h-auto"
              style={{ aspectRatio: "16/9" }}
            >
              {isLoading ? (
                <div className="text-center p-8 h-full flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20">
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
                    {t("videoCreation.creatingVideo")}
                  </p>
                  <div className="max-w-md">
                    <p className="text-base text-gray-500 dark:text-gray-400">
                      {t("videoCreation.creatingVideoDescription")}
                    </p>
                  </div>
                  <div className="w-full max-w-sm bg-gray-200 dark:bg-gray-600 rounded-full h-3 mt-6 overflow-hidden">
                    <motion.div
                      className="bg-gradient-to-r from-purple-600 to-indigo-600 h-3 rounded-full"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 60 * 5, ease: "linear" }}
                    />
                  </div>
                </div>
              ) : videoUrl ? (
                <div className="relative w-full h-full group">
                  <video
                    src={videoUrl}
                    controls
                    autoPlay
                    loop
                    className="w-full h-full object-contain"
                  >
                    {t("videoCreation.browserDoesNotSupportVideo")}
                  </video>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-6">
                    <p className="text-white text-base font-medium backdrop-blur-sm bg-black/20 px-4 py-2 rounded-full">
                      {t("videoCreation.hoverToSeeControls")}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center p-8 h-full flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-lg">
                  <VideoIcon className="h-16 w-16 text-purple-400 mx-auto mb-4 opacity-75" />
                  <p className="text-gray-600 dark:text-gray-300 font-medium text-lg mb-3">
                    {videoPrompt
                      ? t("videoCreation.videoWillAppearHere")
                      : t("videoCreation.enterPromptToGenerateVideo")}
                  </p>
                  <p className="text-base text-gray-500 dark:text-gray-400 max-w-md">
                    {t("videoCreation.clickGenerateVideo")}
                  </p>
                </div>
              )}
            </div>
            {videoUrl && (
              <div className="flex justify-end mt-6">
                <Button
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg rounded-full"
                  onClick={handleDownloadVideo}
                >
                  <Download className="mr-2 h-5 w-5" />
                  {t("videoCreation.downloadVideo")}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <div className="container mx-auto px-4 py-6">
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <VideoIcon className="h-5 w-5 text-purple-500" />
              {t("videoCreation.yourCreations")}
              <span className="text-sm text-gray-500 dark:text-gray-400 font-normal"></span>
            </h3>

            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-violet-100 dark:border-violet-900/30">
              <VideoGallery
                shouldRefetch={shouldRefetch}
                setVideoUrl={setVideoUrl}
                createdVideoId={createdVideoId}
                showPrompt={false}
                loadPartialGallery
              />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
