/* eslint-disable @typescript-eslint/no-explicit-any */
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
  id?: string;
  form: AnyFormApi<TFormData>;
  title?: string | React.ReactNode;
  desc?: string;
  btnText?: string;
  children: React.ReactNode;
  isPending?: boolean;
  className?: string;
}

export interface BaseFieldProps<
  TFormData,
  TName extends DeepKeys<TFormData> = DeepKeys<TFormData>,
> {
  name: TName & string;
  desc?: string;
  label?: string | React.ReactNode;
  placeholder?: string;
  className?: string;
  form: AnyFormApi<TFormData>;
  disabled?: boolean;
  validators?: FieldValidatorsFor<TFormData, TName>;
}

export interface FieldChildrenProps<TFormData> {
  name: DeepKeys<TFormData> & string;
  value: any;
  placeholder?: string;
  onBlur: () => void;
  onChange: (e: any) => void;
  isInvalid: boolean;
  disabled?: boolean;
}

export interface FormFieldProps<TFormData> extends BaseFieldProps<TFormData> {
  children: (fieldProps: FieldChildrenProps<TFormData>) => React.ReactNode;
}

export const Form = <TFormData,>({
  id,
  form,
  title,
  desc,
  children,
  isPending,
  btnText,
  className,
}: FormProps<TFormData>) => {
  return (
    <section className="space-y-8" id={id}>
      <div className=" flex items-center justify-between">
        {title && <h2 className="capitalize text-lg font-semibold">{title}</h2>}
        {desc && <p>{desc}</p>}
        <Button
          variant="secondary"
          onClick={() => {
            console.log("values:", form.state.values);
            console.log("errors:", form.getAllErrors());
          }}
        >
          Form Logs
        </Button>
      </div>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          e.stopPropagation();
          await form.handleSubmit();
        }}
        autoComplete="off"
      >
        <FieldGroup className={className}>
          {children}

          {btnText && (
            <form.Subscribe selector={(state) => state.canSubmit}>
              {(canSubmit) => (
                <Button
                  size="lg"
                  disabled={!canSubmit || isPending}
                  type="submit"
                  className="w-max capitalize"
                >
                  {btnText}
                  {isPending && <LoaderCircle className="animate-spin" />}
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
    <form.Field name={name} validators={validators}>
      {(field) => {
        const isInvalid =
          field.state.meta.isTouched && !field.state.meta.isValid;

        const fieldProps = {
          name: field.name,
          placeholder,
          value: field.state.value,
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
            {isInvalid && <FieldError errors={[field.state.meta.errors[0]]} />}
          </Field>
        );
      }}
    </form.Field>
  );
};
