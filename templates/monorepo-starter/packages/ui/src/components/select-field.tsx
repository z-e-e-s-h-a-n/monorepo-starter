import { FormField, type BaseFieldProps } from "./form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

interface SelectFieldProps<TFormData> extends BaseFieldProps<TFormData> {
  options: string[];
}

export const SelectField = <TFormData,>({
  options,
  disabled,
  ...props
}: SelectFieldProps<TFormData>) => {
  return (
    <FormField {...props}>
      {({ isInvalid, ...field }) => (
        <Select
          name={field.name}
          value={field.value}
          defaultValue={field.value}
          onValueChange={field.onChange}
          disabled={disabled}
        >
          <SelectTrigger
            id={field.name}
            aria-invalid={isInvalid}
            className="w-full"
          >
            <SelectValue placeholder={field.placeholder} />
          </SelectTrigger>

          <SelectContent position="popper">
            {options.map((o) => (
              <SelectItem key={o} value={o}>
                {o}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </FormField>
  );
};
