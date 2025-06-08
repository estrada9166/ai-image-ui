import { Plus, Grid, Package, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptySourceImage } from "../common/EmptySourceImage";
import { SourceImageDisplay } from "../imageEdit/SourceImageDisplay";
import { motion } from "framer-motion";
import { GallerySelectionModal } from "../common/GallerySelectionModal";
import { SelectedImage } from "../imageEdit/types";
import { ImageWithIndex } from "../gallery/ImageGallery";

export interface ProductImageCardProps {
  imageData: SelectedImage[];
  previewUrls: (string | null)[];
  fileInputRef: React.RefObject<HTMLInputElement> | null;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveImage: (index: number) => void;
  handleRemoveSelectedImage: (index: number) => void;
  isProcessing: boolean;
  uploadedImages: File[];
  showGalleryModal: boolean;
  gallerySelectedImages: ImageWithIndex[];
  handleGalleryImagesSelect: (images: ImageWithIndex[]) => void;
  handleGalleryModalChange: (open: boolean) => void;
  handleConfirmGallerySelection: () => Promise<void>;
  onVirtualTryOn: () => void;
  hasModelImage: boolean;
  hasProductImage: boolean;
}

export const ProductImageCard = ({
  imageData,
  previewUrls,
  fileInputRef,
  handleFileChange,
  handleRemoveImage,
  handleRemoveSelectedImage,
  isProcessing,
  uploadedImages,
  showGalleryModal,
  gallerySelectedImages,
  handleGalleryImagesSelect,
  handleGalleryModalChange,
  handleConfirmGallerySelection,
  onVirtualTryOn,
  hasModelImage,
  hasProductImage,
}: ProductImageCardProps) => {
  const { t } = useTranslation();

  const totalImages = imageData.length + uploadedImages.length;

  // Combine stored and uploaded images
  const allImages = [
    ...imageData.map((img, index) => ({
      imageUrl: img.imageUrl || "",
      type: "stored" as const,
      index,
    })),
    ...uploadedImages.map((_, index) => ({
      imageUrl: previewUrls[index] || "",
      prompt: null,
      type: "uploaded" as const,
      index: imageData.length + index,
    })),
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl mx-auto"
    >
      <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border border-green-100/30 dark:border-green-800/30 shadow-xl overflow-hidden h-full">
        <CardContent className="p-6 lg:p-8">
          {/* Header */}
          <div className="flex items-center gap-x-2 mb-6">
            <div className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-md">
              <Package className="h-4 w-4 text-white" />
            </div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              {t("virtualTryOn.productImage")}
            </h2>
          </div>

          {/* Image Display */}
          <div className="mb-6 relative">
            {allImages.length > 0 ? (
              <div className="max-w-md mx-auto">
                <div className="aspect-[4/3] rounded-xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border border-green-100/30 dark:border-green-800/30 shadow-sm">
                  <SourceImageDisplay
                    imageUrl={allImages[0].imageUrl}
                    onRemove={() => {
                      if (allImages[0].type === "stored") {
                        handleRemoveSelectedImage(allImages[0].index);
                      } else {
                        handleRemoveImage(
                          allImages[0].index - imageData.length
                        );
                      }
                    }}
                    index={0}
                  />
                </div>
              </div>
            ) : (
              <div className="aspect-[4/3] max-w-md mx-auto rounded-xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border border-green-100/30 dark:border-green-800/30">
                <EmptySourceImage />
              </div>
            )}
          </div>

          <input
            id="product-image-upload"
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
          />

          {/* Upload Button */}
          {totalImages < 1 && (
            <div className="mb-6 text-center space-y-3">
              <div className="flex flex-col gap-3 justify-center items-center">
                <Button
                  onClick={() => {
                    if (fileInputRef?.current) {
                      fileInputRef.current.click();
                    }
                  }}
                  variant="outline"
                  className="group border-2 border-dashed border-green-300 dark:border-green-700 text-green-700 dark:text-green-300 hover:border-green-500 dark:hover:border-green-600 rounded-xl py-3 px-6 transition-all"
                  disabled={isProcessing}
                >
                  <Plus className="h-4 w-4 mr-2 group-hover:rotate-90 transition-transform" />
                  <span>{t("virtualTryOn.uploadProductImage")}</span>
                </Button>

                <GallerySelectionModal
                  open={showGalleryModal}
                  onOpenChange={handleGalleryModalChange}
                  selectedImages={gallerySelectedImages}
                  onImagesSelect={handleGalleryImagesSelect}
                  onConfirmSelection={handleConfirmGallerySelection}
                  maxImages={1}
                  trigger={
                    <Button
                      variant="outline"
                      className="group border-2 border-dashed border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 hover:border-emerald-500 dark:hover:border-emerald-600 rounded-xl py-3 px-6 transition-all"
                      disabled={isProcessing}
                    >
                      <Grid className="h-4 w-4 mr-2" />
                      <span>{t("virtualTryOn.selectProductFromGallery")}</span>
                    </Button>
                  }
                />
              </div>

              <div className="text-xs text-gray-500 dark:text-gray-400">
                <span className="inline-flex items-center justify-center bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 rounded-full w-6 h-6 text-xs font-bold mr-2">
                  {totalImages}/1
                </span>
                {t("virtualTryOn.productImageSelected")}
              </div>
            </div>
          )}

          {/* Description */}
          <div className="bg-green-50/70 dark:bg-green-900/20 rounded-xl p-4 border border-green-100/30 dark:border-green-800/30 mb-6">
            <p className="text-sm text-green-700 dark:text-green-300 text-center">
              {t("virtualTryOn.productImageDescription")}
            </p>
          </div>

          {/* Virtual Try On Button */}
          <div className="space-y-4">
            <Button
              onClick={onVirtualTryOn}
              disabled={!hasModelImage || !hasProductImage || isProcessing}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl py-3 px-6 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Sparkles className="h-5 w-5 mr-2" />
              {isProcessing
                ? t("virtualTryOn.processing")
                : t("virtualTryOn.startTryOn")}
            </Button>

            {(!hasModelImage || !hasProductImage) && (
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                {t("virtualTryOn.bothImagesNeeded")}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
