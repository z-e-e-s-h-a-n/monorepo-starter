import VerifyAuthPage, {
  type VerifyAuthProps,
} from "@/components/shared/VerifyAuthPage";

const page = async ({ searchParams }: AppPageProps) => {
  const query = (await searchParams) as unknown as VerifyAuthProps;

  return <VerifyAuthPage {...query} />;
};

export default page;
