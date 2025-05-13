"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { ImageGallery } from "./ImageGallery";
import { VideoGallery } from "./VideoGallery";

interface GalleryProps {
  defaultTab?: "images" | "videos";
}

export default function Gallery({ defaultTab = "images" }: GalleryProps) {
  const [activeTab, setActiveTab] = useState<string>(defaultTab);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gallery</h1>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-sm grid-cols-2 mb-4">
          <TabsTrigger value="images">Images</TabsTrigger>
          <TabsTrigger value="videos">Videos</TabsTrigger>
        </TabsList>
        <TabsContent value="images">
          <Card>
            <CardContent className="pt-4">
              <ImageGallery showPrompt={false} />
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
      </Tabs>
    </div>
  );
}
