import { Layout } from "../components/layout";
import { Header } from "../components/header";
import { Greeting } from "../components/greeting";
import { Text } from "@react-email/components";
import { appName } from "@workspace/shared/constants";

export const AccountReactivated: EmailTemplateComponent = ({ user }) => {
  return (
    <Layout previewText="Your account has been reactivated">
      <Header
        title="Account Reactivated"
        subtitle={`Welcome back to ${appName.default}`}
      />
      <Greeting name={user?.displayName} />
      <Text className="text-base text-gray-900">
        Great news! Your {appName.default} travel account has been successfully
        reactivated.
      </Text>
      <Text className="text-base text-gray-900">
        You can now sign in and continue planning your trips without any
        restrictions.
      </Text>
    </Layout>
  );
};

AccountReactivated.subject = () =>
  `Your ${appName.default} account has been reactivated`;

AccountReactivated.message = () =>
  `Your ${appName.default} account has been successfully reactivated.`;
