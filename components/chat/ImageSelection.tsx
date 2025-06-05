"use client";

import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { motion } from "framer-motion";

interface SelectedImageData {
  url: string;
  id?: string;
  isFromGallery: boolean;
}

interface ImageSelectionProps {
  selectedImages: SelectedImageData[];
  onRemoveImage: (index: number) => void;
  onImageClick: (imageUrl: string) => void;
}

export default function ImageSelection({
  selectedImages,
  onRemoveImage,
  onImageClick,
}: ImageSelectionProps) {
  if (selectedImages.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="mb-2"
    >
      <div className="bg-white dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-2 sm:p-3 border border-blue-100 dark:border-blue-800/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 sm:mb-3 gap-2">
          <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
            {selectedImages.length} of 4 images selected
          </span>
          <div className="flex flex-wrap gap-1 sm:gap-2">
            {selectedImages.length >= 4 && (
              <span className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-full">
                Max reached
              </span>
            )}
            {selectedImages.length > 2 && (
              <span className="text-xs text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 px-2 py-1 rounded-full">
                Video only
              </span>
            )}
            {selectedImages.length > 0 && selectedImages.length <= 2 && (
              <span className="text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-full">
                Edit or Video
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-1 sm:gap-2">
          {selectedImages.map((image, index) => (
            <div key={index} className="relative group">
              <img
                src={image.url}
                alt={`Selected image ${index + 1}`}
                className="h-12 w-12 sm:h-16 sm:w-16 rounded-lg object-cover cursor-pointer border-2 border-white dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow"
                onClick={() => onImageClick(image.url)}
              />
              <Button
                size="sm"
                variant="destructive"
                className="absolute -top-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                onClick={() => onRemoveImage(index)}
              >
                <X className="h-2 w-2 sm:h-3 sm:w-3" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
