"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ImageIcon } from "lucide-react";
import { ImageGallery } from "../gallery/ImageGallery";
import { AiModelOptionsEnum, ImageTypeOptionsEnum } from "../../gql/graphql";
import axios from "axios";
import { useSearchParams, useRouter } from "next/navigation";

import { useMutation, useQuery } from "urql";
import { Image } from "../../gql/graphql";
import { graphql } from "../../gql";

import { ImageByIdQuery } from "../common/ImageByIdQuery";
import { useTranslation } from "react-i18next";

// Import components
import { ErrorDisplay } from "./ErrorDisplay";
import { SourceImageCard } from "./SourceImageCard";
import { EditedImageCard } from "./EditedImageCard";
import { useToast } from "@/hooks/use-toast";

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

// Main component
export default function ImageEdit() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();

  const [imagePrompt, setImagePrompt] = useState("");
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [imageData, setImageData] = useState<Image | null>(null);
  const [isEditingImage, setIsEditingImage] = useState(false);
  const [shouldRefetch, setShouldRefetch] = useState(false);
  const [imageId, setImageId] = useState<string | null>(null);
  const [model, setModel] = useState(AiModelOptionsEnum.Model_1);
  const [originalImageId, setOriginalImageId] = useState<string | null>(null);

  const [, editImage] = useMutation(ImageEditMutation);

  const [{ data, error }] = useQuery({
    query: ImageByIdQuery,
    variables: { id: originalImageId || "" },
    pause: !originalImageId,
  });

  const [{ data: editedImageData }, reExecuteQuery] = useQuery({
    query: ImageByIdQuery,
    variables: { id: imageId || "" },
    pause: !imageId,
  });

  useEffect(() => {
    const image = searchParams?.get("image");

    if (image) {
      setOriginalImageId(image);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!searchParams?.get("image") || !data?.node) {
      setImageData(null);
    } else if (data?.node) {
      setImageData(data.node as Image);
    }
  }, [data, searchParams]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    if (imageId && editedImageData?.node) {
      // Check if the node is an Image type with imageUrl property
      const nodeAsImage = editedImageData.node as {
        __typename?: string;
        imageUrl?: string | null;
      };

      if (!nodeAsImage.imageUrl && nodeAsImage.__typename === "Image") {
        // Immediately execute once
        reExecuteQuery({
          requestPolicy: "network-only",
          variables: { id: imageId },
        });

        // Set up interval to check every 5 seconds
        intervalId = setInterval(() => {
          reExecuteQuery({
            requestPolicy: "network-only",
            variables: { id: imageId },
          });
        }, 5000);
      } else if (nodeAsImage.imageUrl) {
        setIsEditingImage(false);
      }
    }

    // Clean up the interval on unmount
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [editedImageData, imageId, reExecuteQuery]);

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

    // Check file size limit (10MB)
    if (uploadedImage && uploadedImage.size > 10 * 1024 * 1024) {
      toast({
        title: "Error",
        description: t("imageEdit.fileSizeExceeded"),
        variant: "destructive",
      });
      return;
    }

    setIsEditingImage(true);

    try {
      setShouldRefetch(true);

      let imageId = null;
      if (uploadedImage) {
        const formData = new FormData();

        formData.append("file", uploadedImage);
        formData.append("prompt", imagePrompt);
        formData.append("model", model);

        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/upload/image`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
          }
        );

        imageId = response.data.id;
        setOriginalImageId(response.data.originalImage.id);
      } else if (imageData) {
        const result = await editImage({
          input: { imageId: imageData.id, prompt: imagePrompt, model },
        });

        imageId = result.data?.imageEdit.id;
      }

      if (imageId) {
        setImageId(imageId);
      }
    } catch (error) {
      console.error("Error editing image:", error);
    } finally {
      setIsEditingImage(true);
      setShouldRefetch(false);
    }
  };

  const handlePromptIdeaClick = (idea: string) => {
    setImagePrompt(idea);
  };

  if (error) {
    return <ErrorDisplay errorMessage={error.message} />;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
        {t("imageEdit.imageEdit")}
      </h1>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Source Image */}
        <SourceImageCard
          imageData={imageData}
          previewUrl={previewUrl}
          fileInputRef={fileInputRef as React.RefObject<HTMLInputElement>}
          handleFileChange={handleFileChange}
          handleRemoveImage={handleRemoveImage}
          handleRemoveSelectedImage={handleRemoveSelectedImage}
          imagePrompt={imagePrompt}
          setImagePrompt={setImagePrompt}
          isEditingImage={isEditingImage}
          handleEditImage={handleEditImage}
          handlePromptIdeaClick={handlePromptIdeaClick}
          uploadedImage={uploadedImage}
          model={model}
          setModel={setModel}
        />

        {/* Edited Image Output */}
        <EditedImageCard
          isEditingImage={isEditingImage}
          editedImageData={editedImageData}
          imagePrompt={imagePrompt}
        />
      </motion.div>

      <div className="container mx-auto md:py-6">
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
              {t("imageEdit.yourEditedImages")}
              <span className="text-sm text-gray-500 dark:text-gray-400 font-normal"></span>
            </h3>

            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-violet-100 dark:border-violet-900/30">
              <ImageGallery
                type={[ImageTypeOptionsEnum.Edited]}
                shouldRefetch={shouldRefetch}
                showPrompt={false}
                loadPartialGallery
                tab="edited-images"
              />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
