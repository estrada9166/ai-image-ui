import { motion } from "framer-motion";
import { ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { ErrorDisplayProps } from "./types";

export const ErrorDisplay = ({ errorMessage }: ErrorDisplayProps) => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="max-w-md w-full bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-lg p-8 shadow-md"
      >
        <ImageIcon className="h-16 w-16 text-red-400 mx-auto mb-6" />
        <h3 className="text-2xl font-medium text-red-700 dark:text-red-400 mb-3 text-center">
          {t("imageEdit.errorLoadingImage")}
        </h3>
        <p className="text-red-600 dark:text-red-300 text-center mb-6">
          {errorMessage}
        </p>
        <div className="flex justify-center">
          <Button
            variant="outline"
            className="border-red-200 text-red-700 hover:bg-red-50 dark:border-red-800/30 dark:text-red-400 dark:hover:bg-red-900/20"
            onClick={() => window.history.back()}
          >
            {t("imageEdit.goBack")}
          </Button>
        </div>
      </motion.div>
    </div>
  );
};
