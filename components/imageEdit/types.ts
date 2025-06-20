import { AiModelOptionsEnum } from "../../gql/graphql";
import { ImageWithIndex } from "../gallery/ImageGallery";

export type SelectedImage = {
  id: string;
  imageUrl?: string | null;
};

export interface SourceImageCardProps {
  imageData: SelectedImage[];
  previewUrls: (string | null)[];
  fileInputRef: React.RefObject<HTMLInputElement> | null;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveImage: (index: number) => void;
  handleRemoveSelectedImage: (index: number) => void;
  imagePrompt: string;
  setImagePrompt: React.Dispatch<React.SetStateAction<string>>;
  isEditingImage: boolean;
  handleEditImage: () => void;
  handlePromptIdeaClick: (idea: string) => void;
  uploadedImages: File[];
  showGalleryModal: boolean;
  gallerySelectedImages: ImageWithIndex[];
  handleGalleryImagesSelect: (images: ImageWithIndex[]) => void;
  handleGalleryModalChange: (open: boolean) => void;
  handleConfirmGallerySelection: () => Promise<void>;
}

export interface EditedImageCardProps {
  isEditingImage: boolean;
  editedImageUrl: string | null;
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
  onRemove: () => void;
  index?: number;
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
