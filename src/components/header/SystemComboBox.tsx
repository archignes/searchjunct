"use client"

import React, { useEffect, useState } from "react"
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"
import { useRouter } from "next/router"
import { SystemFavicon } from "../systems/Favicon"
import { cn } from "@/lib/utils"
import { Button } from "../ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandList,
  CommandInput,
  CommandItem,
} from "../ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover"
import { System } from "@/types"

interface SystemComboBoxProps {
  systems: System[]
  system: System
}
const SystemOptionLabel = ({ system }: { system: System }) => {
  return (
    <p className="flex items-center">
      <SystemFavicon system={system} className="inline-block mr-2" />
      {system.name}
    </p>
  );
}

export const SystemComboBox: React.FC<SystemComboBoxProps> = ({ systems, system }) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(system.name);
  
  const alphaSortedSystems = [...systems].sort((a, b) => a.name.localeCompare(b.name));
  const router = useRouter();

  useEffect(() => {
    if (value !== system.name) {
      const selectedSystem = systems.find((s) => s.name === value);
      if (selectedSystem) {
        router.replace(`/${selectedSystem.id}`);
      }
    }
  }, [value, system.name, systems, router]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[300px] justify-between"
        >
          {value
            ? <SystemOptionLabel system={system} />
            : "Select system..."} 
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search system..." className="h-9" />
          <CommandList>
          <CommandEmpty>No system found.</CommandEmpty>
          <CommandGroup>
              {alphaSortedSystems.map(system => (
              <CommandItem
                key={system.name}
                value={system.name}
                onSelect={(currentValue) => {
                  setValue(currentValue === value ? "" : currentValue)
                  setOpen(false);
                }}
              >
                <SystemOptionLabel system={system} />
                <CheckIcon
                  className={cn(
                    "ml-auto h-4 w-4",
                    value === system.name ? "opacity-100" : "opacity-0"
                  )}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}