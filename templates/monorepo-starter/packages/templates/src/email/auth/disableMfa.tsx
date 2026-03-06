import { Layout } from "../components/layout";
import { Header } from "../components/header";
import { Greeting } from "../components/greeting";
import { Text } from "@react-email/components";
import { NumericCode } from "../components/numericCode";

export const DisableMfa: EmailTemplateComponent = ({ user, otp }) => {
  if (otp) {
    return (
      <Layout previewText="Disable two-factor authentication">
        <Header title="Disable Two-Factor Authentication" />
        <Greeting name={user?.displayName} />
        <Text className="text-base text-gray-900">
          Use the code below to disable 2FA for your travel account.
        </Text>
        <NumericCode code={otp.secret} />
        <Text className="text-xs text-gray-500 text-center">
          This code expires in 15 minutes.
        </Text>
      </Layout>
    );
  }

  return (
    <Layout previewText="Two-factor authentication disabled">
      <Header title="2FA Disabled" />
      <Greeting name={user?.displayName} />
      <Text className="text-base text-gray-900">
        Two-factor authentication has been disabled on your account.
      </Text>
    </Layout>
  );
};

DisableMfa.subject = (props) =>
  props.otp
    ? "Disable two-factor authentication"
    : "Two-factor authentication disabled";
DisableMfa.message = (props) =>
  props.otp ? `Your 2FA disable code is ${props.otp.secret}.` : "2FA disabled.";
