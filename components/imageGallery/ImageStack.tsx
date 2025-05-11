"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import { useCallback, useMemo, useState } from "react";

interface ImageStackProps {
  images?: string[]; // Array of image URLs
  alt?: string; // Optional alt text for all images
  className?: string;
  setImageUrls?: (urls: string[]) => void;
}

export function ImageStack({
  images = [],
  alt = "Image",
  className = "",
  setImageUrls,
}: ImageStackProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  // Only show up to 4 images - memoize to prevent unnecessary recalculations
  const displayImages = useMemo(() => images.slice(0, 4), [images]);

  const handleCardClick = useCallback((image: string, index: number) => {
    setSelectedImage(image);
    setSelectedIndex(index);
    setIsViewerOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsViewerOpen(false);
    // Don't reset the selected image/index immediately to prevent layout shift
    // during the closing animation
  }, []);

  const handleNextImage = useCallback(() => {
    if (selectedIndex === null || displayImages.length <= 1) return;
    const nextIndex = (selectedIndex + 1) % displayImages.length;
    setSelectedImage(displayImages[nextIndex]);
    setSelectedIndex(nextIndex);
  }, [selectedIndex, displayImages]);

  const handlePrevImage = useCallback(() => {
    if (selectedIndex === null || displayImages.length <= 1) return;
    const prevIndex =
      selectedIndex === 0 ? displayImages.length - 1 : selectedIndex - 1;
    setSelectedImage(displayImages[prevIndex]);
    setSelectedIndex(prevIndex);
  }, [selectedIndex, displayImages]);

  const handleRemoveImage = useCallback(
    (index: number) => {
      if (!setImageUrls) return;

      const newImages = [...images];
      newImages.splice(index, 1);
      setImageUrls(newImages);

      // If we're removing the currently selected image in the viewer, close it
      if (isViewerOpen && selectedIndex === index) {
        setIsViewerOpen(false);
      }
    },
    [images, setImageUrls, isViewerOpen, selectedIndex]
  );

  // Generate random slight rotation for card game feel - memoize rotations
  const rotations = useMemo(() => [-3, -1.5, 0, 1.5, 3], []);
  const getRandomRotation = useCallback(
    (index: number) => rotations[index % rotations.length],
    [rotations]
  );

  // Memoize empty state to prevent unnecessary re-renders
  const emptyState = useMemo(
    () => (
      <div className="flex items-center justify-center w-full h-full text-muted-foreground text-center rounded-xl border border-dashed border-muted-foreground/30 bg-muted/20">
        No images to display
      </div>
    ),
    []
  );

  return (
    <div
      className={`relative w-full aspect-[4/3] ${className}`}
      style={{
        maxWidth: "600px",
        margin: "0 auto",
      }}
    >
      {displayImages.length === 0 ? (
        emptyState
      ) : (
        <div className="relative w-full h-full perspective-1000 flex items-center justify-center">
          {displayImages.map((image, index) => (
            <Card
              key={image + index} // Better key for more stable identity
              src={image}
              alt={`${alt} ${index + 1}`}
              index={index}
              total={displayImages.length}
              onClick={() => handleCardClick(image, index)}
              onRemove={
                setImageUrls ? () => handleRemoveImage(index) : undefined
              }
              rotation={getRandomRotation(index)}
            />
          ))}
        </div>
      )}

      {/* Fullscreen modal for selected image - only render when needed */}
      <AnimatePresence>
        {isViewerOpen && selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative max-w-4xl max-h-[90vh] w-full rounded-xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage || "/placeholder.svg"}
                alt={`${alt} ${
                  selectedIndex !== null ? selectedIndex + 1 : ""
                }`}
                className="w-full h-full object-contain bg-black/90"
                loading="lazy"
              />
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                aria-label="Close"
              >
                <X size={20} />
              </button>

              {setImageUrls && selectedIndex !== null && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveImage(selectedIndex);
                  }}
                  className="absolute top-4 left-4 p-2 rounded-full bg-red-500/70 text-white hover:bg-red-600/90 transition-colors"
                  aria-label="Remove image"
                >
                  <Trash2 size={20} />
                </button>
              )}

              {/* Navigation buttons - only render when needed */}
              {displayImages.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrevImage();
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNextImage();
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                    aria-label="Next image"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}

              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                <p className="text-white text-sm md:text-base">
                  {`${alt} ${selectedIndex !== null ? selectedIndex + 1 : ""}`}
                </p>
                {displayImages.length > 1 && (
                  <div className="flex mt-2 gap-1.5 justify-center">
                    {displayImages.map((_, idx) => (
                      <button
                        key={idx}
                        className={`w-2 h-2 rounded-full ${
                          selectedIndex === idx ? "bg-white" : "bg-white/40"
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCardClick(displayImages[idx], idx);
                        }}
                        aria-label={`View image ${idx + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface CardProps {
  src: string;
  alt: string;
  index: number;
  total: number;
  onClick: () => void;
  onRemove?: () => void;
  rotation: number;
}

const Card = React.memo(function Card({
  src,
  alt,
  index,
  total,
  onClick,
  onRemove,
  rotation,
}: CardProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Calculate position based on number of cards and index
  const getCardStyle = useCallback(() => {
    // Base styles
    const style: React.CSSProperties = {
      zIndex: isHovered ? 10 : total - index,
      transform: isHovered
        ? `translateY(-10px) scale(1.05) rotate(0deg)`
        : `rotate(${rotation}deg)`,
      boxShadow: isHovered
        ? "0 15px 40px 0 rgba(0,0,0,0.35)"
        : "0 8px 24px 0 rgba(0,0,0,0.18)",
      transition: "box-shadow 0.3s, transform 0.3s",
      position: "absolute",
    };

    // For single card, center it
    if (total === 1) {
      return {
        ...style,
        transform: `${style.transform}`,
      };
    }

    // For multiple cards, create a fan effect while keeping them centered
    if (total === 2) {
      // Two cards - one slightly left, one slightly right of center
      return {
        ...style,
        left: index === 0 ? "calc(50% - 28%)" : "calc(50% + 28%)",
        transform: `${style.transform} translateX(-50%)`,
      };
    } else if (total === 3) {
      // Three cards - left, center, right
      const positions = ["calc(50% - 36%)", "50%", "calc(50% + 36%)"];
      return {
        ...style,
        left: positions[index],
        transform: `${style.transform} translateX(-50%)`,
      };
    } else if (total === 4) {
      // Four cards - evenly spaced
      const positions = [
        "calc(50% - 54%)",
        "calc(50% - 18%)",
        "calc(50% + 18%)",
        "calc(50% + 54%)",
      ];
      return {
        ...style,
        left: positions[index],
        transform: `${style.transform} translateX(-50%)`,
      };
    }

    return style;
  }, [index, isHovered, rotation, total]);

  // Card width/height for better fit - memoize to prevent recalculation
  const cardWidth = useMemo(() => {
    if (total === 2) return "60%";
    if (total === 3) return "50%";
    if (total === 4) return "40%";
    return "100%";
  }, [total]);

  return (
    <motion.div
      className="absolute card-wrapper"
      style={{
        width: cardWidth,
        height: "80%",
        top: "10%",
      }}
    >
      <motion.div
        className="relative w-full h-full cursor-pointer"
        style={getCardStyle()}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
          // Don't modify any styles on click to maintain current position
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 20,
          duration: 0.3,
        }}
      >
        <div
          className={`
          relative w-full h-full rounded-2xl overflow-hidden
          bg-white border-2 border-black
          shadow-lg
          ${isHovered ? "ring-2 ring-black/80" : ""}
          transition-all duration-300
        `}
          style={{
            boxShadow: isHovered
              ? "0 20px 40px 0 rgba(0,0,0,0.40)"
              : "0 10px 24px 0 rgba(0,0,0,0.18)",
            borderColor: "#111",
            borderWidth: "2.5px",
          }}
        >
          <img
            src={src || "/placeholder.svg"}
            alt={alt}
            className="w-full h-full object-cover"
            loading="lazy"
            style={{
              borderRadius: "0.9rem",
              border: "1.5px solid #111",
              background: "#18181b",
            }}
          />
          <div
            className={`
            absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent
            opacity-0 transition-opacity duration-300
            ${isHovered ? "opacity-100" : ""}
          `}
          />
          <div
            className={`
            absolute bottom-0 left-0 right-0 p-3
            text-white text-base font-semibold
            transform transition-all duration-300
            ${
              isHovered
                ? "translate-y-0 opacity-100"
                : "translate-y-4 opacity-0"
            }
          `}
          >
            {alt}
          </div>

          {onRemove && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              className={`
                absolute top-2 right-2 p-1.5 rounded-full
                bg-red-300 text-white 
                hover:bg-red-600 transition-colors
                transform scale-110 shadow-md
                ${isHovered ? "opacity-100" : "opacity-70"}
              `}
              aria-label="Remove image"
              title="Remove this image"
            >
              <Trash2 size={16} />
              <span className="sr-only">Delete image</span>
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
});
