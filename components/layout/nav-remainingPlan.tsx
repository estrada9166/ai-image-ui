"use client";

import type React from "react";
import { ImageIcon, VideoIcon, CalendarIcon, CropIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

import { format } from "date-fns";
import { useUsageQuery } from "../common/useUsageQuery";
import { Checkout } from "../checkout/Checkout";
import { Button } from "../ui/button";
import Link from "next/link";

export function NavRemainingPlan() {
  const { t } = useTranslation();
  const { data } = useUsageQuery();

  const usage = data?.me?.planFeaturesUsage;
  const resetDate = usage?.endDate;

  // Format renewal date
  const formattedResetDate = resetDate
    ? format(new Date(resetDate), "MMM d")
    : "";

  // Utility functions
  const getProgressColor = (used: number, limit: number) => {
    const percentage = (used / limit) * 100;
    return percentage >= 80
      ? "bg-rose-500"
      : percentage >= 50
      ? "bg-amber-500"
      : "bg-emerald-500";
  };

  const getUsagePercentage = (used: number, limit: number) =>
    (used / limit) * 100;

  const isFreePlan = data?.me?.planFeaturesUsage?.planId === "FREE_PLAN";

  return (
    <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900/90 dark:to-slate-800/80 backdrop-blur-lg rounded-xl p-2 md:p-3 mb-3 shadow-md border border-slate-200/50 dark:border-slate-700/50 transition-all duration-300 hover:shadow-lg w-full max-w-full overflow-hidden">
      <div className="space-y-1.5 md:space-y-2 mb-2 md:mb-3">
        {[
          {
            icon: (
              <ImageIcon className="w-3 h-3 md:w-3.5 md:h-3.5 text-purple-500" />
            ),
            label: "imageCreation",
            data: usage?.imageCreation,
            link: "/dashboard/create/image",
          },
          {
            icon: (
              <CropIcon className="w-3 h-3 md:w-3.5 md:h-3.5 text-purple-500" />
            ),
            label: "imageEdit",
            data: usage?.editImage,
            link: "/dashboard/edit/image",
          },
          {
            icon: (
              <ImageIcon className="w-3 h-3 md:w-3.5 md:h-3.5 text-purple-500" />
            ),
            label: "imageRestore",
            data: usage?.imageRestoration,
            link: "/dashboard/edit/restore",
          },
          {
            icon: (
              <VideoIcon className="w-3 h-3 md:w-3.5 md:h-3.5 text-purple-500" />
            ),
            label: "videoCreation",
            data: usage?.videoCreation,
            link: "/dashboard/create/video",
          },
        ].map((item, index) => (
          <UsageItem
            key={index}
            icon={item.icon}
            label={t(`navRemainingPlan.${item.label}`)}
            used={item.data?.used || 0}
            limit={item.data?.limit || 0}
            progressColor={getProgressColor(
              item.data?.used || 0,
              item.data?.limit || 0
            )}
            percentage={getUsagePercentage(
              item.data?.used || 0,
              item.data?.limit || 0
            )}
            link={item.link}
          />
        ))}
      </div>

      {!isFreePlan && (
        <div className="flex items-center gap-1 text-[10px] md:text-xs text-slate-500 dark:text-slate-400 py-1 md:py-2">
          <CalendarIcon className="w-2.5 h-2.5 md:w-3 md:h-3 flex-shrink-0" />
          <span className="truncate">
            {t("navRemainingPlan.resetsIn", { date: formattedResetDate })}
          </span>
        </div>
      )}

      {isFreePlan && (
        <Checkout
          trigger={
            <Button
              variant="default"
              size="sm"
              className="w-full bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white border-none shadow-sm hover:shadow-md transition-all duration-300 text-[10px] md:text-xs font-medium py-1"
            >
              {t("navRemainingPlan.upgrade")}
            </Button>
          }
        />
      )}
    </div>
  );
}

interface UsageItemProps {
  icon: React.ReactNode;
  label: string;
  used: number;
  limit: number;
  progressColor: string;
  percentage: number;
  link: string;
}

function UsageItem({
  icon,
  label,
  used,
  limit,
  progressColor,
  percentage,
  link,
}: UsageItemProps) {
  return (
    <div className="group">
      <div className="flex items-center justify-between mb-0.5">
        <Link href={link} className="min-w-0 flex-1">
          <div className="flex items-center gap-1">
            <div className="rounded-md group-hover:bg-purple-100 dark:group-hover:bg-purple-900/30 transition-colors duration-300 flex-shrink-0">
              {icon}
            </div>
            <span className="text-[10px] md:text-xs font-medium text-slate-700 dark:text-slate-200 group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors duration-300 truncate">
              {label}
            </span>
          </div>
        </Link>
        <span className="text-[10px] md:text-xs font-semibold text-slate-800 dark:text-slate-100 flex-shrink-0 ml-1">
          {used}/{limit}
        </span>
      </div>
      <div className="h-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <div
          className={`h-full ${progressColor} transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export default NavRemainingPlan;
