"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ImageGallery } from "./ImageGallery";
import { ImageTypeOptionsEnum } from "../../gql/graphql";
import { useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Check } from "lucide-react";
import { ImageWithIndex } from "./ImageGallery";

interface GalleryProps {
  defaultTab?: "images" | "videos" | "edited-images";
  multiSelect?: boolean;
  selectedImages?: ImageWithIndex[];
  onImagesSelect?: (images: ImageWithIndex[]) => void;
  onConfirmSelection?: () => void;
  maxImages?: number;
}

export default function Gallery({
  defaultTab = "images",
  multiSelect = false,
  selectedImages = [],
  onImagesSelect,
  onConfirmSelection,
  maxImages = 4,
}: GalleryProps) {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || defaultTab;

  const [activeTab, setActiveTab] = useState<string>(tab);

  return (
    <div>
      {multiSelect && (
        <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-sm text-blue-700 dark:text-blue-300">
                {t("gallerySelectionModal.selectedImages", {
                  count: selectedImages.length,
                  max: maxImages,
                })}
              </span>
              {selectedImages.length >= maxImages && (
                <span className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                  {t("gallerySelectionModal.maximumLimitReached")}
                </span>
              )}
            </div>
            <Button
              onClick={onConfirmSelection}
              disabled={selectedImages.length === 0}
              className="bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-400"
              size="sm"
            >
              <Check className="w-4 h-4 mr-2" />
              {t("gallerySelectionModal.useImages", {
                count: selectedImages.length,
              })}
            </Button>
          </div>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-sm grid-cols-4 mb-4">
          <TabsTrigger value="images">{t("gallery.created")}</TabsTrigger>
          <TabsTrigger value="edited-images">{t("gallery.edited")}</TabsTrigger>
          <TabsTrigger value="restored-images">
            {t("gallery.restored")}
          </TabsTrigger>
          <TabsTrigger value="user-uploaded">
            {t("gallery.uploaded")}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="images">
          <Card>
            <CardContent className="pt-4">
              <ImageGallery
                type={[ImageTypeOptionsEnum.Created]}
                showPrompt={false}
                tab="images"
                multiSelect={multiSelect}
                selectedImages={selectedImages}
                onImagesSelect={onImagesSelect}
                maxImages={maxImages}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="edited-images">
          <Card>
            <CardContent className="pt-4">
              <ImageGallery
                type={[ImageTypeOptionsEnum.Edited]}
                showPrompt={false}
                tab="edited-images"
                multiSelect={multiSelect}
                selectedImages={selectedImages}
                onImagesSelect={onImagesSelect}
                maxImages={maxImages}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="restored-images">
          <Card>
            <CardContent className="pt-4">
              <ImageGallery
                type={[ImageTypeOptionsEnum.Restored]}
                showPrompt={false}
                tab="restored-images"
                multiSelect={multiSelect}
                selectedImages={selectedImages}
                onImagesSelect={onImagesSelect}
                maxImages={maxImages}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="user-uploaded">
          <Card>
            <CardContent className="pt-4">
              <ImageGallery
                type={[ImageTypeOptionsEnum.UserUploaded]}
                showPrompt={false}
                tab="user-uploaded"
                multiSelect={multiSelect}
                selectedImages={selectedImages}
                onImagesSelect={onImagesSelect}
                maxImages={maxImages}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
