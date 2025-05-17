"use client";

import React from "react";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ImageIcon, VideoIcon, CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

export function NavRemainingPlan() {
  const { t } = useTranslation();

  const imagesRemaining = 10;
  const videosRemaining = 10;
  const resetDate = new Date();

  // Calculate days remaining until reset
  const daysRemaining = resetDate
    ? Math.ceil(
        (new Date(resetDate).getTime() - new Date().getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : 0;

  // Calculate progress percentage (assuming 30-day cycle)
  const progressPercentage = 100 - (daysRemaining / 30) * 100;

  // Determine color based on remaining resources
  const getLimitColor = (remaining: number) => {
    if (remaining <= 3) return "text-red-500";
    if (remaining <= 5) return "text-amber-500";
    return "text-emerald-500";
  };

  return (
    <div className="bg-gradient-to-br from-muted/70 to-muted/40 backdrop-blur-sm rounded-xl p-4 mb-3 shadow-sm border border-muted/20">
      <h3 className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
        {t("navRemainingPlan.yourPlanUsage")}
      </h3>

      <div className="space-y-2 mb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-xs">{t("navRemainingPlan.images")}</span>
          </div>
          <span
            className={cn(
              "text-xs font-medium",
              getLimitColor(imagesRemaining)
            )}
          >
            {imagesRemaining} {t("navRemainingPlan.left")}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <VideoIcon className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-xs">{t("navRemainingPlan.videos")}</span>
          </div>
          <span
            className={cn(
              "text-xs font-medium",
              getLimitColor(videosRemaining)
            )}
          >
            {videosRemaining} {t("navRemainingPlan.left")}
          </span>
        </div>
      </div>

      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-1.5">
            <CalendarIcon className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-xs text-muted-foreground">
              {t("navRemainingPlan.resetsIn", { days: daysRemaining })}
            </span>
          </div>
          <span className="text-xs font-medium">
            {Math.round(progressPercentage)}%
          </span>
        </div>
        <Progress value={progressPercentage} className="h-1.5 bg-muted" />
      </div>

      <Link href="/dashboard/settings/plan" className="w-full block">
        <Button
          variant="outline"
          size="sm"
          className="w-full bg-background/50 hover:bg-background/80 transition-all border-muted-foreground/20 hover:border-muted-foreground/40 text-xs"
        >
          {t("navRemainingPlan.upgrade")}
        </Button>
      </Link>
    </div>
  );
}

export default NavRemainingPlan;
