import { Upload } from "lucide-react";

import { ImageIcon } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import { useTranslation } from "react-i18next";

interface EmptySourceImageProps {
  onUploadClick: () => void;
}

export const EmptySourceImage = ({ onUploadClick }: EmptySourceImageProps) => {
  const { t } = useTranslation();

  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-purple-50 dark:from-gray-800 dark:to-purple-900/20 backdrop-blur-sm">
      <div className="text-center p-4 sm:p-6 md:p-8 max-w-xs sm:max-w-sm md:max-w-md mx-auto">
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4">
          <div className="absolute inset-0 bg-purple-200 dark:bg-purple-700/30 rounded-full animate-ping opacity-30"></div>
          <div className="relative flex items-center justify-center w-full h-full bg-gradient-to-r from-purple-400 to-indigo-400 dark:from-purple-600 dark:to-indigo-600 rounded-full shadow-lg">
            <ImageIcon className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
          </div>
        </div>
        <h3 className="text-base sm:text-lg font-medium text-gray-700 dark:text-gray-200 mb-2 sm:mb-3">
          {t("emptySourceImage.addAnImageToBegin")}
        </h3>
        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mb-4 sm:mb-6 px-2">
          {t(
            "emptySourceImage.selectOrUploadAnImageToTransformItWithAIEditing"
          )}
        </p>
        <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:justify-center sm:gap-4">
          <Button
            variant="outline"
            className="w-full sm:w-auto border-purple-200 text-purple-700 hover:bg-purple-50 dark:border-purple-900/30 dark:text-purple-400 dark:hover:bg-purple-900/20 transition-all duration-300 rounded-full cursor-pointer shadow-sm hover:shadow-md"
            onClick={onUploadClick}
          >
            <Upload className="mr-2 h-4 w-4" />
            {t("emptySourceImage.uploadImage")}
          </Button>

          <Link href="/dashboard/gallery" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg rounded-full">
              <ImageIcon className="mr-2 h-4 w-4" />
              {t("emptySourceImage.selectFromGallery")}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
