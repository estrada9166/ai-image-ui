"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ImageIcon, Wand2, Sparkles, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { graphql } from "@/gql";
import { ImageTypeOptionsEnum } from "../../gql/graphql";
import { useMutation } from "urql";
import { ImageGallery } from "../gallery/ImageGallery";

const ImageCreationMutation = graphql(/* GraphQL */ `
  mutation ImageCreation($input: ImageCreationInput!) {
    imageCreation(input: $input) {
      id
      prompt
      status
      imageUrl
    }
  }
`);

type ImageCreation = {
  id: string;
  prompt?: string | null;
  status: string;
  imageUrl?: string | null;
};

export default function ImageCreation() {
  const [imagePrompt, setImagePrompt] = useState("");

  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [shouldRefetch, setShouldRefetch] = useState(false);

  const [, generateImage] = useMutation(ImageCreationMutation);

  const handleGenerateImage = async () => {
    if (!imagePrompt.trim()) return;

    setIsGeneratingImage(true);

    try {
      setShouldRefetch(true);
      await generateImage({
        input: {
          prompt: imagePrompt,
          type: ImageTypeOptionsEnum.Created,
        },
      });
    } catch (error) {
      console.error("Error generating image:", error);
    } finally {
      setIsGeneratingImage(false);
      setShouldRefetch(false);
    }
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
          AI Visual Studio
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Transform your ideas into stunning visuals with our AI-powered tools.
          Create images and videos with just a few words.
        </p>
      </motion.div>

      <div className="max-w-5xl mx-auto space-y-6">
        <Card className="border border-purple-100 dark:border-purple-900/30 shadow-lg bg-white/90 backdrop-blur-sm dark:bg-gray-800/90 overflow-hidden">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold mb-2 flex items-center gap-2 text-purple-700 dark:text-purple-400">
                  <Sparkles className="h-5 w-5" />
                  Describe your image
                </h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                  Be detailed and specific for the best results. Try including
                  style, mood, colors, and composition.
                </p>
                <Textarea
                  placeholder="A serene landscape with mountains, a crystal clear lake reflecting the sky, and a small wooden cabin nestled among pine trees at sunset with golden light..."
                  className="min-h-[120px] resize-none border-purple-100 dark:border-purple-900/50 focus:border-purple-300 focus:ring-purple-500"
                  value={imagePrompt}
                  onChange={(e) => setImagePrompt(e.target.value)}
                  disabled={isGeneratingImage}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setImagePrompt("")}
                  disabled={!imagePrompt.trim() || isGeneratingImage}
                  className="border-purple-200 text-purple-700 hover:bg-purple-50 dark:border-purple-900/30 dark:text-purple-400 dark:hover:bg-purple-900/20"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Clear
                </Button>
                <Button
                  onClick={handleGenerateImage}
                  disabled={isGeneratingImage || !imagePrompt.trim()}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all"
                >
                  {isGeneratingImage ? (
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
                      Creating Magic...
                    </>
                  ) : (
                    <>
                      <Wand2 className="mr-2 h-4 w-4" />
                      Generate Image
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Generated Images Gallery */}
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
              Your Creations
              <span className="text-sm text-gray-500 dark:text-gray-400 font-normal"></span>
            </h3>

            <ImageGallery
              type={ImageTypeOptionsEnum.Created}
              shouldRefetch={shouldRefetch}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}
