import Link from "next/link";
import { Button } from "../ui/button";
import { useTranslation } from "react-i18next";

import { EditIcon, ImageIcon, VideoIcon, RefreshCwIcon } from "lucide-react";

// Empty state component for when there are no images
export const EmptyGalleryState = ({
  tab,
}: {
  tab: "images" | "edited-images" | "restored-images" | "video";
}) => {
  const { t } = useTranslation();

  // Define configuration for each tab type
  const tabConfig = {
    images: {
      title: t("emptyGalleryState.images.title"),
      description: t("emptyGalleryState.images.description"),
      buttonText: t("emptyGalleryState.images.buttonText"),
      link: "/dashboard/create/image",
      Icon: ImageIcon,
    },
    "edited-images": {
      title: t("emptyGalleryState.editedImages.title"),
      description: t("emptyGalleryState.editedImages.description"),
      buttonText: t("emptyGalleryState.editedImages.buttonText"),
      link: "/dashboard/edit/image",
      Icon: EditIcon,
    },
    "restored-images": {
      title: t("emptyGalleryState.restoredImages.title"),
      description: t("emptyGalleryState.restoredImages.description"),
      buttonText: t("emptyGalleryState.restoredImages.buttonText"),
      link: "/dashboard/edit/restore",
      Icon: RefreshCwIcon,
    },
    video: {
      title: t("emptyGalleryState.video.title"),
      description: t("emptyGalleryState.video.description"),
      buttonText: t("emptyGalleryState.video.buttonText"),
      link: "/dashboard/create/video",
      Icon: VideoIcon,
    },
  };

  // Get configuration for current tab or default to video
  const config = tabConfig[tab] || tabConfig["video"];
  const { title, description, buttonText, link, Icon } = config;

  return (
    <div className="col-span-full py-8 flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-purple-50 dark:from-gray-800 dark:to-purple-900/20 rounded-lg min-h-[300px]">
      <div className="text-center p-8 max-w-md">
        <div className="relative w-20 h-20 mx-auto mb-4">
          <div className="absolute inset-0 bg-purple-200 dark:bg-purple-700/30 rounded-full animate-ping opacity-30"></div>
          <div className="relative flex items-center justify-center w-full h-full bg-gradient-to-r from-purple-400 to-indigo-400 dark:from-purple-600 dark:to-indigo-600 rounded-full shadow-lg">
            <Icon className="h-10 w-10 text-white" />
          </div>
        </div>
        <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-3">
          {title}
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mb-6">{description}</p>
        <Link href={link}>
          <Button className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-medium px-6 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
            {buttonText}
          </Button>
        </Link>
      </div>
    </div>
  );
};
