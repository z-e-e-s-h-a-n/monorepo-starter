import { useForm } from "@tanstack/react-form";

import { mediaUpdateSchema } from "@workspace/contracts/media";
import { Form } from "@workspace/ui/components/form";
import { InputField } from "@workspace/ui/components/input-field";

interface MediaFormProps {
  media: MediaUpdateType;
  isPublic?: boolean;
  onSubmit: (data: MediaUpdateType) => void;
}

const MediaForm = ({ isPublic = true, media, onSubmit }: MediaFormProps) => {
  const form = useForm({
    defaultValues: media,
    validators: {
      onSubmit: mediaUpdateSchema,
    },
    onSubmit: ({ value }) => {
      onSubmit(value);
    },
  });

  return (
    <Form form={form} btnText="Update Media" className="[&>button]:ml-auto">
      <div className="grid grid-cols-2 gap-4">
        <InputField form={form} name="title" label="Title" />
        {isPublic && <InputField form={form} name="altText" label="Alt Text" />}
      </div>
      <InputField form={form} name="notes" type="textarea" label="Notes" />
    </Form>
  );
};

export default MediaForm;
