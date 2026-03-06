import { Layout } from "../components/layout";
import { Header } from "../components/header";
import { Greeting } from "../components/greeting";
import { Text } from "@react-email/components";
import { appName } from "@workspace/shared/constants";

export const AccountSuspended: EmailTemplateComponent = ({ user, message }) => {
  return (
    <Layout previewText="Your account has been suspended">
      <Header
        title="Account Suspended"
        subtitle={`${appName.default} Travel Account Notice`}
      />
      <Greeting name={user?.displayName} />
      <Text className="text-base text-gray-900">
        Your {appName.default} account has been temporarily suspended.
      </Text>

      {message && (
        <Text className="text-base text-gray-900">Reason: {message}</Text>
      )}

      <Text className="text-base text-gray-900">
        If you believe this is a mistake or need further assistance, please
        contact our support team.
      </Text>
    </Layout>
  );
};

AccountSuspended.subject = () =>
  `Your ${appName.default} account has been suspended`;

AccountSuspended.message = (props) =>
  `Your ${appName.default} account has been suspended${
    props.message ? `. Reason: ${props.message}` : "."
  }`;
