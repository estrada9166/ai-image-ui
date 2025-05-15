"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ImageIcon, Wand2, Sparkles, RefreshCw, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { graphql } from "@/gql";
import { ImageTypeOptionsEnum } from "../../gql/graphql";
import { useMutation } from "urql";
import { ImageGallery } from "../gallery/ImageGallery";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CameraOptionsEnum,
  AspectRatioOptionsEnum,
  AiModelOptionsEnum,
} from "@/gql/graphql";
import { promptIdeas } from "./promptIdeas";

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

// Available aspect ratios
const aspectRatios = [
  { value: AspectRatioOptionsEnum.Square, label: "Square (1:1)" },
  { value: AspectRatioOptionsEnum.Portrait, label: "Portrait (9:16)" },
  { value: AspectRatioOptionsEnum.Landscape, label: "Landscape (16:9)" },
];

export default function ImageCreation() {
  const [imagePrompt, setImagePrompt] = useState("");
  const [avatarType, setAvatarType] = useState(CameraOptionsEnum.NoSelfie);
  const [model, setModel] = useState(AiModelOptionsEnum.Model_1);
  const [selectedPromptIdea, setSelectedPromptIdea] = useState("");
  const [aspectRatio, setAspectRatio] = useState(
    AspectRatioOptionsEnum.Portrait
  );

  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [shouldRefetch, setShouldRefetch] = useState(false);

  const [, generateImage] = useMutation(ImageCreationMutation);

  const handleGenerateImage = async () => {
    if (!imagePrompt.trim()) return;

    setIsGeneratingImage(true);

    try {
      setShouldRefetch(true);
      setImagePrompt("");
      setSelectedPromptIdea("");
      await generateImage({
        input: {
          prompt: imagePrompt,
          type: ImageTypeOptionsEnum.Created,
          camera: avatarType,
          aspectRatio: aspectRatio,
          model,
        },
      });
    } catch (error) {
      console.error("Error generating image:", error);
    } finally {
      setIsGeneratingImage(false);
      setShouldRefetch(false);
    }
  };

  const handlePromptIdeaChange = (value: string) => {
    setSelectedPromptIdea(value);
    const selectedIdea = promptIdeas.find((idea) => idea.id === value);
    if (selectedIdea) {
      setImagePrompt(selectedIdea.text);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="border border-purple-100 dark:border-purple-900/30 shadow-xl bg-white/95 backdrop-blur-sm dark:bg-gray-800/95 overflow-hidden rounded-xl">
          <CardContent className="p-8">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-3 flex items-center gap-2 text-purple-700 dark:text-purple-400 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  <Sparkles className="h-6 w-6 text-purple-500" />
                  Create Your Masterpiece
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-6 max-w-3xl">
                  Describe yourself or the person you want to create an avatar
                  for. Be specific about features, style, and appearance for the
                  best results.
                </p>

                <div className="flex flex-col md:flex-row gap-4 mb-5">
                  <div className="w-full md:w-1/5">
                    <label className="text-xs font-medium text-purple-600 dark:text-purple-400 mb-1 block">
                      Camera Type
                    </label>
                    <Select
                      value={avatarType}
                      onValueChange={setAvatarType as (value: string) => void}
                    >
                      <SelectTrigger className="border-purple-100 dark:border-purple-900/50 focus:border-purple-300 focus:ring-purple-500 text-sm rounded-lg shadow-sm hover:border-purple-200 transition-all">
                        <SelectValue placeholder="Avatar type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={CameraOptionsEnum.Selfie}>
                          Selfie
                        </SelectItem>
                        <SelectItem value={CameraOptionsEnum.NoSelfie}>
                          No Selfie
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-full md:w-1/5">
                    <label className="text-xs font-medium text-purple-600 dark:text-purple-400 mb-1 block">
                      Aspect Ratio
                    </label>
                    <Select
                      value={aspectRatio}
                      onValueChange={setAspectRatio as (value: string) => void}
                    >
                      <SelectTrigger className="border-purple-100 dark:border-purple-900/50 focus:border-purple-300 focus:ring-purple-500 text-sm rounded-lg shadow-sm hover:border-purple-200 transition-all">
                        <SelectValue placeholder="Aspect ratio" />
                      </SelectTrigger>
                      <SelectContent>
                        {aspectRatios.map((ratio) => (
                          <SelectItem key={ratio.value} value={ratio.value}>
                            {ratio.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-full md:w-1/5">
                    <label className="text-xs font-medium text-purple-600 dark:text-purple-400 mb-1 block">
                      AI Model
                    </label>
                    <Select
                      value={model}
                      onValueChange={setModel as (value: string) => void}
                    >
                      <SelectTrigger className="border-purple-100 dark:border-purple-900/50 focus:border-purple-300 focus:ring-purple-500 text-sm rounded-lg shadow-sm hover:border-purple-200 transition-all">
                        <SelectValue placeholder="Select model" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={AiModelOptionsEnum.Model_1}>
                          AI Model 1
                        </SelectItem>
                        <SelectItem value={AiModelOptionsEnum.Model_2}>
                          AI Model 2
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-full md:w-2/5">
                    <label className="text-xs font-medium text-purple-600 dark:text-purple-400 mb-1 block">
                      Prompt Ideas
                    </label>
                    <Select
                      value={selectedPromptIdea}
                      onValueChange={handlePromptIdeaChange}
                    >
                      <SelectTrigger className="border-purple-100 dark:border-purple-900/50 focus:border-purple-300 focus:ring-purple-500 text-sm rounded-lg shadow-sm hover:border-purple-200 transition-all">
                        <SelectValue placeholder="Choose a prompt idea or write your own" />
                      </SelectTrigger>
                      <SelectContent>
                        {promptIdeas.map((idea) => (
                          <SelectItem key={idea.id} value={idea.id}>
                            <div className="flex items-center gap-2">
                              <BookOpen className="h-4 w-4 text-purple-500" />
                              <span className="truncate">
                                {idea.text.substring(0, 50)}...
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Textarea
                  placeholder="A professional-looking person with short brown hair, blue eyes, wearing a business suit..."
                  className="min-h-[150px] resize-none border-purple-100 dark:border-purple-900/50 focus:border-purple-300 focus:ring-purple-500 rounded-lg shadow-sm text-base"
                  value={imagePrompt}
                  onChange={(e) => setImagePrompt(e.target.value)}
                  disabled={isGeneratingImage}
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => {
                    setImagePrompt("");
                    setSelectedPromptIdea("");
                  }}
                  disabled={!imagePrompt.trim() || isGeneratingImage}
                  className="border-purple-200 text-purple-700 hover:bg-purple-50 dark:border-purple-900/30 dark:text-purple-400 dark:hover:bg-purple-900/20 rounded-lg px-5 py-2 transition-all duration-300"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Clear
                </Button>
                <Button
                  onClick={handleGenerateImage}
                  disabled={isGeneratingImage || !imagePrompt.trim()}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all duration-300 rounded-lg px-5 py-2"
                >
                  {isGeneratingImage ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
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
                      <Wand2 className="mr-2 h-5 w-5" />
                      Generate Image
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Generated Images Gallery */}
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-6"
        >
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-3 border-b border-purple-100 dark:border-purple-900/30 pb-3">
            <ImageIcon className="h-5 w-5 text-purple-500" />
            Your Creations
            <span className="text-sm text-gray-500 dark:text-gray-400 font-normal"></span>
          </h3>

          <ImageGallery
            type={[ImageTypeOptionsEnum.Created]}
            shouldRefetch={shouldRefetch}
            showPrompt={false}
            tab="images"
            loadPartialGallery
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
