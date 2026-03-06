import CUUserForm from "@/components/forms/CUUserForm";

const page = async ({ params }: AppPageProps<{ id: string }>) => {
  const { id } = await params;
  return <CUUserForm formType="update" entityId={id} />;
};

export default page;
