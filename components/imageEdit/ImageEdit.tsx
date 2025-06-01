"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ImageIcon } from "lucide-react";
import { ImageGallery } from "../gallery/ImageGallery";
import { ImageTypeOptionsEnum } from "../../gql/graphql";
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
import { useUsageQuery } from "../common/useUsageQuery";

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
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<(string | null)[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [imageData, setImageData] = useState<Image[]>([]);
  const [shouldRefetch, setShouldRefetch] = useState(false);
  const [imageId, setImageId] = useState<string | null>(null);
  const [editedImageUrl, setEditedImageUrl] = useState<string | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [requestSubmitted, setRequestSubmitted] = useState(false);

  const [, editImage] = useMutation(ImageEditMutation);
  const { reexecuteQuery: reexecuteUsageQuery } = useUsageQuery({
    pause: true,
  });

  useEffect(() => {
    const imageParam = searchParams?.get("image");
    const imagesParam = searchParams?.get("images");

    if (imageParam) {
      setImages([imageParam]);
    } else if (imagesParam) {
      try {
        const imageIds = JSON.parse(imagesParam);
        if (Array.isArray(imageIds) && imageIds.length <= 2) {
          setImages(imageIds);
        }
      } catch {
        // Invalid JSON, ignore
      }
    }
  }, [searchParams]);

  const [firstImageResult, reexecuteFirstQuery] = useQuery({
    query: ImageByIdQuery,
    variables: { id: images[0] || "" },
    pause: !images[0],
  });

  const [secondImageResult, reexecuteSecondQuery] = useQuery({
    query: ImageByIdQuery,
    variables: { id: images[1] || "" },
    pause: !images[1],
  });

  useEffect(() => {
    if (images.length > 0) {
      reexecuteFirstQuery({ requestPolicy: "network-only" });
    }
    if (images.length > 1) {
      reexecuteSecondQuery({ requestPolicy: "network-only" });
    }
  }, [images, reexecuteFirstQuery, reexecuteSecondQuery]);

  useEffect(() => {
    const loadedImages: Image[] = [];

    if (firstImageResult.data?.node && !firstImageResult.error) {
      loadedImages.push(firstImageResult.data.node as Image);
    }

    if (secondImageResult.data?.node && !secondImageResult.error) {
      loadedImages.push(secondImageResult.data.node as Image);
    }

    setImageData(loadedImages);
  }, [
    firstImageResult.data,
    secondImageResult.data,
    firstImageResult.error,
    secondImageResult.error,
  ]);

  useEffect(() => {
    if (imageId && !editedImageUrl) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
      if (editedImageUrl) {
        setShouldRefetch(false);
        setRequestSubmitted(false);
      }
    }
  }, [imageId, editedImageUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (files.length > 2) {
      toast({
        title: "Error",
        description: t("imageEdit.maxTwoImages"),
        variant: "destructive",
      });
      return;
    }

    const totalFiles = uploadedImages.length + files.length;
    if (totalFiles > 2) {
      toast({
        title: "Error",
        description: t("imageEdit.maxTwoImages"),
        variant: "destructive",
      });
      return;
    }

    const newUploadedImages = [...uploadedImages, ...files];
    setUploadedImages(newUploadedImages);

    const newPreviewUrls = [...previewUrls];
    files.forEach((file, index) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviewUrls[uploadedImages.length + index] = reader.result as string;
        setPreviewUrls([...newPreviewUrls]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index: number) => {
    const newUploadedImages = uploadedImages.filter((_, i) => i !== index);
    const newPreviewUrls = previewUrls.filter((_, i) => i !== index);

    setUploadedImages(newUploadedImages);
    setPreviewUrls(newPreviewUrls);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveSelectedImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    const newImageData = imageData.filter((_, i) => i !== index);

    setImages(newImages);
    setImageData(newImageData);

    const newUrl = new URL(window.location.href);
    if (newImages.length === 0) {
      newUrl.searchParams.delete("image");
      newUrl.searchParams.delete("images");
    } else if (newImages.length === 1) {
      newUrl.searchParams.set("image", newImages[0]);
      newUrl.searchParams.delete("images");
    } else {
      newUrl.searchParams.delete("image");
      newUrl.searchParams.set("images", JSON.stringify(newImages));
    }
    router.push(newUrl.pathname + newUrl.search);
  };

  const handleEditImage = async () => {
    if (
      !imagePrompt.trim() ||
      (uploadedImages.length === 0 && imageData.length === 0) ||
      requestSubmitted
    )
      return;

    const totalImages = uploadedImages.length + imageData.length;
    if (totalImages > 2) {
      toast({
        title: "Error",
        description: t("imageEdit.maxTwoImages"),
        variant: "destructive",
      });
      return;
    }

    for (const file of uploadedImages) {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "Error",
          description: t("imageEdit.fileSizeExceeded"),
          variant: "destructive",
        });
        return;
      }
    }

    setIsLoading(true);
    setEditedImageUrl(null);
    setRequestSubmitted(true);

    try {
      let imageId = null;

      if (imageData.length > 0 && uploadedImages.length === 0) {
        const result = await editImage({
          input: {
            imageIds: imageData.map((img) => img.id),
            prompt: imagePrompt,
          },
        });

        imageId = result.data?.imageEdit.id;
      } else if (uploadedImages.length > 0) {
        const formData = new FormData();

        uploadedImages.forEach((file) => {
          formData.append("files", file);
        });
        formData.append("prompt", imagePrompt);
        if (imageData.length > 0) {
          formData.append("imageId", imageData[0].id);
        }

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

        if (response.data.originalImages) {
          const originalImageIds = response.data.originalImages.map(
            (img: { id: string }) => img.id
          );
          const newUrl = new URL(window.location.href);
          if (originalImageIds.length === 1) {
            newUrl.searchParams.set("image", originalImageIds[0]);
            newUrl.searchParams.delete("images");
          } else {
            newUrl.searchParams.delete("image");
            newUrl.searchParams.set("images", JSON.stringify(originalImageIds));
          }
          router.push(newUrl.pathname + newUrl.search);

          // Clear the uploaded images and previews after successful upload
          setUploadedImages([]);
          setPreviewUrls([]);
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        }
      }

      if (imageId) {
        setImageId(imageId);
      }
      reexecuteUsageQuery({
        requestPolicy: "network-only",
      });
      setShouldRefetch(true);
    } catch (error) {
      console.error("Error editing images:", error);
      toast({
        title: "Error",
        description: t("imageEdit.editingFailed"),
        variant: "destructive",
      });
      setRequestSubmitted(false);
    }
  };

  const handlePromptIdeaClick = (idea: string) => {
    setImagePrompt(idea);
  };

  const hasError = firstImageResult.error || secondImageResult.error;
  const firstError = firstImageResult.error || secondImageResult.error;

  if (hasError && firstError) {
    return <ErrorDisplay errorMessage={firstError.message} />;
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
        <SourceImageCard
          imageData={imageData}
          previewUrls={previewUrls}
          fileInputRef={fileInputRef as React.RefObject<HTMLInputElement>}
          handleFileChange={handleFileChange}
          handleRemoveImage={handleRemoveImage}
          handleRemoveSelectedImage={handleRemoveSelectedImage}
          imagePrompt={imagePrompt}
          setImagePrompt={setImagePrompt}
          isEditingImage={isLoading}
          handleEditImage={handleEditImage}
          handlePromptIdeaClick={handlePromptIdeaClick}
          uploadedImages={uploadedImages}
        />

        <EditedImageCard
          isEditingImage={isLoading}
          editedImageUrl={editedImageUrl}
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
                createdImageId={imageId}
                setCreatedImageUrl={setEditedImageUrl}
              />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
