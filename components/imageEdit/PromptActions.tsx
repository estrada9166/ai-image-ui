import { RefreshCw, Wand2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { PromptActionsProps } from "./types";

export const PromptActions = ({
  onClear,
  onEdit,
  isEditing,
  hasPrompt,
  hasImage,
}: PromptActionsProps) => {
  const { t } = useTranslation();
  return (
    <div className="flex justify-end gap-3 pt-2">
      <Button
        variant="outline"
        onClick={onClear}
        disabled={!hasPrompt || isEditing}
        className="text-sm border-purple-200 text-purple-700 hover:bg-purple-50 dark:border-purple-900/30 dark:text-purple-400 dark:hover:bg-purple-900/20 transition-colors duration-200 rounded-full"
      >
        <RefreshCw className="mr-2 h-4 w-4" />
        {t("imageEdit.clear")}
      </Button>
      <Button
        onClick={onEdit}
        disabled={isEditing || !hasPrompt || !hasImage}
        className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all duration-300 rounded-full"
      >
        {isEditing ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
            {t("imageEdit.editing")}
          </>
        ) : (
          <>
            <Wand2 className="mr-2 h-4 w-4" />
            {t("imageEdit.editImage")}
          </>
        )}
      </Button>
    </div>
  );
};
