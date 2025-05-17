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
import { useTranslation } from "react-i18next";

export default function Dashboard() {
  const { t } = useTranslation();

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  };

  return (
    <div>
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
          {t("dashboard.title")}
        </h1>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
      >
        {[
          {
            href: "/dashboard/create/image",
            icon: <ImageIcon className="h-6 w-6 text-primary" />,
            title: t("dashboard.createImage"),
            description: t("dashboard.generateAIimagesFromText"),
            completed: true,
          },
          {
            href: "/dashboard/edit/image",
            icon: <Edit className="h-6 w-6 text-primary" />,
            title: t("dashboard.editImage"),
            description: t("dashboard.modifyExistingImages"),
            completed: false,
          },
          {
            href: "/dashboard/create/video",
            icon: <VideoIcon className="h-6 w-6 text-primary" />,
            title: t("dashboard.createVideo"),
            description: t("dashboard.transformImagesIntoVideos"),
            completed: false,
          },
        ].map((item, index) => (
          <motion.div
            key={index}
            {...fadeIn}
            transition={{ delay: 0.1 * index }}
          >
            <Link href={item.href}>
              <Card className="h-full hover:shadow-lg transition-all cursor-pointer border-muted/30 hover:border-primary/40 hover:scale-102 duration-300 overflow-hidden group">
                <CardContent className="p-4 h-full flex items-center space-x-4">
                  <div className="bg-primary/10 p-3 rounded-full group-hover:bg-primary/20 transition-colors flex-shrink-0">
                    {item.icon}
                  </div>
                  <div className="flex-grow min-w-0">
                    <CardTitle className="text-base mb-1 truncate">
                      {item.title}
                    </CardTitle>
                    <CardDescription className="text-xs line-clamp-2">
                      {item.description}
                    </CardDescription>
                  </div>
                  <div className="flex-shrink-0">
                    {item.completed ? (
                      <span className="text-xs bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-3 py-1 rounded-full shadow-sm flex items-center gap-1.5 hover:shadow-md transition-all duration-200 font-medium whitespace-nowrap">
                        <span className="inline-block h-2 w-2 rounded-full bg-white animate-pulse"></span>
                        <span>{t("dashboard.completed")}</span>
                      </span>
                    ) : (
                      <span className="text-xs bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1 rounded-full shadow-sm flex items-center gap-1.5 hover:shadow-md transition-all duration-200 whitespace-nowrap">
                        <svg
                          className="h-3.5 w-3.5 animate-bounce"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M12 4V20M12 4L8 8M12 4L16 8"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <span className="font-medium">
                          {t("dashboard.tryMe")}
                        </span>
                      </span>
                    )}
                  </div>
                </CardContent>
                <div className="h-1 w-full bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Card>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      <div className="space-y-10">
        {[
          {
            icon: <ImageIcon className="h-5 w-5 text-primary" />,
            title: t("dashboard.yourImages"),
            href: "/dashboard/create/image",
            linkText: t("dashboard.createNew"),
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
            title: t("dashboard.editedImages"),
            href: "/dashboard/edit/image",
            linkText: t("dashboard.editAnImage"),
            gallery: (
              <ImageGallery
                type={[ImageTypeOptionsEnum.Edited]}
                showPrompt={false}
                tab="edited-images"
                loadPartialGallery
              />
            ),
          },
          {
            icon: <Edit className="h-5 w-5 text-primary" />,
            title: t("dashboard.restoredImages"),
            href: "/dashboard/edit/restore",
            linkText: t("dashboard.restoreAnImage"),
            gallery: (
              <ImageGallery
                type={[ImageTypeOptionsEnum.Restored]}
                showPrompt={false}
                tab="restored-images"
                loadPartialGallery
              />
            ),
          },
          {
            icon: <VideoIcon className="h-5 w-5 text-primary" />,
            title: t("dashboard.yourVideos"),
            href: "/dashboard/create/video",
            linkText: t("dashboard.createNew"),
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
