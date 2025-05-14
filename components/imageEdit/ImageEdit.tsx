"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ImageIcon,
  Wand2,
  Sparkles,
  RefreshCw,
  Upload,
  X,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { ImageGallery } from "../gallery/ImageGallery";
import { ImageTypeOptionsEnum } from "../../gql/graphql";
import axios from "axios";
import { useSearchParams, useRouter } from "next/navigation";
import { ImageByIdQuery } from "../videoCreation/VideoCreation";
import { useMutation, useQuery } from "urql";
import { Image } from "../../gql/graphql";
import { Badge } from "@/components/ui/badge";
import { graphql } from "../../gql";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

type ImageEdit = {
  id: string;
  prompt?: string | null;
  status: string;
  imageUrl?: string | null;
};

// Predefined prompt ideas
const promptIdeas = [
  {
    id: "1",
    text: "Change the background to a sunny beach",
  },
  {
    id: "2",
    text: "Remove the background and replace with a gradient",
  },
  {
    id: "3",
    text: "Add a soft bokeh effect to the background",
  },
  {
    id: "4",
    text: "Make the image look like a professional studio portrait",
  },
  {
    id: "5",
    text: "Convert the image to a watercolor painting style",
  },
];

const ImageEditMutation = graphql(/* GraphQL */ `
  mutation ImageEdit($input: ImageEditInput!) {
    imageEdit(input: $input) {
      id
      prompt
      status
      imageUrl
    }
  }
`);

export default function ImageEdit() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const image = searchParams?.get("image");

  const [imagePrompt, setImagePrompt] = useState("");
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageData, setImageData] = useState<Image | null>(null);
  const [isEditingImage, setIsEditingImage] = useState(false);
  const [shouldRefetch, setShouldRefetch] = useState(false);

  const [, editImage] = useMutation(ImageEditMutation);

  const [{ data, fetching, error }] = useQuery({
    query: ImageByIdQuery,
    variables: { id: image || "" },
    pause: !image,
  });

  useEffect(() => {
    if (!searchParams?.get("image") || !data?.node) {
      setImageData(null);
    } else if (data?.node) {
      setImageData(data.node as Image);
    }
  }, [data, searchParams]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setUploadedImage(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveSelectedImage = () => {
    // Clear the URL parameter
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.delete("image");
    router.push(newUrl.pathname);
  };

  const handleEditImage = async () => {
    if (!imagePrompt.trim() || (!uploadedImage && !imageData)) return;

    setIsEditingImage(true);

    try {
      setShouldRefetch(true);

      if (uploadedImage) {
        const formData = new FormData();

        if (uploadedImage) {
          formData.append("file", uploadedImage);
        } else if (imageData) {
          formData.append("imageId", imageData.id);
        }

        formData.append("prompt", imagePrompt);

        await axios.post(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/upload/image`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
          }
        );
      } else if (imageData) {
        await editImage({
          input: { imageId: imageData.id, prompt: imagePrompt },
        });
      }

      setImagePrompt("");
      handleRemoveImage();
      if (imageData) {
        handleRemoveSelectedImage();
      }
    } catch (error) {
      console.error("Error editing image:", error);
    } finally {
      setIsEditingImage(false);
      setShouldRefetch(false);
    }
  };

  const handlePromptIdeaClick = (idea: string) => {
    setImagePrompt(idea);
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="max-w-md w-full bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-lg p-8 shadow-md"
        >
          <ImageIcon className="h-16 w-16 text-red-400 mx-auto mb-6" />
          <h3 className="text-2xl font-medium text-red-700 dark:text-red-400 mb-3 text-center">
            Error Loading Image
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
              Go Back
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50 dark:from-gray-900 dark:to-purple-950/30">
      <div className="container mx-auto max-w-7xl px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="grid grid-cols-1 md:grid-cols-5 gap-8 w-full"
        >
          {/* Source Image */}
          <Card className="border border-purple-100 dark:border-purple-900/30 shadow-lg bg-white/95 backdrop-blur-sm dark:bg-gray-800/95 overflow-hidden hover:shadow-xl transition-all duration-300 md:col-span-2 rounded-xl">
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <ImageIcon className="h-5 w-5 text-purple-500" />
                  Source Image
                </h3>
                <Badge
                  variant="outline"
                  className="text-sm py-1 px-2 bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800/30"
                >
                  Original
                </Badge>
              </div>
              <div className="aspect-square relative overflow-hidden rounded-lg border border-purple-100 dark:border-purple-900/50 shadow-inner group">
                {imageData?.imageUrl || previewUrl ? (
                  <>
                    <div className="relative group h-full">
                      <img
                        src={imageData?.imageUrl || previewUrl || ""}
                        alt="Selected image"
                        className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                      />
                      <button
                        onClick={
                          imageData
                            ? handleRemoveSelectedImage
                            : handleRemoveImage
                        }
                        className="absolute top-2 right-2 bg-black/60 text-white p-1.5 rounded-full opacity-100 transition-opacity duration-200 hover:bg-black/80"
                        title="Remove image"
                      >
                        <X className="h-4 w-4" />
                      </button>
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
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-purple-50 dark:from-gray-800 dark:to-purple-900/20 backdrop-blur-sm">
                    <div className="text-center p-8 max-w-md">
                      <div className="relative w-20 h-20 mx-auto mb-4">
                        <div className="absolute inset-0 bg-purple-200 dark:bg-purple-700/30 rounded-full animate-ping opacity-30"></div>
                        <div className="relative flex items-center justify-center w-full h-full bg-gradient-to-r from-purple-400 to-indigo-400 dark:from-purple-600 dark:to-indigo-600 rounded-full shadow-lg">
                          <ImageIcon className="h-10 w-10 text-white" />
                        </div>
                      </div>
                      <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-3">
                        Add an Image to Begin
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 mb-6">
                        Select or upload an image to transform it with AI
                        editing
                      </p>
                      <div className="flex flex-col sm:flex-row justify-center gap-4 mb-4">
                        <Button
                          variant="outline"
                          className="w-full sm:w-auto border-purple-200 text-purple-700 hover:bg-purple-50 dark:border-purple-900/30 dark:text-purple-400 dark:hover:bg-purple-900/20 transition-all duration-300 rounded-full cursor-pointer shadow-sm hover:shadow-md"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <>
                            <Upload className="mr-2 h-4 w-4" />
                            Upload Image
                          </>
                        </Button>
                        <input
                          id="image-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleFileChange}
                          ref={fileInputRef}
                        />

                        <Link href="/dashboard/gallery">
                          <Button className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg rounded-full">
                            <ImageIcon className="mr-2 h-4 w-4" />
                            Select from Gallery
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Prompt Input Below Image */}
              <div className="mt-6 space-y-5">
                <div className="space-y-3">
                  <h3 className="text-base font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-purple-500" />
                    Prompt Ideas:
                  </h3>
                  <Select
                    value=""
                    onValueChange={(value) => {
                      if (value) handlePromptIdeaClick(value);
                    }}
                  >
                    <SelectTrigger className="border-purple-100 dark:border-purple-900/50 focus:border-purple-300 focus:ring-purple-500 text-sm">
                      <SelectValue placeholder="Choose a prompt idea or write your own" />
                    </SelectTrigger>
                    <SelectContent>
                      {promptIdeas.map((idea) => (
                        <SelectItem key={idea.id} value={idea.text}>
                          <div className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4" />
                            <span className="truncate">
                              {idea.text.substring(0, 50)}...
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <h3 className="text-base font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-purple-500" />
                    Edit Instructions
                  </h3>
                  <Textarea
                    placeholder="Describe how you want to edit your image..."
                    className="min-h-[100px] text-base resize-none border-purple-100 dark:border-purple-900/50 focus:border-purple-300 focus:ring-purple-500 transition-colors duration-200 rounded-lg"
                    value={imagePrompt}
                    onChange={(e) => setImagePrompt(e.target.value)}
                    disabled={isEditingImage}
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => setImagePrompt("")}
                    disabled={!imagePrompt.trim() || isEditingImage}
                    className="text-sm border-purple-200 text-purple-700 hover:bg-purple-50 dark:border-purple-900/30 dark:text-purple-400 dark:hover:bg-purple-900/20 transition-colors duration-200 rounded-full"
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Clear
                  </Button>
                  <Button
                    onClick={handleEditImage}
                    disabled={
                      isEditingImage ||
                      !imagePrompt.trim() ||
                      (!uploadedImage && !imageData)
                    }
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all duration-300 rounded-full"
                  >
                    {isEditingImage ? (
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
                        Editing...
                      </>
                    ) : (
                      <>
                        <Wand2 className="mr-2 h-4 w-4" />
                        Edit Image
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Edited Image Output */}
          <Card className="border border-purple-100 dark:border-purple-900/30 shadow-lg bg-white/95 backdrop-blur-sm dark:bg-gray-800/95 overflow-hidden md:col-span-3 hover:shadow-xl transition-all duration-300 rounded-xl">
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <ImageIcon className="h-5 w-5 text-purple-500" />
                  Edited Image
                </h3>
                {isEditingImage && (
                  <Badge className="text-sm py-1 px-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 animate-pulse shadow-sm rounded-full">
                    Processing
                  </Badge>
                )}
              </div>
              <div
                className="relative overflow-hidden rounded-xl border border-purple-100 dark:border-purple-900/50 bg-gray-100 dark:bg-gray-700 shadow-inner w-full h-auto"
                style={{ aspectRatio: "1/1" }}
              >
                {isEditingImage ? (
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
                      Editing your image...
                    </p>
                    <div className="max-w-md">
                      <p className="text-base text-gray-500 dark:text-gray-400">
                        We&apos;re transforming your image with AI magic! This
                        typically takes 15-30 seconds.
                      </p>
                    </div>
                    <div className="w-full max-w-sm bg-gray-200 dark:bg-gray-600 rounded-full h-3 mt-6 overflow-hidden">
                      <motion.div
                        className="bg-gradient-to-r from-purple-600 to-indigo-600 h-3 rounded-full"
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 30, ease: "linear" }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-8 h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
                    <ImageIcon className="h-16 w-16 text-purple-400 mx-auto mb-4 opacity-75" />
                    <p className="text-gray-600 dark:text-gray-300 font-medium text-lg mb-3">
                      {imagePrompt
                        ? "Your edited image will appear here"
                        : "Enter a prompt to edit your image"}
                    </p>
                    <p className="text-base text-gray-500 dark:text-gray-400 max-w-md">
                      Click the &quot;Edit Image&quot; button to transform your
                      image with AI
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="container mx-auto max-w-7xl px-6 pb-8">
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-purple-500" />
              Your Edited Images
              <span className="text-sm text-gray-500 dark:text-gray-400 font-normal"></span>
            </h3>

            <ImageGallery
              type={[
                ImageTypeOptionsEnum.Edited,
                ImageTypeOptionsEnum.UserUploaded,
              ]}
              shouldRefetch={shouldRefetch}
              showPrompt={false}
              loadPartialGallery
              tab="edited-images"
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
