"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ImageIcon } from "lucide-react";
import { ImageGallery } from "../gallery/ImageGallery";
import { ImageTypeOptionsEnum } from "../../gql/graphql";
import axios from "axios";
import { useSearchParams, useRouter } from "next/navigation";

import { useMutation, useQuery } from "urql";
import { graphql } from "../../gql";

import { ImageByIdQuery } from "../common/ImageByIdQuery";
import { useTranslation } from "react-i18next";

import { SourceImageCard } from "./SourceImageCard";
import { EditedImageCard } from "./EditedImageCard";
import { useToast } from "@/hooks/use-toast";
import { useUsageQuery } from "../common/useUsageQuery";
import { ImageWithIndex } from "../gallery/ImageGallery";

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

type SelectedImage = {
  id: string;
  imageUrl: string;
};

// Main component
export default function ImageEdit() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();

  const imageToEdit = searchParams?.get("image");

  const [imagePrompt, setImagePrompt] = useState("");
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<(string | null)[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [shouldRefetch, setShouldRefetch] = useState(false);
  const [imageId, setImageId] = useState<string | null>(null);
  const [editedImageUrl, setEditedImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [requestSubmitted, setRequestSubmitted] = useState(false);
  const [selectedImages, setSelectedImages] = useState<SelectedImage[]>([]);

  // Gallery selection state
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [gallerySelectedImages, setGallerySelectedImages] = useState<
    ImageWithIndex[]
  >([]);

  const [, editImage] = useMutation(ImageEditMutation);
  const { reexecuteQuery: reexecuteUsageQuery } = useUsageQuery({
    pause: true,
  });

  const [{ data }] = useQuery({
    query: ImageByIdQuery,
    variables: { id: imageToEdit || "" },
    pause: !imageToEdit,
  });

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

  useEffect(() => {
    if (data?.node) {
      const node = data.node;
      console.log("node", node);
      if (node.__typename === "Image" && node.id && node.imageUrl) {
        setSelectedImages((prev) => [
          ...prev,
          { id: node.id, imageUrl: node.imageUrl } as SelectedImage,
        ]);

        // cleanup the url parameter
        const url = new URL(window.location.href);
        url.searchParams.delete("image");
        router.replace(url.pathname + url.search, { scroll: false });
      }
    }
  }, [data]);

  const handleGalleryImagesSelect = (images: ImageWithIndex[]) => {
    setGallerySelectedImages(images);
  };

  const handleGalleryModalChange = (open: boolean) => {
    setShowGalleryModal(open);
    // Reset selected images when modal is closed without confirming
    if (!open) {
      setGallerySelectedImages([]);
    }
  };

  const handleConfirmGallerySelection = async () => {
    if (isLoading) return;

    setIsLoading(true);

    const remainingSlots = 2 - (selectedImages.length + uploadedImages.length);
    const imagesToAdd = gallerySelectedImages.slice(0, remainingSlots);

    if (imagesToAdd.length === 0) {
      toast({
        title: t("imageEdit.imageSelection.limitReached"),
        description: t("imageEdit.imageSelection.limitDescription"),
        variant: "destructive",
      });
      return;
    }

    try {
      // Convert gallery images to File objects for consistency
      const results = imagesToAdd.map((img) => ({
        id: img.id,
        imageUrl: img.imageUrl,
      }));

      const validResults = results.filter((result) => Boolean(result.imageUrl));

      if (validResults.length > 0) {
        // Update state synchronously to ensure the images are added
        setSelectedImages((prev) => [
          ...prev,
          ...(validResults as SelectedImage[]),
        ]);

        // Show success feedback
        if (gallerySelectedImages.length > validResults.length) {
          toast({
            title: t("imageEdit.imageSelection.someSkipped"),
            description: t("imageEdit.imageSelection.skippedDescription", {
              count: validResults.length,
            }),
            variant: "default",
          });
        } else {
          toast({
            title: t("imageEdit.imageSelection.imagesAdded"),
            description: t("imageEdit.imageSelection.imagesAddedDescription", {
              count: validResults.length,
            }),
            variant: "default",
          });
        }
      }
    } catch {
      toast({
        title: t("common.error"),
        description: t("imageEdit.imageSelection.errorProcessing"),
        variant: "destructive",
      });
    } finally {
      // Always clean up state regardless of success or failure
      setGallerySelectedImages([]);
      setShowGalleryModal(false);
      setIsLoading(false);
    }
  };

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
    const newImages = selectedImages.filter((_, i) => i !== index);

    setSelectedImages(newImages);
  };

  const handleEditImage = async () => {
    if (
      !imagePrompt.trim() ||
      (uploadedImages.length === 0 && selectedImages.length === 0) ||
      requestSubmitted
    )
      return;

    const totalImages = uploadedImages.length + selectedImages.length;
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

      if (selectedImages.length > 0 && uploadedImages.length === 0) {
        const result = await editImage({
          input: {
            imageIds: selectedImages.map((img) => img.id),
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
        if (selectedImages.length > 0) {
          selectedImages.forEach((selectedImage) => {
            formData.append("imageIds", selectedImage.id);
          });
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
          imageData={selectedImages}
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
          showGalleryModal={showGalleryModal}
          gallerySelectedImages={gallerySelectedImages}
          handleGalleryImagesSelect={handleGalleryImagesSelect}
          handleGalleryModalChange={handleGalleryModalChange}
          handleConfirmGallerySelection={handleConfirmGallerySelection}
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
