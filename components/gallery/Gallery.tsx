"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { ImageGallery } from "./ImageGallery";
import { VideoGallery } from "./VideoGallery";
import { ImageTypeOptionsEnum } from "../../gql/graphql";
import { useSearchParams } from "next/navigation";

interface GalleryProps {
  defaultTab?: "images" | "videos" | "edited-images" | "uploaded-images";
}

export default function Gallery({ defaultTab = "images" }: GalleryProps) {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || defaultTab;

  const [activeTab, setActiveTab] = useState<string>(tab);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gallery</h1>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-sm grid-cols-4 mb-4">
          <TabsTrigger value="images">Created</TabsTrigger>
          <TabsTrigger value="edited-images">Edited</TabsTrigger>
          <TabsTrigger value="videos">Videos</TabsTrigger>
          <TabsTrigger value="uploaded-images">Uploaded</TabsTrigger>
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
        <TabsContent value="uploaded-images">
          <Card>
            <CardContent className="pt-4">
              <ImageGallery
                type={[ImageTypeOptionsEnum.UserUploaded]}
                showPrompt={false}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
