import { useTranslation } from "react-i18next";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import {
  Sparkles,
  AlertTriangle,
  X,
  Download,
  Edit,
  Video,
} from "lucide-react";
import Link from "next/link";
import {
  CameraOptionsEnum,
  AspectRatioOptionsEnum,
  AiModelOptionsEnum,
  GenAiStatusEnum,
} from "@/gql/graphql";
import { ImageWithIndex } from "../gallery/ImageGallery";

interface SelectedImageModalProps {
  selectedImage: ImageWithIndex | null;
  closeModal: () => void;
  handleDownloadImage: (imageUrl: string, e: React.MouseEvent) => void;
}

export const SelectedImageModal: React.FC<SelectedImageModalProps> = ({
  selectedImage,
  closeModal,
  handleDownloadImage,
}) => {
  const { t } = useTranslation();

  return (
    <>
      {selectedImage &&
        createPortal(
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4 overflow-y-auto"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", damping: 25 }}
              className="relative max-w-6xl w-full rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-2xl border border-white/10 my-4 md:my-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex-1 bg-gradient-to-b from-gray-900/50 to-black max-h-[50vh] md:max-h-[85vh] relative">
                {selectedImage.isExample && (
                  <div className="absolute top-3 left-3 z-10 bg-purple-600/90 backdrop-blur-sm px-3 py-1 rounded-md text-white text-sm font-medium flex items-center gap-1.5 shadow-lg">
                    <Sparkles className="w-4 h-4" />
                    <span>{t("imageGallery.example")}</span>
                  </div>
                )}

                {selectedImage.status === GenAiStatusEnum.Failed ? (
                  <div className="w-full h-full flex items-center justify-center p-8">
                    <div className="flex flex-col items-center text-center">
                      <AlertTriangle className="w-12 h-12 md:w-16 md:h-16 text-red-500 mb-4" />
                      <h3 className="text-lg md:text-xl font-bold text-white mb-2">
                        {t("imageGallery.errorGeneratingImage")}
                      </h3>
                      <p className="text-gray-400 max-w-md text-sm md:text-base">
                        {t("imageGallery.errorGeneratingImageDescription")}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full max-h-[50vh] md:max-h-[85vh]">
                    <img
                      src={selectedImage.imageUrl || ""}
                      alt={
                        selectedImage.prompt ||
                        `Generated image ${selectedImage.index + 1}`
                      }
                      className="w-full h-auto max-h-[50vh] md:max-h-[85vh] object-contain"
                    />
                  </div>
                )}
              </div>

              <div className="md:w-72 bg-gradient-to-r from-gray-900/90 to-gray-800/90 backdrop-blur-md p-4 md:p-6 flex flex-col">
                <div className="flex justify-between mb-2 md:mb-4">
                  {selectedImage.isExample && (
                    <div className="bg-purple-600/90 backdrop-blur-sm px-2 py-1 rounded-md text-white text-xs font-medium flex items-center gap-1 shadow-lg md:hidden">
                      <Sparkles className="w-3 h-3" />
                      <span>{t("imageGallery.example")}</span>
                    </div>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={closeModal}
                    className="p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors backdrop-blur-sm ml-auto"
                    aria-label="Close modal"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>

                {selectedImage.status !== GenAiStatusEnum.Failed && (
                  <div className="flex flex-col gap-2 md:gap-3 mt-1 md:mt-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) =>
                        handleDownloadImage(selectedImage.imageUrl || "", e)
                      }
                      className="flex items-center justify-center gap-2 p-2 md:p-3 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-medium transition-all duration-300 shadow-lg hover:shadow-purple-500/20 text-sm md:text-base"
                      aria-label="Download image"
                      title="Download image"
                    >
                      <Download className="w-4 h-4 md:w-5 md:h-5" />
                      <span>{t("imageGallery.download")}</span>
                    </motion.button>

                    <Link
                      href={`/dashboard/edit/image?image=${selectedImage.id}`}
                      className="w-full"
                    >
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center justify-center gap-2 p-2 md:p-3 w-full rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-medium transition-all duration-300 shadow-lg hover:shadow-green-500/20 text-sm md:text-base"
                        aria-label="Edit image"
                        title="Edit this image"
                      >
                        <Edit className="w-4 h-4 md:w-5 md:h-5" />
                        <span>{t("imageGallery.edit")}</span>
                      </motion.button>
                    </Link>

                    <Link
                      href={`/dashboard/create/video?image=${selectedImage.id}`}
                      className="w-full"
                    >
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center justify-center gap-2 p-2 md:p-3 w-full rounded-xl bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white font-medium transition-all duration-300 shadow-lg hover:shadow-purple-500/20 text-sm md:text-base"
                        aria-label="Animate image"
                        title="Animate this image"
                      >
                        <Video className="w-4 h-4 md:w-5 md:h-5" />
                        <span>{t("imageGallery.animate")}</span>
                      </motion.button>
                    </Link>
                  </div>
                )}

                <div className="mt-3 md:mt-auto space-y-4">
                  {selectedImage.camera && (
                    <div>
                      <h3 className="text-white text-xs md:text-sm font-medium mb-2 md:mb-3 flex items-center gap-2">
                        <span className="h-1 w-4 md:w-5 bg-purple-500 rounded-full"></span>
                        {selectedImage.camera === CameraOptionsEnum.Selfie
                          ? t("imageCreation.cameraTypes.selfie")
                          : t("imageCreation.cameraTypes.noSelfie")}
                      </h3>
                    </div>
                  )}

                  {selectedImage.aspectRatio && (
                    <div>
                      <h3 className="text-white text-xs md:text-sm font-medium mb-2 md:mb-3 flex items-center gap-2">
                        <span className="h-1 w-4 md:w-5 bg-purple-500 rounded-full"></span>
                        {selectedImage.aspectRatio ===
                        AspectRatioOptionsEnum.Square
                          ? t("imageCreation.aspectRatios.square")
                          : selectedImage.aspectRatio ===
                            AspectRatioOptionsEnum.Portrait
                          ? t("imageCreation.aspectRatios.portrait")
                          : t("imageCreation.aspectRatios.landscape")}
                      </h3>
                    </div>
                  )}

                  {selectedImage.model && (
                    <div>
                      <h3 className="text-white text-xs md:text-sm font-medium mb-2 md:mb-3 flex items-center gap-2">
                        <span className="h-1 w-4 md:w-5 bg-purple-500 rounded-full"></span>
                        {selectedImage.model === AiModelOptionsEnum.Model_1
                          ? t("imageCreation.aiModels.model1")
                          : t("imageCreation.aiModels.model2")}
                      </h3>
                    </div>
                  )}

                  {selectedImage.prompt &&
                    selectedImage.status !== GenAiStatusEnum.Failed && (
                      <div className="bg-black/30 rounded-xl p-3 md:p-4 border border-white/5 hover:border-purple-500/30 transition-colors duration-300">
                        <div className="max-h-40 md:max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-transparent pr-2">
                          <p className="text-white/90 text-xs leading-relaxed">
                            {selectedImage.prompt}
                          </p>
                        </div>
                      </div>
                    )}
                </div>
              </div>
            </motion.div>
          </motion.div>,
          document.body
        )}
    </>
  );
};
