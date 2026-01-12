import { useEffect, useRef, useState } from "react";
import { FormField, type BaseFieldProps } from "./form";
import { Input } from "./input";
import type { ReactNode } from "react";

interface SearchInputFieldGenericProps<
  TData,
  TFormData,
> extends BaseFieldProps<TFormData> {
  options: TData[];
  getLabel: (item: TData) => string;
  renderItem: (item: TData) => ReactNode;
  getValue: (item: TData) => string;
  defaultValue?: string;
  isMatch?: (item: TData, query: string) => boolean;
  notMatch?: string;
}

export const SearchInputField = <TData, TFormData>({
  options,
  getLabel,
  getValue,
  renderItem,
  defaultValue,
  isMatch,
  notMatch,
  disabled,
  ...props
}: SearchInputFieldGenericProps<TData, TFormData>) => {
  const [inputValue, setInputValue] = useState("");
  const [filtered, setFiltered] = useState<TData[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const selected = options.find((item) => getLabel(item) === inputValue);

  // set initial label from defaultValue
  useEffect(() => {
    if (defaultValue) {
      const match = options.find((o) => getValue(o) === defaultValue);
      if (match) setInputValue(getLabel(match));
    }
  }, [defaultValue, options]);

  useEffect(() => {
    if (!inputValue || selected) {
      setFiltered([]);
      return;
    }

    const q = inputValue.toLowerCase();

    setFiltered(
      options.filter((item) => {
        if (notMatch && getValue(item) === notMatch) return false;

        return isMatch
          ? isMatch(item, q)
          : getValue(item).toLowerCase().includes(q);
      })
    );
  }, [inputValue, selected, options, notMatch, isMatch, getValue]);

  return (
    <FormField {...props} className="relative">
      {({ onChange, isInvalid, ...field }) => (
        <div className="relative">
          <Input
            {...field}
            ref={inputRef}
            value={inputValue}
            aria-invalid={isInvalid}
            disabled={disabled}
            onFocus={(e) => e.target.select()}
            onChange={(e) => {
              const v = e.target.value.toUpperCase();
              setInputValue(v);

              const exact = options.find(
                (item) => getValue(item).toUpperCase() === v
              );

              if (exact && (!notMatch || getValue(exact) !== notMatch)) {
                onChange(getValue(exact));
                setInputValue(getLabel(exact));
                setFiltered([]);
                inputRef.current?.blur();
              } else {
                onChange("");
              }
            }}
          />

          {!selected && inputValue && (
            <ul className="absolute top-full z-50 w-full rounded-md border bg-background shadow-md max-h-60 overflow-y-auto">
              {filtered.length > 0 ? (
                filtered.slice(0, 20).map((item, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-4 cursor-pointer px-3 py-2 hover:bg-muted"
                    onMouseDown={() => {
                      setInputValue(getLabel(item));
                      onChange(getValue(item));
                      setFiltered([]);
                      inputRef.current?.blur();
                    }}
                  >
                    {renderItem(item)}
                  </li>
                ))
              ) : (
                <li className="px-4 py-3 text-sm text-muted-foreground">
                  No results found
                </li>
              )}
            </ul>
          )}
        </div>
      )}
    </FormField>
  );
};
