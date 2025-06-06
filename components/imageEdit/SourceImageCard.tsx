import { ImageIcon, Plus, Grid } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptySourceImage } from "../common/EmptySourceImage";
import { SourceImageDisplay } from "./SourceImageDisplay";
import { PromptIdeasSelector } from "./PromptIdeasSelector";
import { PromptInput } from "./PromptInput";
import { PromptActions } from "./PromptActions";
import { SourceImageCardProps } from "./types";
import { motion } from "framer-motion";
import { GallerySelectionModal } from "../common/GallerySelectionModal";

export const SourceImageCard = ({
  imageData,
  previewUrls,
  fileInputRef,
  handleFileChange,
  handleRemoveImage,
  handleRemoveSelectedImage,
  imagePrompt,
  setImagePrompt,
  isEditingImage,
  handleEditImage,
  handlePromptIdeaClick,
  uploadedImages,
  showGalleryModal,
  gallerySelectedImages,
  handleGalleryImagesSelect,
  handleGalleryModalChange,
  handleConfirmGallerySelection,
}: SourceImageCardProps) => {
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
      <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border border-purple-100/30 dark:border-purple-800/30 shadow-xl overflow-hidden">
        <CardContent className="p-6 lg:p-8">
          {/* Header */}
          <div className="flex items-center gap-x-2 mb-6">
            <div className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl shadow-md">
              <ImageIcon className="h-4 w-4 text-white" />
            </div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              {t("imageEdit.sourceImages")}
            </h2>
          </div>

          {/* Image Display */}
          <div className="mb-6 relative">
            {allImages.length > 0 ? (
              <div
                className={`grid ${
                  allImages.length > 1 ? "grid-cols-2 gap-3" : "grid-cols-1"
                } max-w-md mx-auto`}
              >
                {allImages.map((image, index) => (
                  <div
                    key={index}
                    className="aspect-[4/3] rounded-xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border border-purple-100/30 dark:border-purple-800/30 shadow-sm"
                  >
                    <SourceImageDisplay
                      imageUrl={image.imageUrl}
                      onRemove={() => {
                        if (image.type === "stored") {
                          handleRemoveSelectedImage(image.index);
                        } else {
                          handleRemoveImage(image.index - imageData.length);
                        }
                      }}
                      index={index}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="aspect-[4/3] max-w-md mx-auto rounded-xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border border-purple-100/30 dark:border-purple-800/30">
                <EmptySourceImage />
              </div>
            )}
          </div>

          <input
            id="image-upload"
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
          />

          {/* Upload Button */}
          {imageData.length + uploadedImages.length < 2 && (
            <div className="mb-6 text-center space-y-3">
              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                <Button
                  onClick={() => {
                    if (fileInputRef?.current) {
                      fileInputRef.current.click();
                    }
                  }}
                  variant="outline"
                  className="group border-2 border-dashed border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-300 hover:border-purple-500 dark:hover:border-purple-600 rounded-xl py-3 px-6 transition-all"
                  disabled={isEditingImage}
                >
                  <Plus className="h-4 w-4 mr-2 group-hover:rotate-90 transition-transform" />
                  <span>{t("imageEdit.uploadImages")}</span>
                </Button>

                <GallerySelectionModal
                  open={showGalleryModal}
                  onOpenChange={handleGalleryModalChange}
                  selectedImages={gallerySelectedImages}
                  onImagesSelect={handleGalleryImagesSelect}
                  onConfirmSelection={handleConfirmGallerySelection}
                  maxImages={2}
                  trigger={
                    <Button
                      variant="outline"
                      className="group border-2 border-dashed border-indigo-300 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300 hover:border-indigo-500 dark:hover:border-indigo-600 rounded-xl py-3 px-6 transition-all"
                      disabled={isEditingImage}
                    >
                      <Grid className="h-4 w-4 mr-2" />
                      <span>{t("imageEdit.selectFromGallery")}</span>
                    </Button>
                  }
                />
              </div>

              <div className="text-xs text-gray-500 dark:text-gray-400">
                <span className="inline-flex items-center justify-center bg-purple-100 dark:bg-purple-800 text-purple-800 dark:text-purple-200 rounded-full w-6 h-6 text-xs font-bold mr-2">
                  {imageData.length + uploadedImages.length}/2
                </span>
                {t("imageEdit.imagesSelected")}
              </div>
            </div>
          )}

          {/* Prompt Section */}
          <div className="space-y-4">
            {/* Prompt Ideas */}
            <div className="bg-white/70 dark:bg-gray-800/70 rounded-xl p-4 border border-purple-100/30 dark:border-purple-800/30">
              <PromptIdeasSelector onSelectPrompt={handlePromptIdeaClick} />
            </div>

            {/* Prompt Input */}
            <div className="bg-white/70 dark:bg-gray-800/70 rounded-xl p-4 border border-purple-100/30 dark:border-purple-800/30">
              <PromptInput
                value={imagePrompt}
                onChange={(e) => setImagePrompt(e.target.value)}
                isDisabled={isEditingImage}
              />
            </div>

            {/* Actions */}
            <PromptActions
              onClear={() => setImagePrompt("")}
              onEdit={handleEditImage}
              isEditing={isEditingImage}
              hasPrompt={imagePrompt.trim()}
              hasImage={totalImages > 0}
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
