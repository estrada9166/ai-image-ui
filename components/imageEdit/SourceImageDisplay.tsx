import { X } from "lucide-react";
import { SourceImageDisplayProps } from "./types";

export const SourceImageDisplay = ({
  imageUrl,
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
  </div>
);
