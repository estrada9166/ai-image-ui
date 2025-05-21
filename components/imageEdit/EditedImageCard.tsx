import { ImageIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProcessingEditedImage } from "./ProcessingEditedImage";
import { EditedImageDisplay } from "./EditedImageDisplay";
import { EmptyEditedImage } from "./EmptyEditedImage";
import { EditedImageCardProps } from "./types";

export const EditedImageCard = ({
  isEditingImage,
  editedImageUrl,
  imagePrompt,
}: EditedImageCardProps) => {
  const { t } = useTranslation();
  return (
    <Card className="border border-purple-100 dark:border-purple-900/30 shadow-lg bg-white/95 backdrop-blur-sm dark:bg-gray-800/95 overflow-hidden hover:shadow-xl transition-all duration-300 rounded-xl">
      <CardContent className="p-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-purple-500" />
            {t("imageEdit.editedImage")}
          </h3>
          {isEditingImage && (
            <Badge className="text-sm py-1 px-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 animate-pulse shadow-sm rounded-full">
              {t("imageEdit.editing")}
            </Badge>
          )}
        </div>
        <div
          className="relative overflow-hidden rounded-xl border border-purple-100 dark:border-purple-900/50 bg-gray-100 dark:bg-gray-700 shadow-inner w-full h-auto"
          style={{ aspectRatio: "1/1" }}
        >
          {isEditingImage ? (
            <ProcessingEditedImage />
          ) : editedImageUrl ? (
            <EditedImageDisplay imageUrl={editedImageUrl} />
          ) : (
            <EmptyEditedImage hasPrompt={!!imagePrompt.trim()} />
          )}
        </div>
      </CardContent>
    </Card>
  );
};
