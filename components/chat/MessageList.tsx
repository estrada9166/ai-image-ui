"use client";

import { useRef, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import InfiniteScroll from "react-infinite-scroll-component";
import { useTranslation } from "react-i18next";
import MessageBubble from "./MessageBubble";

interface VideoWithIndex {
  id: string;
  videoUrl?: string | null;
  prompt?: string | null;
  negativePrompt?: string | null;
  status: string;
  originalImages?: Array<{
    id: string;
    thumbnailUrl?: string | null;
    imageUrl?: string | null;
  }> | null;
  isExample?: boolean | null;
  index: number;
}

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

interface MessageListProps {
  messages: Message[];
  hasNextPage: boolean;
  onLoadMore: () => void;
  onImageClick: (imageUrl: string) => void;
  onVideoClick: (videoData: VideoWithIndex) => void;
  onDownloadImage: (imageUrl: string) => void;
  onDownloadVideo: (videoData: VideoWithIndex, e: React.MouseEvent) => void;
  isInitialLoad: boolean;
  isLoading: boolean;
  hasPendingMessages: boolean;
}

const SCROLL_DELAYS = {
  INITIAL: 200,
  UPDATE: 100,
} as const;

export default function MessageList({
  messages,
  hasNextPage,
  onLoadMore,
  onImageClick,
  onVideoClick,
  onDownloadImage,
  onDownloadVideo,
  isInitialLoad,
  isLoading,
  hasPendingMessages,
}: MessageListProps) {
  const { t } = useTranslation();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = (force = false) => {
    const delay =
      isInitialLoad || force ? SCROLL_DELAYS.INITIAL : SCROLL_DELAYS.UPDATE;

    setTimeout(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({
          behavior: isInitialLoad ? "auto" : "smooth",
          block: "end",
        });
      }
    }, delay);
  };

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom(isInitialLoad);
    }
  }, [messages, isInitialLoad]);

  useEffect(() => {
    if (hasPendingMessages || isLoading) {
      scrollToBottom();
    }
  }, [isLoading, hasPendingMessages]);

  return (
    <div className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-2 sm:space-y-4">
      <AnimatePresence>
        <InfiniteScroll
          dataLength={messages.length}
          next={onLoadMore}
          hasMore={hasNextPage}
          loader={
            <div className="flex justify-center py-4">
              <div className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin text-purple-500" />
                <span className="text-sm text-muted-foreground">
                  {t("chat.loadingMoreMessages")}
                </span>
              </div>
            </div>
          }
          className="space-y-2 sm:space-y-4"
        >
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              onImageClick={onImageClick}
              onVideoClick={onVideoClick}
              onDownloadImage={onDownloadImage}
              onDownloadVideo={onDownloadVideo}
            />
          ))}
        </InfiniteScroll>
      </AnimatePresence>
      <div ref={messagesEndRef} />
    </div>
  );
}
