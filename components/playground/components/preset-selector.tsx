"use client";

import * as React from "react";
import { PopoverProps } from "@radix-ui/react-popover";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { useMutationObserver } from "@/hooks/use-mutation-observer";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Preset, PresetType } from "../data/presets";

interface PresetSelectorProps extends PopoverProps {
  types: readonly PresetType[];
  presets: Preset[];
}

export function PresetSelector({
  presets,
  types,
  ...props
}: PresetSelectorProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedPreset, setSelectedPreset] = React.useState<Preset>(
    presets[0]
  );
  const [peekedPreset, setPeekedPreset] = React.useState<Preset>(presets[0]);

  return (
    <div className="grid gap-2">
      <HoverCard openDelay={200}>
        <HoverCardTrigger asChild>
          <Label htmlFor="preset">Preset</Label>
        </HoverCardTrigger>
        <HoverCardContent
          align="start"
          className="w-[260px] text-sm"
          side="left"
        >
          The preset which will generate the completion. Some presets are
          suitable for natural language tasks, others specialize in code. Learn
          more.
        </HoverCardContent>
      </HoverCard>
      <Popover open={open} onOpenChange={setOpen} {...props}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label="Select a preset"
            className="w-full justify-between"
          >
            {selectedPreset ? selectedPreset.name : "Select a preset..."}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-[250px] p-0">
          <HoverCard>
            <HoverCardContent
              side="left"
              align="start"
              forceMount
              className="min-h-[280px]"
            >
              <div className="grid gap-2">
                <h4 className="font-medium leading-none">
                  {peekedPreset.name}
                </h4>
                <div className="text-sm text-muted-foreground">
                  {peekedPreset.description}
                </div>
                {peekedPreset.strengths ? (
                  <div className="mt-4 grid gap-2">
                    <h5 className="text-sm font-medium leading-none">
                      Strengths
                    </h5>
                    <ul className="text-sm text-muted-foreground">
                      {peekedPreset.strengths}
                    </ul>
                  </div>
                ) : null}
              </div>
            </HoverCardContent>
            <Command loop>
              <CommandList className="h-[var(--cmdk-list-height)] max-h-[400px]">
                <CommandInput placeholder="Search Presets..." />
                <CommandEmpty>No Presets found.</CommandEmpty>
                <HoverCardTrigger />
                {types.map((type) => (
                  <CommandGroup key={type} heading={type}>
                    {presets
                      .filter((preset) => preset.type === type)
                      .map((preset) => (
                        <PresetItem
                          key={preset.id}
                          preset={preset}
                          isSelected={selectedPreset?.id === preset.id}
                          onPeek={(preset) => setPeekedPreset(preset)}
                          onSelect={() => {
                            setSelectedPreset(preset);
                            setOpen(false);
                          }}
                        />
                      ))}
                  </CommandGroup>
                ))}
              </CommandList>
            </Command>
          </HoverCard>
        </PopoverContent>
      </Popover>
    </div>
  );
}

interface PresetItemProps {
  preset: Preset;
  isSelected: boolean;
  onSelect: () => void;
  onPeek: (preset: Preset) => void;
}

function PresetItem({ preset, isSelected, onSelect, onPeek }: PresetItemProps) {
  const ref = React.useRef<HTMLDivElement>(null);

  useMutationObserver(ref, (mutations) => {
    mutations.forEach((mutation) => {
      if (
        mutation.type === "attributes" &&
        mutation.attributeName === "aria-selected" &&
        ref.current?.getAttribute("aria-selected") === "true"
      ) {
        onPeek(preset);
      }
    });
  });

  return (
    <CommandItem
      key={preset.id}
      onSelect={onSelect}
      ref={ref}
      className="data-[selected=true]:bg-primary data-[selected=true]:text-primary-foreground"
    >
      {preset.name}
      <Check
        className={cn("ml-auto", isSelected ? "opacity-100" : "opacity-0")}
      />
    </CommandItem>
  );
}
