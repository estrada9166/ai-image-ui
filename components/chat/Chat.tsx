"use client";

import { useState, useRef, useEffect } from "react";
import { useToast } from "../../hooks/use-toast";
import { AnimatePresence } from "framer-motion";
import { SelectedImageModal } from "../common/SelectedImageModal";
import { AiModelOptionsEnum, AspectRatioOptionsEnum } from "../../gql/graphql";
import { GenAiStatusEnum } from "../../gql/graphql";
import { ImageWithIndex } from "../gallery/ImageGallery";
import { VideoWithIndex } from "../gallery/VideoGallery";
import { gql, useMutation, useQuery } from "urql";
import { SelectedVideoModal } from "../common/SelectedVideoModal";
import { useTranslation } from "react-i18next";
import axios from "axios";

// Import new components
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import ImageSelection from "./ImageSelection";
import WelcomeCard from "./WelcomeCard";

// Constants
const MAX_SELECTED_IMAGES = 4;
const POLLING_INTERVAL = 7000;

const DEFAULT_SETTINGS = {
  cameraType: "NO_SELFIE",
  aspectRatio: "SQUARE",
  aiModel: "MODEL_1",
} as const;

// Types
interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  images?: string[];
  fullImageUrls?: string[];
  messageId?: string;
  isVideo?: boolean;
  videoData?: VideoWithIndex;
}

interface SelectedImageData {
  url: string;
  id?: string;
  isFromGallery: boolean;
}

interface ChatProps {
  uuid: string;
}

interface MessageEdge {
  node: {
    message: {
      id: string;
      status: GenAiStatusEnum;
      imagePrompt?: string;
      videoPrompt?: string;
      negativePrompt?: string;
      camera?: string;
      aspectRatio?: string;
      model?: string;
      imageUrl?: string;
      videoUrl?: string;
      thumbnailUrl?: string;
      isExample?: boolean;
      originalImages?: Array<{
        id: string;
        thumbnailUrl: string;
        imageUrl: string;
      }>;
    };
  };
}

// Helper functions
const createUniqueId = (prefix: string, messageId: string, index: number) =>
  `${prefix}-${messageId}-${index}`;

const filterValidUrls = (urls: (string | null | undefined)[]): string[] =>
  urls.filter((url): url is string => Boolean(url));

const formatMessageSettings = (
  message: MessageEdge["node"]["message"],
  t: (key: string) => string
) => {
  if (!message.camera || !message.aspectRatio || !message.model) return "";

  const cameraText =
    message.camera === "NO_SELFIE"
      ? t("chat.settings.camera.standard")
      : t("chat.settings.camera.selfie");
  const aspectText = message.aspectRatio.toLowerCase();
  const modelText = message.model.replace("MODEL_", "");

  return ` (Camera: ${cameraText}, Aspect: ${aspectText}, Model: ${modelText})`;
};

const formatNegativePrompt = (
  message: MessageEdge["node"]["message"],
  isVideo: boolean
) =>
  isVideo && message.negativePrompt
    ? ` (Avoiding: ${message.negativePrompt})`
    : "";

// GraphQL Documents
const ChatQueryDocument = gql`
  query Chat($id: ID!, $before: String) {
    me {
      id
      planFeaturesUsage {
        imageCreation {
          used
        }
        editImage {
          used
        }
        imageRestoration {
          used
        }
        videoCreation {
          used
        }
      }
    }
    chat(id: $id) {
      id
      messages(last: 20, before: $before) {
        edges {
          node {
            id
            message {
              __typename
              ... on Image {
                id
                camera
                aspectRatio
                imagePrompt: prompt
                status
                imageUrl
                thumbnailUrl
                model
                originalImages {
                  id
                  thumbnailUrl
                  imageUrl
                }
              }
              ... on Video {
                id
                videoPrompt: prompt
                negativePrompt
                status
                videoUrl
                originalImages {
                  id
                  thumbnailUrl
                  imageUrl
                }
              }
            }
          }
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
  }
`;

const ChatMutationDocument = gql`
  mutation ChatMutation($input: ChatInput!) {
    chat(input: $input)
  }
`;

export default function Chat({ uuid }: ChatProps) {
  const { t } = useTranslation();
  const { toast } = useToast();

  // Core state
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [negativePrompt, setNegativePrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImages, setSelectedImages] = useState<SelectedImageData[]>([]);

  // Modal state
  const [modalImage, setModalImage] = useState<string | undefined>(undefined);
  const [modalVideo, setModalVideo] = useState<VideoWithIndex | null>(null);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [showNegativePrompt, setShowNegativePrompt] = useState(false);

  // Action and settings state
  const [imageAction, setImageAction] = useState<string>("create");
  const [cameraType, setCameraType] = useState<string>(
    DEFAULT_SETTINGS.cameraType
  );
  const [aspectRatio, setAspectRatio] = useState<string>(
    DEFAULT_SETTINGS.aspectRatio
  );
  const [aiModel, setAiModel] = useState<string>(DEFAULT_SETTINGS.aiModel);

  // Gallery state
  const [gallerySelectedImages, setGallerySelectedImages] = useState<
    ImageWithIndex[]
  >([]);

  // Pagination and loading state
  const [before, setBefore] = useState<string | null>(null);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPendingMessages, setHasPendingMessages] = useState(false);
  const [hasManualImageSelection, setHasManualImageSelection] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);

  // GraphQL hooks
  const [{ data }, refetch] = useQuery({
    query: ChatQueryDocument,
    variables: { id: uuid, before },
  });

  console.log("---;", data, before);

  const [, chatMutation] = useMutation(ChatMutationDocument);

  // Helper functions for message creation
  const createUserMessage = (
    message: MessageEdge["node"]["message"],
    edgeIndex: number
  ): Message => ({
    id: createUniqueId("user", message.id, edgeIndex),
    content: `${
      message.imagePrompt || message.videoPrompt || ""
    }${formatMessageSettings(message, t)}${formatNegativePrompt(
      message,
      "videoPrompt" in message
    )}`,
    sender: "user" as const,
    images: filterValidUrls(
      message.originalImages?.map((img) => img.imageUrl || img.thumbnailUrl) ||
        []
    ),
  });

  const createVideoMessage = (
    message: MessageEdge["node"]["message"],
    edgeIndex: number,
    thumbnailUrl: string
  ): Message => {
    const videoData: VideoWithIndex = {
      id: message.id,
      videoUrl: message.videoUrl || null,
      prompt: message.videoPrompt || null,
      negativePrompt: message.negativePrompt || null,
      status: message.status,
      originalImages: message.originalImages || null,
      isExample: false,
      index: 0,
    };

    return {
      id: createUniqueId("ai-video", message.id, edgeIndex),
      content: t("chat.messages.generatedVideo"),
      sender: "ai" as const,
      images: filterValidUrls([thumbnailUrl]),
      isVideo: true,
      videoData,
      messageId: message.id,
    };
  };

  const createImageMessage = (
    message: MessageEdge["node"]["message"],
    edgeIndex: number,
    thumbnailUrl: string,
    generatedUrl: string
  ): Message => ({
    id: createUniqueId("ai-image", message.id, edgeIndex),
    content: t("chat.messages.generatedImage"),
    sender: "ai" as const,
    images: filterValidUrls([thumbnailUrl || generatedUrl]),
    fullImageUrls: filterValidUrls([generatedUrl]),
    messageId: message.id,
  });

  // Convert GraphQL data to messages
  useEffect(() => {
    if (!data?.chat?.messages?.edges) return;

    const chatMessages: Message[] = [];
    const processedMessageIds = new Set<string>();

    data.chat.messages.edges.forEach((edge: MessageEdge, edgeIndex: number) => {
      const message = edge.node.message;
      if (!message || processedMessageIds.has(message.id)) return;

      processedMessageIds.add(message.id);

      const isImage = "imagePrompt" in message;
      const isVideo = "videoPrompt" in message;
      const prompt = isImage
        ? message.imagePrompt
        : isVideo
        ? message.videoPrompt
        : "";

      // Add user message if there's a prompt
      if (prompt) {
        chatMessages.push(createUserMessage(message, edgeIndex));
      }

      // Add AI response if generated
      if (message.status === GenAiStatusEnum.Generated) {
        const generatedUrl = isImage
          ? message.imageUrl
          : isVideo
          ? message.videoUrl
          : null;
        const thumbnailUrl =
          message.thumbnailUrl || message.originalImages?.[0]?.thumbnailUrl;

        if (generatedUrl || thumbnailUrl) {
          if (isVideo && message.videoUrl) {
            chatMessages.push(
              createVideoMessage(message, edgeIndex, thumbnailUrl || "")
            );
          } else if (isImage && message.imageUrl) {
            chatMessages.push(
              createImageMessage(
                message,
                edgeIndex,
                thumbnailUrl || "",
                generatedUrl || ""
              )
            );
          }
        }
      }
    });

    // Handle pending messages
    const pendingExists = data.chat.messages.edges.some(
      (edge: MessageEdge) =>
        edge.node.message?.status === GenAiStatusEnum.Pending
    );
    setHasPendingMessages(pendingExists);

    const finalMessages = pendingExists
      ? [
          ...chatMessages,
          {
            id: `processing-temp-${Date.now()}`,
            content: t("chat.messages.processing"),
            sender: "ai" as const,
          },
        ]
      : chatMessages;

    setMessages(finalMessages);
    setHasNextPage(data.chat.messages.pageInfo?.hasNextPage ?? false);

    if (isInitialLoad) {
      setIsInitialLoad(false);
    }
  }, [data, t, isInitialLoad]);

  // Polling for pending messages
  useEffect(() => {
    if (!hasPendingMessages) return;

    const interval = setInterval(() => {
      refetch({ requestPolicy: "network-only" });
    }, POLLING_INTERVAL);

    return () => clearInterval(interval);
  }, [hasPendingMessages, refetch]);

  // Utility functions
  const loadMoreMessages = () => {
    if (data?.chat?.messages?.pageInfo?.startCursor && hasNextPage) {
      setBefore(data.chat.messages.pageInfo.startCursor);
    }
  };

  const getLastImageIdFromChat = (): string | null => {
    if (!data?.chat?.messages?.edges) return null;

    for (let i = data.chat.messages.edges.length - 1; i >= 0; i--) {
      const message = data.chat.messages.edges[i].node.message;
      if (
        message &&
        "imageUrl" in message &&
        message.status === GenAiStatusEnum.Generated
      ) {
        return message.id;
      }
    }
    return null;
  };

  // Auto-update image action based on selection
  useEffect(() => {
    if (selectedImages.length > 2 && imageAction !== "video") {
      setImageAction("video");
    } else if (selectedImages.length > 0 && imageAction === "create") {
      setImageAction("edit");
    } else if (selectedImages.length === 0 && imageAction === "video") {
      setImageAction("create");
    }
  }, [selectedImages.length, imageAction]);

  // Auto-select latest image for edit/video modes
  useEffect(() => {
    if (
      (imageAction === "edit" || imageAction === "video") &&
      !hasManualImageSelection
    ) {
      const lastImageId = getLastImageIdFromChat();
      if (lastImageId && data?.chat?.messages?.edges) {
        const currentlySelectedId = selectedImages.find(
          (img) => img.isFromGallery
        )?.id;

        if (currentlySelectedId !== lastImageId) {
          for (let i = data.chat.messages.edges.length - 1; i >= 0; i--) {
            const message = data.chat.messages.edges[i].node.message;
            if (
              message &&
              "imageUrl" in message &&
              message.id === lastImageId &&
              message.status === GenAiStatusEnum.Generated
            ) {
              const imageUrl = message.thumbnailUrl || message.imageUrl;
              if (imageUrl) {
                setSelectedImages([
                  {
                    url: imageUrl,
                    id: message.id,
                    isFromGallery: true,
                  },
                ]);
              }
              break;
            }
          }
        }
      }
    }
  }, [imageAction, data, hasManualImageSelection, selectedImages]);

  // Reset settings when action changes
  useEffect(() => {
    if (imageAction !== "video") {
      setShowNegativePrompt(false);
      setNegativePrompt("");
    }
    setHasManualImageSelection(false);
  }, [imageAction]);

  // Event handlers
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const remainingSlots = MAX_SELECTED_IMAGES - selectedImages.length;
      if (remainingSlots <= 0) {
        toast({
          title: t("chat.imageSelection.limitReached"),
          description: t("chat.imageSelection.limitDescription"),
          variant: "destructive",
        });
        return;
      }

      const filesToProcess = Array.from(files).slice(0, remainingSlots);
      const newImages: string[] = [];
      const promises = filesToProcess.map((file) => {
        return new Promise<void>((resolve) => {
          const reader = new FileReader();
          reader.onload = (event) => {
            if (event.target?.result) {
              newImages.push(event.target.result as string);
            }
            resolve();
          };
          reader.readAsDataURL(file);
        });
      });

      Promise.all(promises).then(() => {
        setSelectedImages((prev) => [
          ...prev,
          ...newImages.map((url) => ({ url, isFromGallery: false })),
        ]);
        setHasManualImageSelection(true);
        if (files.length > filesToProcess.length) {
          toast({
            title: t("chat.imageSelection.someSkipped"),
            description: t("chat.imageSelection.skippedDescription", {
              count: filesToProcess.length,
            }),
            variant: "default",
          });
        }
      });
    }
  };

  const handleImageSelect = () => {
    fileInputRef.current?.click();
  };

  const handleGalleryImagesSelect = (images: ImageWithIndex[]) => {
    setGallerySelectedImages(images);
  };

  const handleConfirmGallerySelection = () => {
    const imagesToAdd = gallerySelectedImages
      .slice(0, 4 - selectedImages.length)
      .map((img) => ({
        url: img.imageUrl || "",
        id: img.id,
        isFromGallery: true,
      }));

    setSelectedImages((prev) => [...prev, ...imagesToAdd]);
    setHasManualImageSelection(true);
    setGallerySelectedImages([]);
    setShowGalleryModal(false);

    if (gallerySelectedImages.length > imagesToAdd.length) {
      toast({
        title: t("chat.imageSelection.someSkipped"),
        description: t("chat.imageSelection.skippedDescription", {
          count: imagesToAdd.length,
        }),
        variant: "default",
      });
    }
  };

  const removeSelectedImage = (index: number) => {
    const newImages = selectedImages.filter((_, i) => i !== index);
    setSelectedImages(newImages);

    if (newImages.length <= 2 && imageAction === "video") {
      setNegativePrompt("");
    }

    if (newImages.length === 0 && imageAction === "edit") {
      setImageAction("create");
    }
  };

  const handleImageActionChange = (value: string) => {
    if (selectedImages.length > 2 && value !== "video") {
      toast({
        title: t("chat.actions.actionRestricted"),
        description: t("chat.actions.videoOnlyDescription"),
        variant: "default",
      });
      return;
    }

    if (selectedImages.length > 0 && value === "create") {
      setSelectedImages([]);
    }

    setImageAction(value);
    if (value !== "video") {
      setNegativePrompt("");
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() && selectedImages.length === 0) return;

    const currentInput = input;
    setInput("");
    setIsLoading(true);

    try {
      // Determine if we have files to upload or only gallery images
      const filesToUpload: File[] = [];
      const galleryImageIds: string[] = [];

      // If no images selected for edit/video, use last image from chat
      if (
        selectedImages.length === 0 &&
        (imageAction === "edit" || imageAction === "video")
      ) {
        const lastImageId = getLastImageIdFromChat();
        if (lastImageId) {
          galleryImageIds.push(lastImageId);
        }
      } else {
        // Use selected images
        for (const imageData of selectedImages) {
          if (imageData.isFromGallery && imageData.id) {
            galleryImageIds.push(imageData.id);
          } else if (!imageData.isFromGallery) {
            // Handle uploaded files (blob URLs)
            try {
              const response = await fetch(imageData.url);
              const blob = await response.blob();
              const file = new File([blob], `image-${Date.now()}.jpg`, {
                type: "image/jpeg",
              });
              filesToUpload.push(file);
            } catch (error) {
              console.error("Error converting blob to file:", error);
            }
          }
        }
      }

      let data;

      if (filesToUpload.length > 0) {
        // Use REST API for file uploads
        const formData = new FormData();
        formData.append("prompt", currentInput);
        formData.append("action", imageAction.toUpperCase());
        formData.append("chatId", uuid);

        if (negativePrompt && imageAction === "video") {
          formData.append("negativePrompt", negativePrompt);
        }

        if (imageAction === "create") {
          formData.append("camera", cameraType);
          formData.append("aspectRatio", aspectRatio);
          formData.append("model", aiModel);
        }

        // Add files to form data
        filesToUpload.forEach((file) => {
          formData.append("files", file);
        });

        // Add gallery image IDs if any
        if (galleryImageIds.length > 0) {
          formData.append("imageIds", JSON.stringify(galleryImageIds));
        }

        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/upload/chat`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
          }
        );

        data = response.data;
      } else {
        const variables = {
          input: {
            chatId: uuid,
            prompt: currentInput,
            action: imageAction.toUpperCase(),
            ...(galleryImageIds.length > 0 && { imageIds: galleryImageIds }),
            ...(negativePrompt &&
              imageAction === "video" && { negativePrompt }),
            ...(imageAction === "create" && {
              camera: cameraType,
              aspectRatio: aspectRatio,
              model: aiModel,
            }),
          },
        };

        const result = await chatMutation(variables);

        if (result.error) {
          throw new Error(result.error.message);
        }

        data = { message: result.data };
      }

      // Check if response indicates processing and refetch
      if (data.message === "__PROCESSING__") {
        // Refetch the chat to get the latest messages
        setTimeout(() => {
          refetch({
            requestPolicy: "network-only",
            variables: { id: uuid, before: null },
          });
        }, 2000);
      } else {
        // Refetch to get the new messages
        refetch({
          requestPolicy: "network-only",
          variables: { id: uuid, before: null },
        });
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";

      if (errorMessage === "__UNAUTHORIZED_IMAGE__") {
        toast({
          title: t("chat.errors.unauthorized"),
          description: t("chat.errors.unauthorizedDescription"),
          variant: "destructive",
        });
      } else {
        toast({
          title: t("chat.errors.error"),
          description: t("chat.errors.failedToProcess", {
            error: errorMessage,
          }),
          variant: "destructive",
        });
      }
    } finally {
      setSelectedImages([]);
      setNegativePrompt("");
      setShowNegativePrompt(false);
      setIsLoading(false);
    }
  };

  const handleDownloadImage = (imageUrl: string) => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = `modified-image-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const openImageModal = (imageUrl: string) => {
    setModalImage(imageUrl);
  };

  const openVideoModal = (videoData: VideoWithIndex) => {
    setModalVideo(videoData);
  };

  const handleDownloadVideo = (video: VideoWithIndex, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!video.videoUrl) return;

    const link = document.createElement("a");
    link.href = video.videoUrl;
    link.download = `video-${Date.now()}.mp4`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-indigo-950/30">
      {messages.length === 0 ? (
        <WelcomeCard
          onUploadClick={handleImageSelect}
          onGalleryClick={() => setShowGalleryModal(true)}
        />
      ) : (
        <MessageList
          messages={messages}
          hasNextPage={hasNextPage}
          onLoadMore={loadMoreMessages}
          onImageClick={openImageModal}
          onVideoClick={openVideoModal}
          onDownloadImage={handleDownloadImage}
          onDownloadVideo={handleDownloadVideo}
          isInitialLoad={isInitialLoad}
          isLoading={isLoading}
          hasPendingMessages={hasPendingMessages}
        />
      )}

      <div className="p-2 sm:p-4 w-full">
        <AnimatePresence>
          <ImageSelection
            selectedImages={selectedImages}
            onRemoveImage={removeSelectedImage}
            onImageClick={openImageModal}
          />
        </AnimatePresence>

        <MessageInput
          input={input}
          negativePrompt={negativePrompt}
          imageAction={imageAction}
          showNegativePrompt={showNegativePrompt}
          isLoading={isLoading}
          hasPendingMessages={hasPendingMessages}
          selectedImagesCount={selectedImages.length}
          showGalleryModal={showGalleryModal}
          onInputChange={setInput}
          onNegativePromptChange={setNegativePrompt}
          onImageActionChange={handleImageActionChange}
          onShowNegativePromptToggle={() =>
            setShowNegativePrompt(!showNegativePrompt)
          }
          onSendMessage={handleSendMessage}
          onUploadClick={handleImageSelect}
          onGalleryModalToggle={setShowGalleryModal}
          gallerySelectedImages={gallerySelectedImages}
          onGalleryImagesSelect={handleGalleryImagesSelect}
          onConfirmGallerySelection={handleConfirmGallerySelection}
          cameraType={cameraType}
          aspectRatio={aspectRatio}
          aiModel={aiModel}
          setCameraType={setCameraType}
          setAspectRatio={setAspectRatio}
          setAiModel={setAiModel}
        />

        <input
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileUpload}
        />
      </div>

      {modalImage && (
        <SelectedImageModal
          selectedImage={{
            imageUrl: modalImage,
            prompt: "",
            status: GenAiStatusEnum.Generated,
            thumbnailUrl: modalImage,
            model: AiModelOptionsEnum.Model_1,
            aspectRatio: AspectRatioOptionsEnum.Landscape,
            id: "",
            index: 0,
          }}
          closeModal={() => setModalImage(undefined)}
          handleDownloadImage={handleDownloadImage}
          tab="chat"
        />
      )}

      {modalVideo && (
        <SelectedVideoModal
          selectedVideo={modalVideo}
          closeModal={() => setModalVideo(null)}
          handleDownloadVideo={handleDownloadVideo}
        />
      )}
    </div>
  );
}
