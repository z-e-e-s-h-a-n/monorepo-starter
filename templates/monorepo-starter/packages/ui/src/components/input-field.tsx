import { FormField, type BaseFieldProps } from "./form";
import { Input } from "./input";
import { Textarea } from "./textarea";

export interface InputFieldProps<TFormData> extends BaseFieldProps<TFormData> {
  type?: "text" | "password" | "email" | "checkbox" | "number" | "textarea";
}

export const InputField = <TFormData,>({
  type = "text",
  ...props
}: InputFieldProps<TFormData>) => {
  return (
    <FormField {...props}>
      {({ isInvalid, ...field }) =>
        type === "textarea" ? (
          <Textarea {...field} id={field.name} aria-invalid={isInvalid} />
        ) : (
          <Input
            type={type}
            {...field}
            id={field.name}
            aria-invalid={isInvalid}
          />
        )
      }
    </FormField>
  );
};
