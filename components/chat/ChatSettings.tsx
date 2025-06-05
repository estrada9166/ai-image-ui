"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ChatSettingsProps {
  cameraType: string;
  aspectRatio: string;
  aiModel: string;
  onCameraTypeChange: (value: string) => void;
  onAspectRatioChange: (value: string) => void;
  onAiModelChange: (value: string) => void;
}

export default function ChatSettings({
  cameraType,
  aspectRatio,
  aiModel,
  onCameraTypeChange,
  onAspectRatioChange,
  onAiModelChange,
}: ChatSettingsProps) {
  return (
    <div className="w-full mb-3">
      <div className="grid grid-cols-3 gap-2">
        <Select value={cameraType} onValueChange={onCameraTypeChange}>
          <SelectTrigger className="h-8 border-gray-300 focus:border-gray-400 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="NO_SELFIE" className="text-xs">
              Standard
            </SelectItem>
            <SelectItem value="SELFIE" className="text-xs">
              Selfie
            </SelectItem>
          </SelectContent>
        </Select>

        <Select value={aspectRatio} onValueChange={onAspectRatioChange}>
          <SelectTrigger className="h-8 border-gray-300 focus:border-gray-400 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="SQUARE" className="text-xs">
              Square
            </SelectItem>
            <SelectItem value="LANDSCAPE" className="text-xs">
              Landscape
            </SelectItem>
            <SelectItem value="PORTRAIT" className="text-xs">
              Portrait
            </SelectItem>
          </SelectContent>
        </Select>

        <Select value={aiModel} onValueChange={onAiModelChange}>
          <SelectTrigger className="h-8 border-gray-300 focus:border-gray-400 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="MODEL_1" className="text-xs">
              Model 1
            </SelectItem>
            <SelectItem value="MODEL_2" className="text-xs">
              Model 2
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
