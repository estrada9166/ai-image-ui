"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { ImageGallery } from "./ImageGallery";
import { VideoGallery } from "./VideoGallery";
import { ImageTypeOptionsEnum } from "../../gql/graphql";
import { useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";
interface GalleryProps {
  defaultTab?: "images" | "videos" | "edited-images";
}

export default function Gallery({ defaultTab = "images" }: GalleryProps) {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || defaultTab;

  const [activeTab, setActiveTab] = useState<string>(tab);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
        {t("gallery.gallery")}
      </h1>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-sm grid-cols-5 mb-4">
          <TabsTrigger value="images">{t("gallery.created")}</TabsTrigger>
          <TabsTrigger value="edited-images">{t("gallery.edited")}</TabsTrigger>
          <TabsTrigger value="restored-images">
            {t("gallery.restored")}
          </TabsTrigger>
          <TabsTrigger value="videos">{t("gallery.videos")}</TabsTrigger>
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
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="videos">
          <Card>
            <CardContent className="pt-4">
              <VideoGallery showPrompt={false} />
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
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
