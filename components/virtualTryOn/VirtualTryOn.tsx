"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ImageIcon } from "lucide-react";
import { ImageGallery } from "../gallery/ImageGallery";
import { ImageTypeOptionsEnum } from "../../gql/graphql";
import axios from "axios";
import { useMutation } from "urql";
import { graphql } from "../../gql";

import { useTranslation } from "react-i18next";

import { ModelImageCard } from "./ModelImageCard";
import { ProductImageCard } from "./ProductImageCard";
import { EditedImageCard } from "../imageEdit/EditedImageCard";
import { useToast } from "@/hooks/use-toast";
import { useUsageQuery } from "../common/useUsageQuery";
import { ImageWithIndex } from "../gallery/ImageGallery";

const VirtualTryOnMutation = graphql(/* GraphQL */ `
  mutation VirtualTryOn($input: VirtualTryOnInput!) {
    virtualTryOn(input: $input) {
      id
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
export default function VirtualTryOn() {
  const { t } = useTranslation();
  const { toast } = useToast();

  // Model image states
  const [modelUploadedImages, setModelUploadedImages] = useState<File[]>([]);
  const [modelPreviewUrls, setModelPreviewUrls] = useState<(string | null)[]>(
    []
  );
  const [selectedModelImages, setSelectedModelImages] = useState<
    SelectedImage[]
  >([]);
  const modelFileInputRef = useRef<HTMLInputElement | null>(null);

  // Product image states
  const [productUploadedImages, setProductUploadedImages] = useState<File[]>(
    []
  );
  const [productPreviewUrls, setProductPreviewUrls] = useState<
    (string | null)[]
  >([]);
  const [selectedProductImages, setSelectedProductImages] = useState<
    SelectedImage[]
  >([]);
  const productFileInputRef = useRef<HTMLInputElement | null>(null);

  // Common states
  const [shouldRefetch, setShouldRefetch] = useState(false);
  const [imageId, setImageId] = useState<string | null>(null);
  const [editedImageUrl, setEditedImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [requestSubmitted, setRequestSubmitted] = useState(false);

  // Gallery selection states
  const [showModelGalleryModal, setShowModelGalleryModal] = useState(false);
  const [modelGallerySelectedImages, setModelGallerySelectedImages] = useState<
    ImageWithIndex[]
  >([]);
  const [showProductGalleryModal, setShowProductGalleryModal] = useState(false);
  const [productGallerySelectedImages, setProductGallerySelectedImages] =
    useState<ImageWithIndex[]>([]);

  const [, tryOnImage] = useMutation(VirtualTryOnMutation);
  const { reexecuteQuery: reexecuteUsageQuery } = useUsageQuery();

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

  // Model image handlers
  const handleModelGalleryImagesSelect = (images: ImageWithIndex[]) => {
    if (isLoading) return;
    setModelGallerySelectedImages(images);
  };

  const handleModelGalleryModalChange = (open: boolean) => {
    if (isLoading) return;
    setShowModelGalleryModal(open);
    if (!open) {
      setModelGallerySelectedImages([]);
    }
  };

  const handleConfirmModelGallerySelection = async () => {
    if (isLoading) return;

    setIsLoading(true);
    const remainingSlots =
      1 - (selectedModelImages.length + modelUploadedImages.length);
    const imagesToAdd = modelGallerySelectedImages.slice(0, remainingSlots);

    if (imagesToAdd.length === 0) {
      toast({
        title: t("virtualTryOn.modelSelection.limitReached"),
        description: t("virtualTryOn.modelSelection.limitDescription"),
        variant: "destructive",
      });
      return;
    }

    try {
      const results = imagesToAdd.map((img) => ({
        id: img.id,
        imageUrl: img.imageUrl,
      }));

      const validResults = results.filter((result) => Boolean(result.imageUrl));

      if (validResults.length > 0) {
        setSelectedModelImages((prev) => [
          ...prev,
          ...(validResults as SelectedImage[]),
        ]);

        toast({
          title: t("virtualTryOn.modelSelection.imageAdded"),
          description: t("virtualTryOn.modelSelection.imageAddedDescription"),
          variant: "default",
        });
      }
    } catch {
      toast({
        title: t("common.error"),
        description: t("virtualTryOn.modelSelection.errorProcessing"),
        variant: "destructive",
      });
    } finally {
      setModelGallerySelectedImages([]);
      setShowModelGalleryModal(false);
      setIsLoading(false);
    }
  };

  // Product image handlers
  const handleProductGalleryImagesSelect = (images: ImageWithIndex[]) => {
    if (isLoading) return;
    setProductGallerySelectedImages(images);
  };

  const handleProductGalleryModalChange = (open: boolean) => {
    if (isLoading) return;
    setShowProductGalleryModal(open);
    if (!open) {
      setProductGallerySelectedImages([]);
    }
  };

  const handleConfirmProductGallerySelection = async () => {
    if (isLoading) return;

    setIsLoading(true);
    const remainingSlots =
      1 - (selectedProductImages.length + productUploadedImages.length);
    const imagesToAdd = productGallerySelectedImages.slice(0, remainingSlots);

    if (imagesToAdd.length === 0) {
      toast({
        title: t("virtualTryOn.productSelection.limitReached"),
        description: t("virtualTryOn.productSelection.limitDescription"),
        variant: "destructive",
      });
      return;
    }

    try {
      const results = imagesToAdd.map((img) => ({
        id: img.id,
        imageUrl: img.imageUrl,
      }));

      const validResults = results.filter((result) => Boolean(result.imageUrl));

      if (validResults.length > 0) {
        setSelectedProductImages((prev) => [
          ...prev,
          ...(validResults as SelectedImage[]),
        ]);

        toast({
          title: t("virtualTryOn.productSelection.imageAdded"),
          description: t("virtualTryOn.productSelection.imageAddedDescription"),
          variant: "default",
        });
      }
    } catch {
      toast({
        title: t("common.error"),
        description: t("virtualTryOn.productSelection.errorProcessing"),
        variant: "destructive",
      });
    } finally {
      setProductGallerySelectedImages([]);
      setShowProductGalleryModal(false);
      setIsLoading(false);
    }
  };

  const handleModelFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isLoading) return;

    const files = Array.from(e.target.files || []);
    if (files.length > 1 || modelUploadedImages.length + files.length > 1) {
      toast({
        title: "Error",
        description: t("virtualTryOn.maxOneModelImage"),
        variant: "destructive",
      });
      return;
    }

    const newUploadedImages = [...modelUploadedImages, ...files];
    setModelUploadedImages(newUploadedImages);

    const newPreviewUrls = [...modelPreviewUrls];
    files.forEach((file, index) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviewUrls[modelUploadedImages.length + index] =
          reader.result as string;
        setModelPreviewUrls([...newPreviewUrls]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleProductFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isLoading) return;

    const files = Array.from(e.target.files || []);
    if (files.length > 1 || productUploadedImages.length + files.length > 1) {
      toast({
        title: "Error",
        description: t("virtualTryOn.maxOneProductImage"),
        variant: "destructive",
      });
      return;
    }

    const newUploadedImages = [...productUploadedImages, ...files];
    setProductUploadedImages(newUploadedImages);

    const newPreviewUrls = [...productPreviewUrls];
    files.forEach((file, index) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviewUrls[productUploadedImages.length + index] =
          reader.result as string;
        setProductPreviewUrls([...newPreviewUrls]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveModelImage = (index: number) => {
    if (isLoading) return;

    const newUploadedImages = modelUploadedImages.filter((_, i) => i !== index);
    const newPreviewUrls = modelPreviewUrls.filter((_, i) => i !== index);

    setModelUploadedImages(newUploadedImages);
    setModelPreviewUrls(newPreviewUrls);

    if (modelFileInputRef.current) {
      modelFileInputRef.current.value = "";
    }
  };

  const handleRemoveSelectedModelImage = (index: number) => {
    if (isLoading) return;
    const newImages = selectedModelImages.filter((_, i) => i !== index);
    setSelectedModelImages(newImages);
  };

  const handleRemoveProductImage = (index: number) => {
    if (isLoading) return;

    const newUploadedImages = productUploadedImages.filter(
      (_, i) => i !== index
    );
    const newPreviewUrls = productPreviewUrls.filter((_, i) => i !== index);

    setProductUploadedImages(newUploadedImages);
    setProductPreviewUrls(newPreviewUrls);

    if (productFileInputRef.current) {
      productFileInputRef.current.value = "";
    }
  };

  const handleRemoveSelectedProductImage = (index: number) => {
    if (isLoading) return;
    const newImages = selectedProductImages.filter((_, i) => i !== index);
    setSelectedProductImages(newImages);
  };

  const handleVirtualTryOn = async () => {
    if (isLoading) return;

    const hasModelImage =
      modelUploadedImages.length > 0 || selectedModelImages.length > 0;
    const hasProductImage =
      productUploadedImages.length > 0 || selectedProductImages.length > 0;

    if (!hasModelImage || !hasProductImage || requestSubmitted) {
      toast({
        title: "Error",
        description: t("virtualTryOn.bothImagesRequired"),
        variant: "destructive",
      });
      return;
    }

    // Check file sizes
    for (const file of [...modelUploadedImages, ...productUploadedImages]) {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "Error",
          description: t("virtualTryOn.fileSizeExceeded"),
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

      // If only selected images (no uploads)
      if (
        selectedModelImages.length > 0 &&
        selectedProductImages.length > 0 &&
        modelUploadedImages.length === 0 &&
        productUploadedImages.length === 0
      ) {
        const result = await tryOnImage({
          input: {
            modelImageId: selectedModelImages[0].id,
            productImageId: selectedProductImages[0].id,
          },
        });

        imageId = result.data?.virtualTryOn.id;
      } else {
        // Handle uploads with FormData
        const formData = new FormData();

        if (modelUploadedImages.length > 0) {
          formData.append("modelImage", modelUploadedImages[0]);
        } else if (selectedModelImages.length > 0) {
          formData.append("modelImageId", selectedModelImages[0].id);
        }

        if (productUploadedImages.length > 0) {
          formData.append("productImage", productUploadedImages[0]);
        } else if (selectedProductImages.length > 0) {
          formData.append("productImageId", selectedProductImages[0].id);
        }

        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/upload/virtual-try-on`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
          }
        );

        imageId = response.data.id;
      }

      if (imageId) {
        setImageId(imageId);
      }
      reexecuteUsageQuery({
        requestPolicy: "network-only",
      });
      setShouldRefetch(true);
    } catch (error) {
      console.error("Error processing virtual try on:", error);
      toast({
        title: "Error",
        description: t("virtualTryOn.processingFailed"),
        variant: "destructive",
      });
      setRequestSubmitted(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
        {t("virtualTryOn.virtualTryOn")}
      </h1>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        <ModelImageCard
          imageData={selectedModelImages}
          previewUrls={modelPreviewUrls}
          fileInputRef={modelFileInputRef as React.RefObject<HTMLInputElement>}
          handleFileChange={handleModelFileChange}
          handleRemoveImage={handleRemoveModelImage}
          handleRemoveSelectedImage={handleRemoveSelectedModelImage}
          isProcessing={isLoading}
          uploadedImages={modelUploadedImages}
          showGalleryModal={showModelGalleryModal}
          gallerySelectedImages={modelGallerySelectedImages}
          handleGalleryImagesSelect={handleModelGalleryImagesSelect}
          handleGalleryModalChange={handleModelGalleryModalChange}
          handleConfirmGallerySelection={handleConfirmModelGallerySelection}
        />

        <ProductImageCard
          imageData={selectedProductImages}
          previewUrls={productPreviewUrls}
          fileInputRef={
            productFileInputRef as React.RefObject<HTMLInputElement>
          }
          handleFileChange={handleProductFileChange}
          handleRemoveImage={handleRemoveProductImage}
          handleRemoveSelectedImage={handleRemoveSelectedProductImage}
          isProcessing={isLoading}
          uploadedImages={productUploadedImages}
          showGalleryModal={showProductGalleryModal}
          gallerySelectedImages={productGallerySelectedImages}
          handleGalleryImagesSelect={handleProductGalleryImagesSelect}
          handleGalleryModalChange={handleProductGalleryModalChange}
          handleConfirmGallerySelection={handleConfirmProductGallerySelection}
          onVirtualTryOn={handleVirtualTryOn}
          hasModelImage={
            modelUploadedImages.length > 0 || selectedModelImages.length > 0
          }
          hasProductImage={
            productUploadedImages.length > 0 || selectedProductImages.length > 0
          }
        />

        <EditedImageCard
          isEditingImage={isLoading}
          editedImageUrl={editedImageUrl}
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
              {t("virtualTryOn.yourResults")}
              <span className="text-sm text-gray-500 dark:text-gray-400 font-normal"></span>
            </h3>

            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-violet-100 dark:border-violet-900/30">
              <ImageGallery
                type={[ImageTypeOptionsEnum.VirtualTryOn]}
                shouldRefetch={shouldRefetch}
                showPrompt={false}
                loadPartialGallery
                tab="virtual-try-on"
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
