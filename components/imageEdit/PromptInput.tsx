import { Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Textarea } from "@/components/ui/textarea";
import { PromptInputProps } from "./types";

export const PromptInput = ({
  value,
  onChange,
  isDisabled,
}: PromptInputProps) => {
  const { t } = useTranslation();
  return (
    <div className="space-y-3">
      <h3 className="text-base font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-purple-500" />
        {t("imageEdit.editInstructions")}
      </h3>
      <Textarea
        placeholder={t("imageEdit.editInstructionsPlaceholder")}
        className="min-h-[100px] text-base resize-none border-purple-100 dark:border-purple-900/50 focus:border-purple-300 focus:ring-purple-500 transition-colors duration-200 rounded-lg"
        value={value}
        onChange={onChange}
        disabled={isDisabled}
      />
    </div>
  );
};
