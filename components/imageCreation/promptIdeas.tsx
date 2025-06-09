import { TFunction } from "i18next";

export enum PromptCategory {
  AI_MODEL = "AI_MODEL",
  OTHER_IMAGE = "OTHER_IMAGE",
}

export const promptIdeas = (t: TFunction) => [
  {
    id: "1",
    text: t("imageCreationPromptIdeas.idea1"),
    category: PromptCategory.AI_MODEL,
  },
  {
    id: "2",
    text: t("imageCreationPromptIdeas.idea2"),
    category: PromptCategory.AI_MODEL,
  },
  {
    id: "3",
    text: t("imageCreationPromptIdeas.idea3"),
    category: PromptCategory.AI_MODEL,
  },
  {
    id: "4",
    text: t("imageCreationPromptIdeas.idea4"),
    category: PromptCategory.AI_MODEL,
  },
  {
    id: "5",
    text: t("imageCreationPromptIdeas.idea5"),
    category: PromptCategory.AI_MODEL,
  },
  {
    id: "6",
    text: t("imageCreationPromptIdeas.idea6"),
    category: PromptCategory.AI_MODEL,
  },
  {
    id: "7",
    text: t("imageCreationPromptIdeas.idea7"),
    category: PromptCategory.AI_MODEL,
  },
  {
    id: "8",
    text: t("imageCreationPromptIdeas.idea8"),
    category: PromptCategory.OTHER_IMAGE,
  },
  {
    id: "9",
    text: t("imageCreationPromptIdeas.idea9"),
    category: PromptCategory.OTHER_IMAGE,
  },
  {
    id: "10",
    text: t("imageCreationPromptIdeas.idea10"),
    category: PromptCategory.OTHER_IMAGE,
  },
  {
    id: "11",
    text: t("imageCreationPromptIdeas.idea11"),
    category: PromptCategory.OTHER_IMAGE,
  },
  {
    id: "12",
    text: t("imageCreationPromptIdeas.idea12"),
    category: PromptCategory.OTHER_IMAGE,
  },
  {
    id: "13",
    text: t("imageCreationPromptIdeas.idea13"),
    category: PromptCategory.OTHER_IMAGE,
  },
  {
    id: "14",
    text: t("imageCreationPromptIdeas.idea14"),
    category: PromptCategory.OTHER_IMAGE,
  },
  {
    id: "15",
    text: t("imageCreationPromptIdeas.idea15"),
    category: PromptCategory.OTHER_IMAGE,
  },
  {
    id: "16",
    text: t("imageCreationPromptIdeas.idea16"),
    category: PromptCategory.OTHER_IMAGE,
  },
];
