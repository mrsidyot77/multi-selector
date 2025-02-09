"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const frameworks = [
  { value: "next.js", label: "Next.js" },
  { value: "sveltekit", label: "SvelteKit" },
  { value: "nuxt.js", label: "Nuxt.js" },
  { value: "remix", label: "Remix" },
  { value: "astro", label: "Astro" },
  { value: "vue", label: "Vue.js" },
  { value: "angular", label: "Angular" },
  { value: "ember", label: "Ember" },
  { value: "jQuery", label: "jQuery" },
  { value: "backbone", label: "Backbone.js" },
]

export function MultiSelectorDropdown() {
  const [open, setOpen] = React.useState(false)
  const [selectedValues, setSelectedValues] = React.useState<string[]>([])

  const toggleSelection = (value: string) => {
    setSelectedValues((prevSelectedValues) =>
      prevSelectedValues.includes(value)
        ? prevSelectedValues.filter((item) => item !== value)
        : [...prevSelectedValues, value]
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[250px] justify-between bg-white border-gray-300 hover:border-gray-500 focus:ring-2 focus:ring-indigo-500 transition-all duration-150"
        >
          <div className="flex flex-wrap gap-2 max-w-full overflow-hidden">
            {selectedValues.length > 0
              ? selectedValues
                  .slice(0, 3) // Show a maximum of 3 selected items
                  .map(
                    (value) =>
                      frameworks.find((framework) => framework.value === value)
                        ?.label
                  )
                  .map((label) => (
                    <span
                      key={label}
                      className="bg-indigo-100 text-indigo-800 text-xs font-medium py-1 px-2 rounded-full border border-indigo-300"
                    >
                      {label}
                    </span>
                  ))
              : "Select frameworks..."}
            {selectedValues.length > 3 && (
              <span className="text-xs text-indigo-600">
                +{selectedValues.length - 3} more
              </span>
            )}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] max-h-[300px] overflow-auto rounded-lg bg-white shadow-lg p-0 border-gray-300">
        <Command>
          <CommandInput
            placeholder="Search frameworks..."
            className="py-2 px-4 border-b border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <CommandEmpty className="p-4 text-center text-gray-500">No framework found.</CommandEmpty>
          <CommandList>
            <CommandGroup>
              {frameworks.map((framework) => (
                <CommandItem
                  key={framework.value}
                  value={framework.value}
                  onSelect={() => toggleSelection(framework.value)}
                  className="flex items-center py-2 px-4 hover:bg-gray-100 cursor-pointer"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4 text-indigo-500",
                      selectedValues.includes(framework.value)
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {framework.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
