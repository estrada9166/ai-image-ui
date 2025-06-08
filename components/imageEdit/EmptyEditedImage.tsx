import { ImageIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

export const EmptyEditedImage = () => {
  const { t } = useTranslation();
  return (
    <div className="text-center p-8 h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
      <ImageIcon className="h-16 w-16 text-purple-400 mx-auto mb-4 opacity-75" />
      <p className="text-gray-600 dark:text-gray-300 font-medium text-lg mb-3">
        {t("imageEdit.yourEditedImageWillAppearHere")}
      </p>
    </div>
  );
};
