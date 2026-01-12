"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "../lib/utils";

import { Button } from "./button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./command";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { FormField, type BaseFieldProps } from "./form";

export type ComboboxOption = {
  value: string;
  content: string | React.ReactNode;
};

type UseEntitiesResult<TKey extends string, TData> = {
  data?:
    | (BaseQueryResponse & {
        [K in TKey]: TData[];
      })
    | null;
  isLoading: boolean;
};

interface ComboboxFieldProps<
  TKey extends string,
  TQuery extends BaseQueryType<TQuery>,
  TData extends BaseResponse,
  TFormData,
> extends BaseFieldProps<TFormData> {
  dataKey: TKey;
  useQuery: (args?: TQuery) => UseEntitiesResult<TKey, TData>;

  queryArgs?: TQuery;

  getOption: (item: TData) => ComboboxOption;

  disabled?: boolean;
  emptyText?: string;
}

export function ComboboxField<
  TKey extends string,
  TQuery extends BaseQueryType<TQuery>,
  TData extends BaseResponse,
  TFormData,
>({
  dataKey,
  useQuery,
  queryArgs,
  getOption,
  disabled,
  emptyText = "No results found.",
  ...props
}: ComboboxFieldProps<TKey, TQuery, TData, TFormData>) {
  const [open, setOpen] = React.useState(false);

  const { data, isLoading } = useQuery(queryArgs);
  const options = data
    ? data[dataKey].map((d) => ({ ...getOption(d), id: d.id }))
    : [];

  return (
    <FormField {...props}>
      {(field) => {
        const fieldValue = field.value;
        const selected = options.find((o) => o.id === fieldValue);

        return (
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="secondary"
                role="combobox"
                disabled={disabled}
                className={cn(
                  "justify-between bg-transparent dark:bg-input/30 border border-input",
                  !fieldValue && "text-muted-foreground",
                  open && "border-ring ring-ring/50 ring-[3px]"
                )}
              >
                {selected?.id ?? field.placeholder}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>

            <PopoverContent className="p-0 w-(--radix-popover-trigger-width)">
              <Command>
                <CommandInput placeholder={field.placeholder} />

                <CommandList>
                  <CommandEmpty>
                    {isLoading ? "Loading..." : emptyText}
                  </CommandEmpty>

                  <CommandGroup>
                    {options.map((option) => (
                      <CommandItem
                        key={option.id}
                        value={option.value}
                        onSelect={() => {
                          field.onChange(option.id);
                          setOpen(false);
                        }}
                      >
                        {option.content}
                        {fieldValue === option.id && (
                          <Check className="ml-auto size-4" />
                        )}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        );
      }}
    </FormField>
  );
}
