"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ImageIcon, Wand2, Sparkles, RefreshCw, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { graphql } from "@/gql";
import {
  GenderOptionsEnum,
  ImageTypeOptionsEnum,
  ImageCreationTypeEnum,
} from "../../gql/graphql";
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
import { promptIdeas, PromptCategory } from "./promptIdeas";
import { useTranslation } from "react-i18next";
import { Checkout } from "../checkout/Checkout";
import { useUsageQuery } from "../common/useUsageQuery";

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
  const { t } = useTranslation();

  const { data: usageData, reexecuteQuery } = useUsageQuery();

  const [imagePrompt, setImagePrompt] = useState("");
  const [avatarType, setAvatarType] = useState(CameraOptionsEnum.NoSelfie);
  const [model, setModel] = useState(AiModelOptionsEnum.Model_1);
  const [selectedPromptIdea, setSelectedPromptIdea] = useState("");
  const [aspectRatio, setAspectRatio] = useState(
    AspectRatioOptionsEnum.Portrait
  );

  // Add new state variables for conditional logic
  const [imageCreationType, setImageCreationType] =
    useState<ImageCreationTypeEnum>(ImageCreationTypeEnum.AiModel);
  const [gender, setGender] = useState<GenderOptionsEnum>(
    GenderOptionsEnum.Male
  );
  const [age, setAge] = useState(25);

  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [shouldRefetch, setShouldRefetch] = useState(false);
  const [canGenerateImage, setCanGenerateImage] = useState(false);

  const [, generateImage] = useMutation(ImageCreationMutation);

  useEffect(() => {
    const imagesUsage = usageData?.me?.planFeaturesUsage?.images;
    if (!imagesUsage || imagesUsage.used >= imagesUsage.limit) {
      setCanGenerateImage(false);
    } else {
      setCanGenerateImage(true);
    }
  }, [usageData]);

  // Available aspect ratios
  const aspectRatios = [
    {
      value: AspectRatioOptionsEnum.Square,
      label: t("imageCreation.aspectRatios.square"),
    },
    {
      value: AspectRatioOptionsEnum.Portrait,
      label: t("imageCreation.aspectRatios.portrait"),
    },
    {
      value: AspectRatioOptionsEnum.Landscape,
      label: t("imageCreation.aspectRatios.landscape"),
    },
  ];

  // Filter prompt ideas based on image creation type
  const getFilteredPromptIdeas = () => {
    const allIdeas = promptIdeas(t);
    if (imageCreationType === ImageCreationTypeEnum.AiModel) {
      return allIdeas.filter(
        (idea) => idea.category === PromptCategory.AI_MODEL
      );
    } else {
      return allIdeas.filter(
        (idea) => idea.category === PromptCategory.OTHER_IMAGE
      );
    }
  };

  const handleGenerateImage = async () => {
    if (!imagePrompt.trim()) return;

    setIsGeneratingImage(true);

    try {
      setImagePrompt("");
      setSelectedPromptIdea("");
      await generateImage({
        input: {
          prompt: imagePrompt,
          camera:
            imageCreationType === ImageCreationTypeEnum.AiModel
              ? avatarType
              : CameraOptionsEnum.NoSelfie,
          aspectRatio: aspectRatio,
          model:
            imageCreationType === ImageCreationTypeEnum.OtherImage
              ? model
              : AiModelOptionsEnum.Model_2,
          gender: gender,
          age: age,
          imageCreationType: imageCreationType,
        },
      });
      reexecuteQuery({
        requestPolicy: "network-only",
      });
      setShouldRefetch(true);
    } catch (error) {
      console.error("Error generating image:", error);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handlePromptIdeaChange = (value: string) => {
    setSelectedPromptIdea(value);
    const filteredIdeas = getFilteredPromptIdeas();
    const selectedIdea = filteredIdeas.find((idea) => idea.id === value);
    if (selectedIdea) {
      setImagePrompt(selectedIdea.text);
    }
  };

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= 1500) {
      setImagePrompt(value);
    }
  };

  const handleImageTypeChange = (value: ImageCreationTypeEnum) => {
    setImageCreationType(value);
    // Clear prompt and selected idea when changing type
    setImagePrompt("");
    setSelectedPromptIdea("");

    // Reset to default values based on type
    if (value === ImageCreationTypeEnum.AiModel) {
      setAvatarType(CameraOptionsEnum.NoSelfie);
      setGender(GenderOptionsEnum.Male);
      setAge(25);
    } else {
      setModel(AiModelOptionsEnum.Model_1);
    }
  };

  const handleAgeChange = (value: string) => {
    const numericValue = parseInt(value);
    if (!isNaN(numericValue)) {
      setAge(numericValue);
    }
  };

  // Generate age options from 18 to 99
  const ageOptions = Array.from({ length: 82 }, (_, i) => i + 18);

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
                  {t("imageCreation.title")}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-6 max-w-3xl">
                  {t("imageCreation.description")}
                </p>

                {/* Image Creation Type Selection */}
                <div className="mb-6">
                  <label className="text-xs font-medium text-purple-600 dark:text-purple-400 mb-2 block">
                    {t("imageCreation.creationType")}
                  </label>
                  <Select
                    value={imageCreationType}
                    onValueChange={handleImageTypeChange}
                  >
                    <SelectTrigger className="border-purple-100 dark:border-purple-900/50 focus:border-purple-300 focus:ring-purple-500 text-sm rounded-lg shadow-sm hover:border-purple-200 transition-all max-w-xs">
                      <SelectValue
                        placeholder={t(
                          "imageCreation.placeholders.selectCreationType"
                        )}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={ImageCreationTypeEnum.AiModel}>
                        {t("imageCreation.creationTypes.aiModel")}
                      </SelectItem>
                      <SelectItem value={ImageCreationTypeEnum.OtherImage}>
                        {t("imageCreation.creationTypes.otherImage")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col md:flex-row gap-4 mb-5">
                  {/* Conditional controls based on image creation type */}
                  {imageCreationType === ImageCreationTypeEnum.AiModel ? (
                    <>
                      <div className="w-full md:w-1/5">
                        <label className="text-xs font-medium text-purple-600 dark:text-purple-400 mb-1 block">
                          {t("imageCreation.cameraType")}
                        </label>
                        <Select
                          value={avatarType}
                          onValueChange={
                            setAvatarType as (value: string) => void
                          }
                        >
                          <SelectTrigger className="border-purple-100 dark:border-purple-900/50 focus:border-purple-300 focus:ring-purple-500 text-sm rounded-lg shadow-sm hover:border-purple-200 transition-all">
                            <SelectValue
                              placeholder={t(
                                "imageCreation.placeholders.selectCameraType"
                              )}
                            />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={CameraOptionsEnum.Selfie}>
                              {t("imageCreation.cameraTypes.selfie")}
                            </SelectItem>
                            <SelectItem value={CameraOptionsEnum.NoSelfie}>
                              {t("imageCreation.cameraTypes.noSelfie")}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="w-full md:w-1/5">
                        <label className="text-xs font-medium text-purple-600 dark:text-purple-400 mb-1 block">
                          {t("imageCreation.gender")}
                        </label>
                        <Select
                          value={gender}
                          onValueChange={setGender as (value: string) => void}
                        >
                          <SelectTrigger className="border-purple-100 dark:border-purple-900/50 focus:border-purple-300 focus:ring-purple-500 text-sm rounded-lg shadow-sm hover:border-purple-200 transition-all">
                            <SelectValue
                              placeholder={t(
                                "imageCreation.placeholders.selectGender"
                              )}
                            />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={GenderOptionsEnum.Male}>
                              {t("imageCreation.genders.male")}
                            </SelectItem>
                            <SelectItem value={GenderOptionsEnum.Female}>
                              {t("imageCreation.genders.female")}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="w-full md:w-1/5">
                        <label className="text-xs font-medium text-purple-600 dark:text-purple-400 mb-1 block">
                          {t("imageCreation.age")}
                        </label>
                        <Select
                          value={age.toString()}
                          onValueChange={handleAgeChange}
                        >
                          <SelectTrigger className="border-purple-100 dark:border-purple-900/50 focus:border-purple-300 focus:ring-purple-500 text-sm rounded-lg shadow-sm hover:border-purple-200 transition-all">
                            <SelectValue
                              placeholder={t(
                                "imageCreation.placeholders.selectAge"
                              )}
                            />
                          </SelectTrigger>
                          <SelectContent className="max-h-60">
                            {ageOptions.map((ageOption) => (
                              <SelectItem
                                key={ageOption}
                                value={ageOption.toString()}
                              >
                                {ageOption}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  ) : (
                    <div className="w-full md:w-1/5">
                      <label className="text-xs font-medium text-purple-600 dark:text-purple-400 mb-1 block">
                        {t("imageCreation.aiModel")}
                      </label>
                      <Select
                        value={model}
                        onValueChange={setModel as (value: string) => void}
                      >
                        <SelectTrigger className="border-purple-100 dark:border-purple-900/50 focus:border-purple-300 focus:ring-purple-500 text-sm rounded-lg shadow-sm hover:border-purple-200 transition-all">
                          <SelectValue
                            placeholder={t(
                              "imageCreation.placeholders.selectModel"
                            )}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={AiModelOptionsEnum.Model_1}>
                            {t("imageCreation.aiModels.model1")}
                          </SelectItem>
                          <SelectItem value={AiModelOptionsEnum.Model_2}>
                            {t("imageCreation.aiModels.model2")}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* Aspect Ratio - shown for both types */}
                  <div className="w-full md:w-1/5">
                    <label className="text-xs font-medium text-purple-600 dark:text-purple-400 mb-1 block">
                      {t("imageCreation.aspectRatio")}
                    </label>
                    <Select
                      value={aspectRatio}
                      onValueChange={setAspectRatio as (value: string) => void}
                    >
                      <SelectTrigger className="border-purple-100 dark:border-purple-900/50 focus:border-purple-300 focus:ring-purple-500 text-sm rounded-lg shadow-sm hover:border-purple-200 transition-all">
                        <SelectValue
                          placeholder={t(
                            "imageCreation.placeholders.selectAspectRatio"
                          )}
                        />
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

                  {/* Prompt Ideas - filtered based on type */}
                  <div className="w-full md:w-2/5">
                    <label className="text-xs font-medium text-purple-600 dark:text-purple-400 mb-1 block">
                      {t("imageCreation.promptIdeas")}
                    </label>
                    <Select
                      value={selectedPromptIdea}
                      onValueChange={handlePromptIdeaChange}
                    >
                      <SelectTrigger className="border-purple-100 dark:border-purple-900/50 focus:border-purple-300 focus:ring-purple-500 text-sm rounded-lg shadow-sm hover:border-purple-200 transition-all">
                        <SelectValue
                          placeholder={t("imageCreation.promptIdeaPlaceholder")}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {getFilteredPromptIdeas().map((idea) => (
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
                  placeholder={
                    imageCreationType === ImageCreationTypeEnum.AiModel
                      ? t("imageCreation.placeholderAiModel")
                      : t("imageCreation.placeholderOtherImage")
                  }
                  className="min-h-[150px] resize-none border-purple-100 dark:border-purple-900/50 focus:border-purple-300 focus:ring-purple-500 rounded-lg shadow-sm text-base"
                  value={imagePrompt}
                  onChange={handlePromptChange}
                  disabled={isGeneratingImage}
                  maxLength={1500}
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
                  {t("imageCreation.clear")}
                </Button>
                {canGenerateImage ? (
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
                        {t("imageCreation.generatingMagic")}
                      </>
                    ) : (
                      <>
                        <Wand2 className="mr-2 h-5 w-5" />
                        {t("imageCreation.generateImage")}
                      </>
                    )}
                  </Button>
                ) : (
                  <Checkout
                    trigger={
                      <Button
                        disabled={!imagePrompt.trim()}
                        className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all duration-300 rounded-lg px-5 py-2"
                      >
                        <Wand2 className="mr-2 h-5 w-5" />
                        {t("imageCreation.generateImage")}
                      </Button>
                    }
                  />
                )}
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
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-purple-500" />
            {t("imageCreation.yourCreations")}
            <span className="text-sm text-gray-500 dark:text-gray-400 font-normal"></span>
          </h3>

          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-violet-100 dark:border-violet-900/30">
            <ImageGallery
              type={[ImageTypeOptionsEnum.Created]}
              shouldRefetch={shouldRefetch}
              showPrompt={false}
              tab="images"
              loadPartialGallery
            />
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
