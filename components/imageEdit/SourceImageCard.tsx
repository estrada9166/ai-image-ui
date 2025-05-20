import { ImageIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptySourceImage } from "../common/EmptySourceImage";
import { SourceImageDisplay } from "./SourceImageDisplay";
import { AiModelSelector } from "./AiModelSelector";
import { PromptIdeasSelector } from "./PromptIdeasSelector";
import { PromptInput } from "./PromptInput";
import { PromptActions } from "./PromptActions";
import { SourceImageCardProps } from "./types";

export const SourceImageCard = ({
  imageData,
  previewUrl,
  fileInputRef,
  handleFileChange,
  handleRemoveImage,
  handleRemoveSelectedImage,
  imagePrompt,
  setImagePrompt,
  isEditingImage,
  handleEditImage,
  handlePromptIdeaClick,
  uploadedImage,
  model,
  setModel,
}: SourceImageCardProps) => {
  const { t } = useTranslation();

  const handleUploadClick = () => {
    if (fileInputRef?.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <Card className="border border-purple-100 dark:border-purple-900/30 shadow-lg bg-white/95 backdrop-blur-sm dark:bg-gray-800/95 overflow-hidden hover:shadow-xl transition-all duration-300 rounded-xl">
      <CardContent className="p-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-purple-500" />
            {t("imageEdit.sourceImage")}
          </h3>
          <Badge
            variant="outline"
            className="text-sm py-1 px-2 bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800/30"
          >
            {t("imageEdit.original")}
          </Badge>
        </div>
        <div className="aspect-square relative overflow-hidden rounded-lg border border-purple-100 dark:border-purple-900/50 shadow-inner group">
          {imageData?.imageUrl || previewUrl ? (
            <SourceImageDisplay
              imageUrl={imageData?.imageUrl || previewUrl || ""}
              prompt={imageData?.prompt}
              onRemove={
                imageData ? handleRemoveSelectedImage : handleRemoveImage
              }
            />
          ) : (
            <EmptySourceImage onUploadClick={handleUploadClick} />
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

        {/* Prompt Input Below Image */}
        <div className="mt-6 space-y-5">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <AiModelSelector model={model} setModel={setModel} />
            </div>
            <div className="flex-1">
              <PromptIdeasSelector onSelectPrompt={handlePromptIdeaClick} />
            </div>
          </div>

          <PromptInput
            value={imagePrompt}
            onChange={(e) => setImagePrompt(e.target.value)}
            isDisabled={isEditingImage}
          />

          <PromptActions
            onClear={() => setImagePrompt("")}
            onEdit={handleEditImage}
            isEditing={isEditingImage}
            hasPrompt={imagePrompt.trim()}
            hasImage={!!uploadedImage || !!imageData}
          />
        </div>
      </CardContent>
    </Card>
  );
};
