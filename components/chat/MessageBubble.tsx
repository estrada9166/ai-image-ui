"use client";

import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Download, Sparkles, Video } from "lucide-react";
import { motion } from "framer-motion";

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

interface MessageBubbleProps {
  message: Message;
  onImageClick: (imageUrl: string) => void;
  onVideoClick: (videoData: VideoWithIndex) => void;
  onDownloadImage: (imageUrl: string) => void;
  onDownloadVideo: (videoData: VideoWithIndex, e: React.MouseEvent) => void;
}

export default function MessageBubble({
  message,
  onImageClick,
  onVideoClick,
  onDownloadImage,
  onDownloadVideo,
}: MessageBubbleProps) {
  const renderImages = () => {
    if (!message.images || message.images.length === 0) return null;

    return (
      <div className="mb-2 relative">
        <div
          className={`grid gap-2 ${
            message.images.length === 1
              ? "grid-cols-1"
              : message.images.length === 2
              ? "grid-cols-2"
              : message.images.length <= 4
              ? "grid-cols-2"
              : "grid-cols-3"
          }`}
        >
          {message.images.map((image, index) => (
            <div key={index} className="relative">
              <img
                src={image}
                alt={`${message.isVideo ? "Video" : "Image"} ${index + 1}`}
                className="rounded-md max-h-48 w-full object-contain shadow-sm cursor-pointer"
                onClick={() => {
                  if (message.isVideo && message.videoData) {
                    onVideoClick(message.videoData);
                  } else {
                    onImageClick(message.fullImageUrls?.[index] || image);
                  }
                }}
              />

              {/* Video play icon overlay */}
              {message.isVideo && (
                <div
                  className="absolute inset-0 flex items-center justify-center"
                  onClick={() => {
                    if (message.isVideo && message.videoData) {
                      onVideoClick(message.videoData);
                    }
                  }}
                >
                  <div className="bg-black/60 rounded-full p-3 hover:bg-black/80 transition-colors">
                    <Video className="h-6 w-6 text-white" />
                  </div>
                </div>
              )}

              {message.sender === "ai" && (
                <Button
                  size="sm"
                  variant="secondary"
                  className="absolute bottom-2 right-2 bg-black/60 hover:bg-black/80 text-white rounded-full shadow-sm p-1.5"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (message.isVideo && message.videoData) {
                      onDownloadVideo(message.videoData, e);
                    } else {
                      onDownloadImage(message.fullImageUrls?.[index] || image);
                    }
                  }}
                >
                  <Download className="h-3 w-3" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <motion.div
      key={message.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${
        message.sender === "user" ? "justify-end" : "justify-start"
      } mb-2 sm:mb-3 px-2 sm:px-0`}
    >
      <div
        className={`max-w-[85%] sm:max-w-[40%] rounded-lg p-2 sm:p-3 shadow-sm border ${
          message.sender === "user"
            ? "bg-white border-gray-200"
            : "bg-white dark:bg-gray-800 dark:text-gray-100 border-gray-200 dark:border-gray-700"
        }`}
      >
        {renderImages()}
        <div className="flex items-start">
          {message.sender === "ai" && (
            <Avatar className="mr-2 h-5 w-5 sm:h-6 sm:w-6 bg-gradient-to-br from-purple-400 to-indigo-500 shadow-sm">
              <Sparkles className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-white" />
            </Avatar>
          )}
          <p className="leading-relaxed text-xs sm:text-sm">
            {message.content}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
