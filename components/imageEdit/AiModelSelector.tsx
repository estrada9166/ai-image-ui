import { Wand2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { AiModelOptionsEnum } from "../../gql/graphql";
import { AiModelSelectorProps } from "./types";

export const AiModelSelector = ({ model, setModel }: AiModelSelectorProps) => {
  const { t } = useTranslation();
  return (
    <div className="space-y-3">
      <h3 className="text-base font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
        <Wand2 className="h-5 w-5 text-purple-500" />
        {t("imageEdit.aiModel")}
      </h3>
      <Select value={model} onValueChange={setModel as (value: string) => void}>
        <SelectTrigger className="border-purple-100 dark:border-purple-900/50 focus:border-purple-300 focus:ring-purple-500 text-sm rounded-lg shadow-sm hover:border-purple-200 transition-all">
          <SelectValue placeholder="Select model" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={AiModelOptionsEnum.Model_1}>
            {t("imageEdit.model1")}
          </SelectItem>
          <SelectItem value={AiModelOptionsEnum.Model_2}>
            {t("imageEdit.model2")}
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
