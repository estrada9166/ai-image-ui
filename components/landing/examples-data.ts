import i18n from "i18next";

export const getTranslatedExampleImages = () => {
  const t = i18n.t;

  return {
    enhancement: {
      title: t("landing.examples.items.enhancement.title"),
      description: t("landing.examples.items.enhancement.description"),
      before:
        "https://images.unsplash.com/photo-1621961458348-f013d219b50c?q=80&w=2069&auto=format&fit=crop",
      after:
        "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=2070&auto=format&fit=crop",
    },
    editing: {
      title: t("landing.examples.items.editing.title"),
      description: t("landing.examples.items.editing.description"),
      before:
        "https://images.unsplash.com/photo-1558403194-611308249627?q=80&w=2070&auto=format&fit=crop",
      after:
        "https://images.unsplash.com/photo-1561571994-3c61c554181a?q=80&w=2070&auto=format&fit=crop",
    },
    restoration: {
      title: t("landing.examples.items.restoration.title"),
      description: t("landing.examples.items.restoration.description"),
      before:
        "https://images.unsplash.com/photo-1610126996694-69e2f0b5931f?q=80&w=1974&auto=format&fit=crop",
      after:
        "https://images.unsplash.com/photo-1627037558426-c2d07beda3af?q=80&w=1975&auto=format&fit=crop",
    },
    removal: {
      title: t("landing.examples.items.removal.title"),
      description: t("landing.examples.items.removal.description"),
      before:
        "https://images.unsplash.com/photo-1566438480900-0609be27a4be?q=80&w=2094&auto=format&fit=crop",
      after:
        "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?q=80&w=2070&auto=format&fit=crop",
    },
    upscaling: {
      title: t("landing.examples.items.upscaling.title"),
      description: t("landing.examples.items.upscaling.description"),
      before:
        "https://images.unsplash.com/photo-1598797363975-d641fce0bce8?q=80&w=1964&auto=format&fit=crop",
      after:
        "https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?q=80&w=1887&auto=format&fit=crop",
    },
    style: {
      title: t("landing.examples.items.style.title"),
      description: t("landing.examples.items.style.description"),
      before:
        "https://images.unsplash.com/photo-1532009877282-3340270e0529?q=80&w=2070&auto=format&fit=crop",
      after:
        "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=2045&auto=format&fit=crop",
    },
  };
};

export const exampleImages = getTranslatedExampleImages();
