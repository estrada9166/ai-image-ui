"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ImageIcon,
  Wand2,
  Sparkles,
  RefreshCw,
  X,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { ImageGallery } from "../gallery/ImageGallery";
import { AiModelOptionsEnum, ImageTypeOptionsEnum } from "../../gql/graphql";
import axios from "axios";
import { useSearchParams, useRouter } from "next/navigation";

import { useMutation, useQuery } from "urql";
import { Image, ImageByIdQuery as ImageByIdQueryType } from "../../gql/graphql";
import { Badge } from "@/components/ui/badge";
import { graphql } from "../../gql";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { promptIdeas } from "./promptIdeas";
import { EmptySourceImage } from "../common/EmptySourceImage";
import { ImageByIdQuery } from "../common/ImageByIdQuery";
import { useTranslation } from "react-i18next";

type ImageEdit = {
  id: string;
  prompt?: string | null;
  status: string;
  imageUrl?: string | null;
};

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

// Error component for displaying error messages
const ErrorDisplay = ({ errorMessage }: { errorMessage: string }) => {
  const { t } = useTranslation();
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
          {t("imageEdit.errorLoadingImage")}
        </h3>
        <p className="text-red-600 dark:text-red-300 text-center mb-6">
          {errorMessage}
        </p>
        <div className="flex justify-center">
          <Button
            variant="outline"
            className="border-red-200 text-red-700 hover:bg-red-50 dark:border-red-800/30 dark:text-red-400 dark:hover:bg-red-900/20"
            onClick={() => window.history.back()}
          >
            {t("imageEdit.goBack")}
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

// Component for prompt ideas selection
const PromptIdeasSelector = ({
  onSelectPrompt,
}: {
  onSelectPrompt: (prompt: string) => void;
}) => {
  const { t } = useTranslation();
  return (
    <div className="space-y-3">
      <h3 className="text-base font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-purple-500" />
        {t("imageEdit.promptIdeas")}
      </h3>
      <Select
        value=""
        onValueChange={(value) => {
          if (value) onSelectPrompt(value);
        }}
      >
        <SelectTrigger className="border-purple-100 dark:border-purple-900/50 focus:border-purple-300 focus:ring-purple-500 text-sm">
          <SelectValue placeholder={t("imageEdit.promptIdeaPlaceholder")} />
        </SelectTrigger>
        <SelectContent>
          {promptIdeas(t).map((idea) => (
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
  );
};

// Component for prompt ideas selection
const AiModelSelector = ({
  model,
  setModel,
}: {
  model: AiModelOptionsEnum;
  setModel: (model: AiModelOptionsEnum) => void;
}) => {
  const { t } = useTranslation();
  return (
    <div className="space-y-3">
      <h3 className="text-base font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
        <Wand2 className="h-5 w-5 text-purple-500" />
        {t("imageEdit.aiModel")}
      </h3>
      <Select value={model} onValueChange={setModel as (value: string) => void}>
        <SelectTrigger className="border-purple-100 dark:border-purple-900/50 focus:border-purple-300 focus:ring-purple-500 text-sm rounded-lg shadow-sm hover:border-purple-200 transition-all">
          <SelectValue placeholder="Select model" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={AiModelOptionsEnum.Model_1}>
            {t("imageEdit.model1")}
          </SelectItem>
          <SelectItem value={AiModelOptionsEnum.Model_2}>
            {t("imageEdit.model2")}
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

// Component for prompt input
interface PromptInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  isDisabled: boolean;
}

const PromptInput = ({ value, onChange, isDisabled }: PromptInputProps) => {
  const { t } = useTranslation();
  return (
    <div className="space-y-3">
      <h3 className="text-base font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-purple-500" />
        {t("imageEdit.editInstructions")}
      </h3>
      <Textarea
        placeholder={t("imageEdit.editInstructionsPlaceholder")}
        className="min-h-[100px] text-base resize-none border-purple-100 dark:border-purple-900/50 focus:border-purple-300 focus:ring-purple-500 transition-colors duration-200 rounded-lg"
        value={value}
        onChange={onChange}
        disabled={isDisabled}
      />
    </div>
  );
};

// Component for prompt action buttons
interface PromptActionsProps {
  onClear: () => void;
  onEdit: () => void;
  isEditing: boolean;
  hasPrompt: string | boolean;
  hasImage: boolean;
}

const PromptActions = ({
  onClear,
  onEdit,
  isEditing,
  hasPrompt,
  hasImage,
}: PromptActionsProps) => {
  const { t } = useTranslation();
  return (
    <div className="flex justify-end gap-3 pt-2">
      <Button
        variant="outline"
        onClick={onClear}
        disabled={!hasPrompt || isEditing}
        className="text-sm border-purple-200 text-purple-700 hover:bg-purple-50 dark:border-purple-900/30 dark:text-purple-400 dark:hover:bg-purple-900/20 transition-colors duration-200 rounded-full"
      >
        <RefreshCw className="mr-2 h-4 w-4" />
        {t("imageEdit.clear")}
      </Button>
      <Button
        onClick={onEdit}
        disabled={isEditing || !hasPrompt || !hasImage}
        className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all duration-300 rounded-full"
      >
        {isEditing ? (
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
            {t("imageEdit.editing")}
          </>
        ) : (
          <>
            <Wand2 className="mr-2 h-4 w-4" />
            {t("imageEdit.editImage")}
          </>
        )}
      </Button>
    </div>
  );
};

// Component for source image display
interface SourceImageDisplayProps {
  imageUrl: string;
  prompt?: string | null;
  onRemove: () => void;
}

const SourceImageDisplay = ({
  imageUrl,
  prompt,
  onRemove,
}: SourceImageDisplayProps) => (
  <div className="relative group h-full">
    <img
      src={imageUrl}
      alt="Selected image"
      className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
    />
    <button
      onClick={onRemove}
      className="absolute top-2 right-2 bg-black/60 text-white p-1.5 rounded-full opacity-100 transition-opacity duration-200 hover:bg-black/80"
      title="Remove image"
    >
      <X className="h-4 w-4" />
    </button>
    {prompt && (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 text-white text-sm truncate cursor-help">
              {prompt}
            </div>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs bg-gray-900/95 text-white border-purple-500/20 backdrop-blur-md">
            <p>{prompt}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )}
  </div>
);

// Component for source image card
interface SourceImageCardProps {
  imageData: Image | null;
  previewUrl: string | null;
  fileInputRef: React.RefObject<HTMLInputElement> | null;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveImage: () => void;
  handleRemoveSelectedImage: () => void;
  imagePrompt: string;
  setImagePrompt: React.Dispatch<React.SetStateAction<string>>;
  isEditingImage: boolean;
  handleEditImage: () => void;
  handlePromptIdeaClick: (idea: string) => void;
  uploadedImage: File | null;
  model: AiModelOptionsEnum;
  setModel: React.Dispatch<React.SetStateAction<AiModelOptionsEnum>>;
}

const SourceImageCard = ({
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

// Component for processing state in edited image
const ProcessingEditedImage = () => {
  const { t } = useTranslation();
  return (
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
        {t("imageEdit.editingImage")}
      </p>
      <div className="max-w-md">
        <p className="text-base text-gray-500 dark:text-gray-400">
          {t("imageEdit.transformingImage")}
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
  );
};

// Component for displaying edited image
interface EditedImageDisplayProps {
  imageUrl: string | null | undefined;
}

const EditedImageDisplay = ({ imageUrl }: EditedImageDisplayProps) => (
  <div className="w-full h-full">
    <img
      src={imageUrl || ""}
      alt="Edited image"
      className="w-full h-full object-contain"
    />
    <div className="absolute bottom-4 right-4">
      <button
        onClick={() => imageUrl && window.open(imageUrl, "_blank")}
        className="p-1.5 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors transform scale-110 shadow-md opacity-70 hover:opacity-100"
        aria-label="Download image"
        title="View full size"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="7 10 12 15 17 10"></polyline>
          <line x1="12" y1="15" x2="12" y2="3"></line>
        </svg>
        <span className="sr-only">View full size</span>
      </button>
    </div>
  </div>
);

// Component for empty edited image state
interface EmptyEditedImageProps {
  hasPrompt: boolean;
}

const EmptyEditedImage = ({ hasPrompt }: EmptyEditedImageProps) => {
  const { t } = useTranslation();
  return (
    <div className="text-center p-8 h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
      <ImageIcon className="h-16 w-16 text-purple-400 mx-auto mb-4 opacity-75" />
      <p className="text-gray-600 dark:text-gray-300 font-medium text-lg mb-3">
        {hasPrompt
          ? t("imageEdit.yourEditedImageWillAppearHere")
          : t("imageEdit.enterAPromptToEditYourImage")}
      </p>
      <p className="text-base text-gray-500 dark:text-gray-400 max-w-md">
        {t("imageEdit.clickEditedImage")}
      </p>
    </div>
  );
};

// Component for edited image card
interface EditedImageCardProps {
  isEditingImage: boolean;
  editedImageData: ImageByIdQueryType | undefined;
  imagePrompt: string;
}

const EditedImageCard = ({
  isEditingImage,
  editedImageData,
  imagePrompt,
}: EditedImageCardProps) => {
  const { t } = useTranslation();
  return (
    <Card className="border border-purple-100 dark:border-purple-900/30 shadow-lg bg-white/95 backdrop-blur-sm dark:bg-gray-800/95 overflow-hidden hover:shadow-xl transition-all duration-300 rounded-xl">
      <CardContent className="p-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-purple-500" />
            {t("imageEdit.editedImage")}
          </h3>
          {isEditingImage && (
            <Badge className="text-sm py-1 px-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 animate-pulse shadow-sm rounded-full">
              {t("imageEdit.processing")}
            </Badge>
          )}
        </div>
        <div
          className="relative overflow-hidden rounded-xl border border-purple-100 dark:border-purple-900/50 bg-gray-100 dark:bg-gray-700 shadow-inner w-full h-auto"
          style={{ aspectRatio: "1/1" }}
        >
          {isEditingImage ? (
            <ProcessingEditedImage />
          ) : editedImageData?.node?.__typename === "Image" &&
            editedImageData?.node?.imageUrl ? (
            <EditedImageDisplay imageUrl={editedImageData.node?.imageUrl} />
          ) : (
            <EmptyEditedImage hasPrompt={!!imagePrompt.trim()} />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Main component
export default function ImageEdit() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const router = useRouter();
  const image = searchParams?.get("image");

  const [imagePrompt, setImagePrompt] = useState("");
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [imageData, setImageData] = useState<Image | null>(null);
  const [isEditingImage, setIsEditingImage] = useState(false);
  const [shouldRefetch, setShouldRefetch] = useState(false);
  const [imageId, setImageId] = useState<string | null>(null);
  const [model, setModel] = useState(AiModelOptionsEnum.Model_1);

  const [, editImage] = useMutation(ImageEditMutation);

  const [{ data, error }] = useQuery({
    query: ImageByIdQuery,
    variables: { id: image || "" },
    pause: !image,
  });

  const [{ data: editedImageData }, reExecuteQuery] = useQuery({
    query: ImageByIdQuery,
    variables: { id: imageId || "" },
    pause: !imageId,
  });

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
