/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useForm, type FormValidateOrFn } from "@tanstack/react-form";

import type { ApiException } from "@workspace/sdk";
import { getBackPath } from "@workspace/ui/lib/utils";
import { Form, type AnyFormApi } from "@workspace/ui/components/form";
import type { ColumnConfig } from "@/components/shared/GenericTable";
import CUFormSkeleton from "@/components/skeleton/CUFormSkeleton";
import GenericArrayField, { type ArrayFormItem } from "./GenericArrayField";

interface UseQueryResult<TData, TFormData> {
  data?: TData;
  isLoading?: boolean;
  fetchError: ApiException | null;
  mutateAsync: (data: TFormData) => Promise<TData>;
  isPending: boolean;
  mutateError: ApiException | null;
}

interface GenericCUFormProps<TData, TFormData> extends BaseCUFormProps {
  entityName: string;
  defaultValues: Partial<TFormData>;
  schema: FormValidateOrFn<TFormData>;
  children?: (
    form: AnyFormApi<TFormData>,
    formType: FormSectionType,
    data?: TData,
  ) => React.ReactNode;
  useQuery: (...args: string[]) => UseQueryResult<TData, TFormData>;
  formHeader?: (
    form: AnyFormApi<TFormData>,
    formType: FormSectionType,
    data?: TData,
  ) => React.ReactNode;
  arrayFields?: {
    [K in keyof TFormData]: TFormData[K] extends readonly any[]
      ? {
          name: K & string;
          component: ArrayFormItem<ArrayItem<TFormData[K]>>;
          columns: ColumnConfig<ArrayItem<TFormData[K]>>[];
        }
      : never;
  }[keyof TFormData];
}

export function GenericCUForm<
  TData extends Record<string, any>,
  TFormData extends Record<string, any>,
>({
  entityId,
  entityName,
  formType,
  children,
  defaultValues,
  schema,
  useQuery,
  formHeader,
  arrayFields,
}: GenericCUFormProps<TData, TFormData>) {
  const router = useRouter();
  const pathname = usePathname();
  const listPath = getBackPath(pathname, formType === "add" ? 1 : 2);
  const { data, mutateAsync, isLoading, isPending } = useQuery(entityId!);
  const [isFormReady, setIsFormReady] = useState(!entityId);

  const form = useForm({
    defaultValues: entityId ? undefined : (defaultValues as TFormData),
    validators: {
      onSubmit: schema,
    },
    onSubmit: async ({ value }) => {
      try {
        await mutateAsync(value);
        toast.success(
          `${entityName} ${entityId ? "updated" : "created"} successfully!`,
        );
        form.reset();
        router.push(listPath);
      } catch (err: any) {
        toast.error(err?.message ?? "Something went wrong.");
      }
    },
  });

  useEffect(() => {
    if (data && !isFormReady) {
      form.reset(data as unknown as TFormData);
      setIsFormReady(true);
    }
  }, [data, form, isFormReady]);

  if (isLoading || !isFormReady) return <CUFormSkeleton />;

  return (
    <Form
      form={form}
      isPending={isPending}
      title={
        <>
          {formType === "add" ? "Add New" : "Update"} {entityName}
          {entityId && `: ${entityId}`}
        </>
      }
      btnText={`${formType} ${entityName}`}
    >
      {formHeader && formHeader(form, formType)}

      {arrayFields && (
        <GenericArrayField
          form={form}
          name={arrayFields.name}
          FormItem={arrayFields.component}
          columns={arrayFields.columns}
        />
      )}

      {children?.(form, formType)}
    </Form>
  );
}
