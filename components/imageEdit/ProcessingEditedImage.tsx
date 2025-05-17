import { Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

export const ProcessingEditedImage = () => {
  const { t } = useTranslation();
  return (
    <div className="text-center p-8 h-full flex flex-col items-center justify-center">
      <div className="relative w-24 h-24 mb-6">
        <svg
          className="animate-spin h-24 w-24 text-purple-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <Sparkles className="h-10 w-10 text-white animate-pulse" />
        </div>
      </div>
      <p className="text-gray-600 dark:text-gray-300 font-medium text-lg mb-3">
        {t("imageEdit.editingImage")}
      </p>
      <div className="max-w-md">
        <p className="text-base text-gray-500 dark:text-gray-400">
          {t("imageEdit.transformingImage")}
        </p>
      </div>
      <div className="w-full max-w-sm bg-gray-200 dark:bg-gray-600 rounded-full h-3 mt-6 overflow-hidden">
        <motion.div
          className="bg-gradient-to-r from-purple-600 to-indigo-600 h-3 rounded-full"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 30, ease: "linear" }}
        />
      </div>
    </div>
  );
};
