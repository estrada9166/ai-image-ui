"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Gallery from "../gallery/Gallery";
import { ImageWithIndex } from "../gallery/ImageGallery";
import { useTranslation } from "react-i18next";

interface GallerySelectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedImages: ImageWithIndex[];
  onImagesSelect: (images: ImageWithIndex[]) => void;
  onConfirmSelection: () => void;
  trigger?: React.ReactNode;
  maxImages: number;
}

export function GallerySelectionModal({
  open,
  onOpenChange,
  selectedImages,
  onImagesSelect,
  onConfirmSelection,
  trigger,
  maxImages,
}: GallerySelectionModalProps) {
  const { t } = useTranslation();

  const modalContent = (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="max-w-[95vw] sm:max-w-4xl max-h-[85vh] sm:max-h-[80vh] overflow-y-auto m-2">
        <DialogHeader>
          <DialogTitle>{t("gallerySelectionModal.title")}</DialogTitle>
        </DialogHeader>
        <Gallery
          multiSelect={true}
          selectedImages={selectedImages}
          onImagesSelect={onImagesSelect}
          onConfirmSelection={onConfirmSelection}
          maxImages={maxImages}
        />
      </DialogContent>
    </Dialog>
  );

  return modalContent;
}
