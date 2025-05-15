"use client";

import React from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { ImageIcon, Edit, VideoIcon, PlusCircle } from "lucide-react";
import { ImageGallery } from "@/components/gallery/ImageGallery";
import { VideoGallery } from "@/components/gallery/VideoGallery";
import { ImageTypeOptionsEnum } from "../../gql/graphql";
import { motion } from "framer-motion";

export default function Dashboard() {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  };

  return (
    <div className="container mx-auto py-6 px-4 max-w-6xl">
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl font-bold mb-1 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-sm text-muted-foreground">
          Create and manage your AI-generated content
        </p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
      >
        {[
          {
            href: "/dashboard/create-image",
            icon: <ImageIcon className="h-6 w-6 text-primary" />,
            title: "Create Image",
            description: "Generate AI images from text",
          },
          {
            href: "/dashboard/edit-image",
            icon: <Edit className="h-6 w-6 text-primary" />,
            title: "Edit Image",
            description: "Modify existing images",
          },
          {
            href: "/dashboard/video-creation",
            icon: <VideoIcon className="h-6 w-6 text-primary" />,
            title: "Create Video",
            description: "Transform images into videos",
          },
        ].map((item, index) => (
          <motion.div
            key={index}
            {...fadeIn}
            transition={{ delay: 0.1 * index }}
          >
            <Link href={item.href}>
              <Card className="hover:shadow-lg transition-all cursor-pointer border-muted/30 hover:border-primary/40 hover:scale-102 duration-300 overflow-hidden group">
                <CardContent className="p-4 flex items-center space-x-4">
                  <div className="bg-primary/10 p-3 rounded-full group-hover:bg-primary/20 transition-colors">
                    {item.icon}
                  </div>
                  <div>
                    <CardTitle className="text-base mb-1">
                      {item.title}
                    </CardTitle>
                    <CardDescription className="text-xs">
                      {item.description}
                    </CardDescription>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      <div className="space-y-10">
        {[
          {
            icon: <ImageIcon className="h-5 w-5 text-primary" />,
            title: "Your Images",
            href: "/dashboard/create-image",
            linkText: "Create new",
            gallery: (
              <ImageGallery
                type={[ImageTypeOptionsEnum.Created]}
                showPrompt={false}
                tab="images"
                loadPartialGallery
              />
            ),
          },
          {
            icon: <Edit className="h-5 w-5 text-primary" />,
            title: "Edited Images",
            href: "/dashboard/edit-image",
            linkText: "Edit an image",
            gallery: (
              <ImageGallery
                type={[ImageTypeOptionsEnum.Edited]}
                showPrompt={false}
                tab="images"
                loadPartialGallery
              />
            ),
          },
          {
            icon: <VideoIcon className="h-5 w-5 text-primary" />,
            title: "Your Videos",
            href: "/dashboard/video-creation",
            linkText: "Create new",
            gallery: <VideoGallery showPrompt={false} loadPartialGallery />,
          },
        ].map((section, index) => (
          <motion.section
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-medium flex items-center gap-2">
                {section.icon}
                <span className="bg-gradient-to-r from-primary/90 to-purple-600/90 bg-clip-text text-transparent">
                  {section.title}
                </span>
              </h2>
              <Link href={section.href} className="group">
                <div className="flex items-center gap-1 text-primary hover:text-primary/80 transition-colors text-sm">
                  <PlusCircle className="h-4 w-4" />
                  <span className="group-hover:underline">
                    {section.linkText}
                  </span>
                </div>
              </Link>
            </div>
            {section.gallery}
          </motion.section>
        ))}
      </div>
    </div>
  );
}
