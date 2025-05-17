import { X } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SourceImageDisplayProps } from "./types";

export const SourceImageDisplay = ({
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
