"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "../ui/textarea";
import { Send, Upload, Grid, Plus, Edit, Video } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GallerySelectionModal } from "../common/GallerySelectionModal";
import { ImageWithIndex } from "../gallery/ImageGallery";
import { useTranslation } from "react-i18next";
import ChatSettings from "./ChatSettings";

interface MessageInputProps {
  input: string;
  negativePrompt: string;
  imageAction: string;
  showNegativePrompt: boolean;
  isLoading: boolean;
  hasPendingMessages: boolean;
  selectedImagesCount: number;
  showGalleryModal: boolean;
  onInputChange: (value: string) => void;
  onNegativePromptChange: (value: string) => void;
  onImageActionChange: (value: string) => void;
  onShowNegativePromptToggle: () => void;
  onSendMessage: () => void;
  onUploadClick: () => void;
  onGalleryModalToggle: (open: boolean) => void;
  gallerySelectedImages: ImageWithIndex[];
  onGalleryImagesSelect: (images: ImageWithIndex[]) => void;
  onConfirmGallerySelection: () => void;
  cameraType: string;
  aspectRatio: string;
  aiModel: string;
  setCameraType: (type: string) => void;
  setAspectRatio: (ratio: string) => void;
  setAiModel: (model: string) => void;
}

export default function MessageInput({
  input,
  negativePrompt,
  imageAction,
  showNegativePrompt,
  isLoading,
  hasPendingMessages,
  selectedImagesCount,
  showGalleryModal,
  onInputChange,
  onNegativePromptChange,
  onImageActionChange,
  onShowNegativePromptToggle,
  onSendMessage,
  onUploadClick,
  onGalleryModalToggle,
  gallerySelectedImages,
  onGalleryImagesSelect,
  onConfirmGallerySelection,
  cameraType,
  aspectRatio,
  aiModel,
  setCameraType,
  setAspectRatio,
  setAiModel,
}: MessageInputProps) {
  const { t } = useTranslation();

  const getPlaceholder = () => {
    switch (imageAction) {
      case "create":
        return t("chat.placeholders.createImage");
      case "edit":
        return t("chat.placeholders.editImage");
      default:
        return t("chat.placeholders.createVideo");
    }
  };

  const isDisabled =
    isLoading ||
    hasPendingMessages ||
    (imageAction !== "create" && selectedImagesCount === 0);

  const isSendDisabled =
    isDisabled || (!input.trim() && selectedImagesCount === 0);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-2 sm:p-3 max-w-full mx-auto">
      {imageAction === "create" && (
        <ChatSettings
          cameraType={cameraType}
          aspectRatio={aspectRatio}
          aiModel={aiModel}
          onCameraTypeChange={setCameraType}
          onAspectRatioChange={setAspectRatio}
          onAiModelChange={setAiModel}
        />
      )}

      <div className="space-y-3">
        {/* Main input row */}
        <div className="flex items-start gap-2 sm:gap-3">
          {/* Upload and Gallery buttons */}
          <div className="flex gap-1 sm:gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onUploadClick}
              disabled={
                isLoading || selectedImagesCount >= 4 || hasPendingMessages
              }
              className="h-9 w-9 sm:h-9 sm:w-9 p-0 border-gray-300 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
              title="Upload images"
            >
              <Upload className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600 dark:text-gray-400" />
            </Button>

            <GallerySelectionModal
              open={showGalleryModal}
              onOpenChange={onGalleryModalToggle}
              selectedImages={gallerySelectedImages}
              onImagesSelect={onGalleryImagesSelect}
              onConfirmSelection={onConfirmGallerySelection}
              trigger={
                <Button
                  variant="outline"
                  size="sm"
                  disabled={
                    isLoading || selectedImagesCount >= 4 || hasPendingMessages
                  }
                  className="h-9 w-9 sm:h-9 sm:w-9 p-0 border-gray-300 hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
                  title="Browse gallery"
                >
                  <Grid className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600 dark:text-gray-400" />
                </Button>
              }
            />
          </div>

          {/* Action selector */}
          <Select value={imageAction} onValueChange={onImageActionChange}>
            <SelectTrigger className="w-[120px] h-9 border-gray-300 focus:border-blue-400 text-sm">
              <SelectValue placeholder="Action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem
                value="create"
                className="text-sm"
                disabled={selectedImagesCount > 0}
              >
                <div className="flex items-center">
                  <Plus className="h-3 w-3 mr-2" />
                  <span>{t("chat.buttons.create")}</span>
                </div>
              </SelectItem>
              <SelectItem
                value="edit"
                className="text-sm"
                disabled={selectedImagesCount > 2}
              >
                <div className="flex items-center">
                  <Edit className="h-3 w-3 mr-2" />
                  <span>{t("chat.buttons.edit")}</span>
                </div>
              </SelectItem>
              <SelectItem value="video" className="text-sm">
                <div className="flex items-center">
                  <Video className="h-3 w-3 mr-2" />
                  <span>{t("chat.buttons.video")}</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>

          {/* Input area */}
          <div className="flex-1">
            <Textarea
              placeholder={getPlaceholder()}
              value={input}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                onInputChange(e.target.value)
              }
              disabled={isDisabled}
              className="h-9 border-gray-300 focus:border-blue-400 text-sm"
              onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  onSendMessage();
                }
              }}
            />
            {/* Message when edit/video selected but no images */}
            {(imageAction === "edit" || imageAction === "video") &&
              selectedImagesCount === 0 && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 px-2">
                  {t("chat.instructions.selectImagesFirst", {
                    mode: imageAction,
                  })}
                </p>
              )}
          </div>

          {/* Send button */}
          <Button
            onClick={onSendMessage}
            disabled={isSendDisabled}
            size="sm"
            className={`h-9 w-9 sm:h-9 sm:w-9 p-0 flex-shrink-0 ${
              isSendDisabled
                ? "bg-gray-300 dark:bg-gray-700"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isLoading || hasPendingMessages ? (
              <div className="h-3 w-3 sm:h-4 sm:w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
            )}
          </Button>
        </div>

        {/* Video options */}
        {imageAction === "video" && (
          <div className="space-y-2">
            {/* Show More button for negative prompt */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onShowNegativePromptToggle}
              className="h-7 px-2 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            >
              {showNegativePrompt
                ? t("chat.videoOptions.hideOptions")
                : t("chat.videoOptions.showMoreOptions")}
              <svg
                className={`ml-1 h-3 w-3 transition-transform ${
                  showNegativePrompt ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </Button>

            {/* Negative prompt input - only show when toggled */}
            {showNegativePrompt && (
              <Input
                placeholder={t("chat.placeholders.negativePrompt")}
                value={negativePrompt}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  onNegativePromptChange(e.target.value)
                }
                disabled={
                  isLoading || hasPendingMessages || selectedImagesCount === 0
                }
                className="w-full h-8 sm:h-8 border-purple-300 focus:border-purple-400 text-sm"
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    onSendMessage();
                  }
                }}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
