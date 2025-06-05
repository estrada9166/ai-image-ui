"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ImageIcon, Upload, Grid, Plus, Edit, Video } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

interface WelcomeCardProps {
  onUploadClick: () => void;
  onGalleryClick: () => void;
}

export default function WelcomeCard({
  onUploadClick,
  onGalleryClick,
}: WelcomeCardProps) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-center h-full px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="p-4 sm:p-8 max-w-lg text-center shadow-lg border-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-2xl mx-auto">
          <div className="mb-4 sm:mb-6">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-400 via-purple-500 to-indigo-600 dark:from-blue-600 dark:via-purple-600 dark:to-indigo-800 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg">
              <ImageIcon className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              {t("chat.title")}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4 sm:mb-6 text-xs sm:text-sm leading-relaxed">
              {t("chat.description")}
            </p>
          </div>

          {/* How to use section */}
          <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
            <div className="text-left space-y-2 sm:space-y-3">
              <div className="flex items-start space-x-2 sm:space-x-3 p-2 sm:p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Plus className="h-2 w-2 sm:h-3 sm:w-3 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-xs sm:text-sm text-blue-900 dark:text-blue-100">
                    {t("chat.welcomeCards.create.title")}
                  </h4>
                  <p className="text-xs text-blue-700 dark:text-blue-300">
                    {t("chat.welcomeCards.create.description")}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-2 sm:space-x-3 p-2 sm:p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Edit className="h-2 w-2 sm:h-3 sm:w-3 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-xs sm:text-sm text-green-900 dark:text-green-100">
                    {t("chat.welcomeCards.edit.title")}
                  </h4>
                  <p className="text-xs text-green-700 dark:text-green-300">
                    {t("chat.welcomeCards.edit.description")}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-2 sm:space-x-3 p-2 sm:p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Video className="h-2 w-2 sm:h-3 sm:w-3 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-xs sm:text-sm text-purple-900 dark:text-purple-100">
                    {t("chat.welcomeCards.video.title")}
                  </h4>
                  <p className="text-xs text-purple-700 dark:text-purple-300">
                    {t("chat.welcomeCards.video.description")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <Button
              onClick={onUploadClick}
              className="flex-1 px-4 sm:px-6 py-2 sm:py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white transition-all duration-300 shadow-lg hover:shadow-xl text-xs sm:text-sm font-medium"
            >
              <Upload className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              {t("chat.buttons.uploadImages")}
            </Button>
            <Button
              onClick={onGalleryClick}
              variant="outline"
              className="flex-1 px-4 sm:px-6 py-2 sm:py-3 rounded-xl border-2 border-purple-200 text-purple-600 hover:bg-purple-50 hover:border-purple-300 transition-all duration-300 shadow-lg hover:shadow-xl text-xs sm:text-sm font-medium dark:border-purple-600 dark:text-purple-400 dark:hover:bg-purple-900/20"
            >
              <Grid className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              {t("chat.buttons.browseGallery")}
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
