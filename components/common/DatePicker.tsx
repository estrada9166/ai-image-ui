"use client";

import * as React from "react";
import {
  format,
  subDays,
  subMonths,
  subYears,
  addDays,
  startOfYear,
  startOfMonth,
  startOfWeek,
  startOfDay,
} from "date-fns";
import { CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dispatch } from "react";
import { SetStateAction } from "react";

export default function DatePicker({
  className,
  dateRange,
  setDateRange,
}: React.HTMLAttributes<HTMLDivElement> & {
  dateRange: DateRange | undefined;
  setDateRange: Dispatch<SetStateAction<DateRange>>;
}) {
  const [open, setOpen] = React.useState(false);
  const [quickSelectValue, setQuickSelectValue] = React.useState<string>("");

  // Check if current date range matches any quick select option
  React.useEffect(() => {
    if (!dateRange?.from || !dateRange?.to) {
      setQuickSelectValue("");
      return;
    }

    const now = addDays(new Date(), 1);
    const today = startOfDay(new Date());
    const options = {
      "7d": subDays(now, 7),
      "30d": subDays(now, 30),
      "90d": subDays(now, 90),
      "6m": subMonths(now, 6),
      "1y": subYears(now, 1),
      "this-year": startOfYear(today),
      "this-month": startOfMonth(today),
      "this-week": startOfWeek(today),
      today: today,
    };

    const matchingOption = Object.entries(options).find(([, date]) => {
      if (!dateRange.from || !dateRange.to) return false;

      return (
        date.getFullYear() === dateRange.from.getFullYear() &&
        date.getMonth() === dateRange.from.getMonth() &&
        date.getDate() === dateRange.from.getDate() &&
        now.getFullYear() === dateRange.to.getFullYear() &&
        now.getMonth() === dateRange.to.getMonth() &&
        now.getDate() === dateRange.to.getDate()
      );
    });

    setQuickSelectValue(matchingOption ? matchingOption[0] : "");
  }, [dateRange]);

  // Handle quick select options.
  const handleQuickSelect = (value: string) => {
    const now = addDays(new Date(), 1);
    const today = startOfDay(new Date());
    switch (value) {
      case "7d":
        setDateRange({ from: subDays(now, 7), to: now });
        break;
      case "30d":
        setDateRange({ from: subDays(now, 30), to: now });
        break;
      case "90d":
        setDateRange({ from: subDays(now, 90), to: now });
        break;
      case "6m":
        setDateRange({ from: subMonths(now, 6), to: now });
        break;
      case "1y":
        setDateRange({ from: subYears(now, 1), to: now });
        break;
      case "this-year":
        setDateRange({ from: startOfYear(today), to: now });
        break;
      case "this-month":
        setDateRange({ from: startOfMonth(today), to: now });
        break;
      case "this-week":
        setDateRange({ from: startOfWeek(today), to: now });
        break;
    }
    setQuickSelectValue(value);
    setOpen(false);
  };

  // Custom onSelect handler for the calendar.
  // In range mode, the first click sets only the "from" date.
  // Only when both dates are selected, we close the popover.
  const handleSelect = (range: DateRange | undefined) => {
    if (!range) return;

    setDateRange(range);
    if (range?.from && range?.to) {
      setOpen(false);
    }
  };

  return (
    <div className="flex-1">
      <div className={cn("grid gap-2", className)}>
        <div className="flex flex-col sm:flex-row gap-2">
          {/* Controlled Popover */}
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={"outline"}
                className={cn(
                  "w-full sm:w-[300px] justify-start text-left font-normal",
                  !dateRange && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "LLL dd, y")} -{" "}
                      {format(dateRange.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(dateRange.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={handleSelect}
                numberOfMonths={2}
                disabled={{ after: addDays(new Date(), 1) }}
              />
            </PopoverContent>
          </Popover>

          <Select value={quickSelectValue} onValueChange={handleQuickSelect}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder="Quick select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="this-week">This Week</SelectItem>
              <SelectItem value="this-month">Month to date</SelectItem>
              <SelectItem value="this-year">Year to date</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="6m">Last 6 months</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
