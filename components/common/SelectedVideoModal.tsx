import React from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { Download, Sparkles, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { VideoWithIndex } from "../gallery/VideoGallery";

interface SelectedVideoModalProps {
  selectedVideo: VideoWithIndex | null;
  closeModal: () => void;
  handleDownloadVideo: (video: VideoWithIndex, e: React.MouseEvent) => void;
}

export const SelectedVideoModal: React.FC<SelectedVideoModalProps> = ({
  selectedVideo,
  closeModal,
  handleDownloadVideo,
}) => {
  const { t } = useTranslation();

  if (!selectedVideo) return null;

  return createPortal(
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
          {selectedVideo.isExample && (
            <div className="absolute top-3 left-3 z-10 bg-purple-600/90 backdrop-blur-sm px-3 py-1 rounded-md text-white text-sm font-medium flex items-center gap-1.5 shadow-lg">
              <Sparkles className="w-4 h-4" />
              <span>{t("videoGallery.example")}</span>
            </div>
          )}
          <video
            src={selectedVideo.videoUrl || ""}
            controls
            autoPlay
            className="w-full h-auto max-h-[50vh] md:max-h-[85vh] object-contain"
            poster={
              selectedVideo.originalImages?.[0]?.thumbnailUrl ?? undefined
            }
          />
        </div>

        <div className="md:w-72 bg-gradient-to-r from-gray-900/90 to-gray-800/90 backdrop-blur-md p-4 md:p-6 flex flex-col">
          <div className="flex justify-end mb-2 md:mb-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={closeModal}
              className="p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-all duration-300 backdrop-blur-sm hover:shadow-lg hover:shadow-purple-500/20"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </motion.button>
          </div>

          <div className="flex flex-col gap-2 md:gap-4 mb-4 md:mb-8">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => handleDownloadVideo(selectedVideo, e)}
              className="flex items-center justify-center gap-2 p-2 md:p-3 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-medium transition-all duration-300 shadow-lg hover:shadow-purple-500/20 text-sm md:text-base"
              aria-label="Download video"
              title="Download video"
            >
              <Download className="w-4 h-4 md:w-5 md:h-5" />
              <span>{t("videoGallery.download")}</span>
            </motion.button>
          </div>

          {selectedVideo.prompt && (
            <div className="mt-auto">
              <h3 className="text-white text-xs md:text-sm font-medium mb-2 md:mb-3 flex items-center gap-2">
                <span className="h-1 w-5 bg-purple-500 rounded-full"></span>
                Prompt
              </h3>
              <div className="bg-black/30 rounded-xl p-3 md:p-4 border border-white/5 hover:border-purple-500/30 transition-colors duration-300">
                <div className="max-h-40 md:max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-transparent pr-2">
                  <p className="text-white/90 text-xs leading-relaxed">
                    {selectedVideo.prompt}
                  </p>
                </div>
              </div>
            </div>
          )}

          {selectedVideo.negativePrompt && (
            <div className="mt-3">
              <h3 className="text-white text-xs md:text-sm font-medium mb-2 md:mb-3 flex items-center gap-2">
                <span className="h-1 w-5 bg-purple-500 rounded-full"></span>
                {t("videoGallery.negativePrompt")}
              </h3>
              <div className="bg-black/30 rounded-xl p-3 md:p-4 border border-white/5 hover:border-purple-500/30 transition-colors duration-300">
                <div className="max-h-40 md:max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-transparent pr-2">
                  <p className="text-white/90 text-xs leading-relaxed">
                    {selectedVideo.negativePrompt}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>,
    document.body
  );
};
