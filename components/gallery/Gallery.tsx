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
}

export default function Gallery({
  defaultTab = "images",
  multiSelect = false,
  selectedImages = [],
  onImagesSelect,
  onConfirmSelection,
}: GalleryProps) {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || defaultTab;

  const [activeTab, setActiveTab] = useState<string>(tab);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
        {multiSelect ? "Select Images for Chat" : t("gallery.gallery")}
      </h1>

      {multiSelect && (
        <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-sm text-blue-700 dark:text-blue-300">
                {selectedImages.length} of 4 images selected
              </span>
              {selectedImages.length >= 4 && (
                <span className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                  Maximum limit reached
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
              Use in Chat ({selectedImages.length})
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
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
