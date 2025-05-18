"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useSearchParams } from "next/navigation";

const languages = [
  { id: 1, label: "🇬🇧 English", lang: "en", flag: "🇬🇧" },
  { id: 2, label: "🇪🇸 Español", lang: "es", flag: "🇪🇸" },
];

export default function LanguageSelector({
  className,
  displayOnlyFlag = false,
}: {
  className?: string;
  displayOnlyFlag?: boolean;
}) {
  const searchParams = useSearchParams();
  const { i18n } = useTranslation();

  // Use state to track if component is mounted to prevent hydration mismatch
  const [isMounted, setIsMounted] = useState(false);
  const [selected, setSelected] = useState<(typeof languages)[0]>();

  // Only run client-side to prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true);

    const currentLang = i18n.language;
    const lang = searchParams.get("lang");

    let selectedLang;
    if (lang) {
      selectedLang = languages.find((l) => l.lang === lang);
    }

    if (!selectedLang) {
      selectedLang = languages.find((l) => l.lang === currentLang);
    }

    if (!selectedLang) {
      selectedLang = languages.find((l) => l.lang === "en");
    }

    if (selectedLang) {
      setSelected(selectedLang);
    }
  }, [i18n, searchParams]);

  useEffect(() => {
    if (!selected || !isMounted) {
      return;
    }

    i18n.changeLanguage(selected.lang);
  }, [selected, i18n, isMounted]);

  // Don't render anything during SSR to prevent hydration mismatch
  if (!isMounted) {
    return null;
  }

  if (!selected) {
    return null;
  }

  return (
    <Popover>
      <PopoverTrigger asChild className={cn("mb-4", className)}>
        <Button variant="outline" role="combobox" className="justify-between T">
          {displayOnlyFlag ? selected.flag : selected.label}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={cn("p-0", displayOnlyFlag ? "w-auto" : "w-[200px]")}
      >
        <Command className="bg-white">
          <CommandList>
            <CommandEmpty>No language found.</CommandEmpty>
            <CommandGroup>
              {languages.map((language) => (
                <CommandItem
                  value={language.label}
                  key={language.lang}
                  onSelect={() => {
                    setSelected(language);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      language.lang === selected.lang
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {displayOnlyFlag ? language.flag : language.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
