"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ImageIcon, Wand2, Sparkles, RefreshCw, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { ImageGallery } from "../gallery/ImageGallery";
import { ImageTypeOptionsEnum } from "../../gql/graphql";
import axios from "axios";

type ImageEdit = {
  id: string;
  prompt?: string | null;
  status: string;
  imageUrl?: string | null;
};

// Predefined prompt ideas
const promptIdeas = [
  {
    id: "1",
    text: "Change the background to a sunny beach",
  },
  {
    id: "2",
    text: "Remove the background and replace with a gradient",
  },
  {
    id: "3",
    text: "Add a soft bokeh effect to the background",
  },
  {
    id: "4",
    text: "Make the image look like a professional studio portrait",
  },
  {
    id: "5",
    text: "Convert the image to a watercolor painting style",
  },
];

export default function ImageEdit() {
  const [imagePrompt, setImagePrompt] = useState("");
  const [selectedPromptIdea, setSelectedPromptIdea] = useState("");
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isEditingImage, setIsEditingImage] = useState(false);
  const [shouldRefetch, setShouldRefetch] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setUploadedImage(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleEditImage = async () => {
    if (!imagePrompt.trim() || !uploadedImage) return;

    setIsEditingImage(true);

    try {
      setShouldRefetch(true);

      const formData = new FormData();
      formData.append("file", uploadedImage);
      formData.append("prompt", imagePrompt);

      await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/upload/image`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      setImagePrompt("");
      setSelectedPromptIdea("");
      handleRemoveImage();
    } catch (error) {
      console.error("Error editing image:", error);
    } finally {
      setIsEditingImage(false);
      setShouldRefetch(false);
    }
  };

  const handlePromptIdeaClick = (idea: string) => {
    setImagePrompt(idea);
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl mx-auto text-center mb-8"
      >
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
          AI Image Editor
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Transform your existing photos with AI-powered editing. Upload an
          image and describe how you want to edit it.
        </p>
      </motion.div>

      <div className="max-w-5xl mx-auto space-y-6">
        <Card className="border border-purple-100 dark:border-purple-900/30 shadow-lg bg-white/90 backdrop-blur-sm dark:bg-gray-800/90 overflow-hidden">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold mb-2 flex items-center gap-2 text-purple-700 dark:text-purple-400">
                  <Sparkles className="h-5 w-5" />
                  Edit your image
                </h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                  Upload an image and describe how you want to edit it. Be
                  specific about the changes you want to make.
                </p>

                <div className="mb-6">
                  <div className="flex flex-col items-center justify-center border-2 border-dashed border-purple-200 dark:border-purple-900/50 rounded-lg p-6 transition-all hover:border-purple-300 dark:hover:border-purple-700">
                    {previewUrl ? (
                      <div className="relative w-full max-w-md">
                        <div className="relative aspect-square w-full overflow-hidden rounded-md">
                          <img
                            src={previewUrl}
                            alt="Preview"
                            className="object-cover"
                          />
                        </div>
                        <button
                          onClick={handleRemoveImage}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                          ref={fileInputRef}
                          disabled={isEditingImage}
                        />
                        <Button
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isEditingImage}
                          className="border-purple-200 text-purple-700 hover:bg-purple-50 dark:border-purple-900/30 dark:text-purple-400 dark:hover:bg-purple-900/20"
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          Upload Image
                        </Button>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                          PNG, JPG or WEBP (max. 10MB)
                        </p>
                      </>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Prompt Ideas:
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {promptIdeas.map((idea) => (
                      <button
                        key={idea.id}
                        onClick={() => handlePromptIdeaClick(idea.text)}
                        className="text-xs px-3 py-1 rounded-full bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:hover:bg-purple-900/50 transition-colors"
                      >
                        {idea.text}
                      </button>
                    ))}
                  </div>
                </div>

                <Textarea
                  placeholder="Change the background to a tropical beach scene..."
                  className="min-h-[120px] resize-none border-purple-100 dark:border-purple-900/50 focus:border-purple-300 focus:ring-purple-500"
                  value={imagePrompt}
                  onChange={(e) => setImagePrompt(e.target.value)}
                  disabled={isEditingImage}
                />
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setImagePrompt("");
                    setSelectedPromptIdea("");
                  }}
                  disabled={!imagePrompt.trim() || isEditingImage}
                  className="border-purple-200 text-purple-700 hover:bg-purple-50 dark:border-purple-900/30 dark:text-purple-400 dark:hover:bg-purple-900/20"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Clear
                </Button>
                <Button
                  onClick={handleEditImage}
                  disabled={
                    isEditingImage || !imagePrompt.trim() || !uploadedImage
                  }
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all"
                >
                  {isEditingImage ? (
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
                      Editing...
                    </>
                  ) : (
                    <>
                      <Wand2 className="mr-2 h-4 w-4" />
                      Edit Image
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Edited Images Gallery */}
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-purple-500" />
              Your Edited Images
              <span className="text-sm text-gray-500 dark:text-gray-400 font-normal"></span>
            </h3>

            <ImageGallery
              type={ImageTypeOptionsEnum.Edited}
              shouldRefetch={shouldRefetch}
              showPrompt={true}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}
