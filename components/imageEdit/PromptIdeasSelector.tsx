import { Sparkles, BookOpen } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { promptIdeas } from "./promptIdeas";
import { PromptIdeasSelectorProps } from "./types";

export const PromptIdeasSelector = ({
  onSelectPrompt,
}: PromptIdeasSelectorProps) => {
  const { t } = useTranslation();
  return (
    <div className="space-y-3">
      <h3 className="text-base font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-purple-500" />
        {t("imageEdit.promptIdeas")}
      </h3>
      <Select
        value=""
        onValueChange={(value) => {
          if (value) onSelectPrompt(value);
        }}
      >
        <SelectTrigger className="border-purple-100 dark:border-purple-900/50 focus:border-purple-300 focus:ring-purple-500 text-sm">
          <SelectValue placeholder={t("imageEdit.promptIdeaPlaceholder")} />
        </SelectTrigger>
        <SelectContent>
          {promptIdeas(t).map((idea) => (
            <SelectItem key={idea.id} value={idea.text}>
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                <span className="truncate">
                  {idea.text.substring(0, 50)}...
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
