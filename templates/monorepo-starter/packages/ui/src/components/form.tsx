import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "./field";

import { Button } from "./button";
import { LoaderCircle } from "lucide-react";
import type {
  DeepKeys,
  DeepValue,
  FieldValidators,
  FieldValidateOrFn,
  FieldAsyncValidateOrFn,
  ReactFormExtendedApi,
} from "@tanstack/react-form";

export type AnyFormApi<TFormData> = ReactFormExtendedApi<
  TFormData,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any
>;

type FieldValidatorsFor<
  TFormData,
  TName extends DeepKeys<TFormData>,
> = FieldValidators<
  TFormData,
  TName,
  DeepValue<TFormData, TName>,
  FieldValidateOrFn<TFormData, TName, DeepValue<TFormData, TName>>,
  FieldValidateOrFn<TFormData, TName, DeepValue<TFormData, TName>>,
  FieldAsyncValidateOrFn<TFormData, TName, DeepValue<TFormData, TName>>,
  FieldValidateOrFn<TFormData, TName, DeepValue<TFormData, TName>>,
  FieldAsyncValidateOrFn<TFormData, TName, DeepValue<TFormData, TName>>,
  FieldValidateOrFn<TFormData, TName, DeepValue<TFormData, TName>>,
  FieldAsyncValidateOrFn<TFormData, TName, DeepValue<TFormData, TName>>,
  FieldValidateOrFn<TFormData, TName, DeepValue<TFormData, TName>>,
  FieldAsyncValidateOrFn<TFormData, TName, DeepValue<TFormData, TName>>
>;

interface FormProps<TFormData> {
  form: AnyFormApi<TFormData>;
  title?: string | React.ReactNode;
  desc?: string;
  btnText?: string;
  children: React.ReactNode;
  isLoading?: boolean;
  className?: string;
}

export interface BaseFieldProps<
  TFormData,
  TName extends DeepKeys<TFormData> = DeepKeys<TFormData>,
> {
  name: TName;
  desc?: string;
  label?: string | React.ReactNode;
  placeholder?: string;
  className?: string;
  form: AnyFormApi<TFormData>;
  disabled?: boolean;
  validators?: FieldValidatorsFor<TFormData, TName>;
}

interface FormFieldProps<TFormData> extends BaseFieldProps<TFormData> {
  children: (fieldProps: {
    name: DeepKeys<TFormData>;
    value: any;
    placeholder?: string;
    onBlur: () => void;
    onChange: (e: any) => void;
    isInvalid: boolean;
    disabled?: boolean;
  }) => React.ReactNode;
}

export const Form = <TFormData,>({
  form,
  title,
  desc,
  children,
  isLoading,
  btnText,
  className,
}: FormProps<TFormData>) => {
  return (
    <section className="space-y-8">
      <div>
        {title && <h2 className="capitalize text-lg font-semibold">{title}</h2>}
        {desc && <p>{desc}</p>}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        autoComplete="off"
      >
        <FieldGroup className={className}>
          {children}

          {btnText && (
            <form.Subscribe selector={(state: any) => state.canSubmit}>
              {(canSubmit: boolean) => (
                <Button
                  size="lg"
                  disabled={!canSubmit || isLoading}
                  type="submit"
                  className="w-max capitalize"
                >
                  {btnText}
                  {isLoading && <LoaderCircle className="animate-spin" />}
                </Button>
              )}
            </form.Subscribe>
          )}
        </FieldGroup>
      </form>
    </section>
  );
};

export const FormField = <TFormData,>({
  name,
  desc,
  label,
  placeholder,
  form,
  className,
  children,
  validators,
  disabled,
}: FormFieldProps<TFormData>) => {
  if (!placeholder && typeof label === "string") placeholder = label;

  return (
    <form.Field
      name={name}
      validators={validators}
      children={(field) => {
        const isInvalid =
          field.state.meta.isTouched && !field.state.meta.isValid;

        const fieldProps = {
          name: field.name,
          placeholder,
          value: !field.state.value ? undefined : field.state.value,
          onBlur: field.handleBlur,
          onChange: (e: any) => field.handleChange(e?.target?.value ?? e),
          isInvalid,
          disabled,
        };

        return (
          <Field data-invalid={isInvalid} className={className}>
            {label && (
              <FieldLabel
                className="w-full flex items-center justify-between"
                htmlFor={field.name}
              >
                {label}
              </FieldLabel>
            )}
            {children(fieldProps)}
            {desc && <FieldDescription>{desc}</FieldDescription>}
            {isInvalid && <FieldError errors={field.state.meta.errors} />}
          </Field>
        );
      }}
    />
  );
};
