"use client";

import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";

if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    loaded: (posthog) => {
      if (process.env.NEXT_PUBLIC_ENV === "development") posthog.debug();
    },
  });
}

type CSPostHogProviderType = {
  children: React.ReactNode;
};

export function CSPostHogProvider(props: CSPostHogProviderType) {
  return <PostHogProvider client={posthog}>{props.children}</PostHogProvider>;
}
