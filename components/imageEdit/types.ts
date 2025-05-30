import { AiModelOptionsEnum, Image } from "../../gql/graphql";

export type ImageEdit = {
  id: string;
  prompt?: string | null;
  status: string;
  imageUrl?: string | null;
};

export interface SourceImageCardProps {
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
}

export interface EditedImageCardProps {
  isEditingImage: boolean;
  editedImageUrl: string | null;
  imagePrompt: string;
}

export interface PromptInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  isDisabled: boolean;
}

export interface PromptActionsProps {
  onClear: () => void;
  onEdit: () => void;
  isEditing: boolean;
  hasPrompt: string | boolean;
  hasImage: boolean;
}

export interface SourceImageDisplayProps {
  imageUrl: string;
  prompt?: string | null;
  onRemove: () => void;
}

export interface EmptyEditedImageProps {
  hasPrompt: boolean;
}

export interface EditedImageDisplayProps {
  imageUrl: string | null | undefined;
}

export interface PromptIdeasSelectorProps {
  onSelectPrompt: (prompt: string) => void;
}

export interface AiModelSelectorProps {
  model: AiModelOptionsEnum;
  setModel: (model: AiModelOptionsEnum) => void;
}

export interface ErrorDisplayProps {
  errorMessage: string;
}
