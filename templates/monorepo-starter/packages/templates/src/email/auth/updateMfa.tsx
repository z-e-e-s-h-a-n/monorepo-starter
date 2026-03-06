import { Layout } from "../components/layout";
import { Header } from "../components/header";
import { Greeting } from "../components/greeting";
import { Text } from "@react-email/components";
import { NumericCode } from "../components/numericCode";

export const UpdateMfa: EmailTemplateComponent = ({ user, otp }) => {
  if (otp) {
    return (
      <Layout previewText="Enable two-factor authentication">
        <Header title="Enable Two-Factor Authentication" />
        <Greeting name={user?.displayName} />
        <Text className="text-base text-gray-900">
          Use the code below to enable 2FA for your travel account.
        </Text>
        <NumericCode code={otp.secret} />
        <Text className="text-xs text-gray-500 text-center">
          This code expires in 15 minutes.
        </Text>
      </Layout>
    );
  }

  return (
    <Layout previewText="Two-factor authentication enabled">
      <Header title="2FA Enabled Successfully" />
      <Greeting name={user?.displayName} />
      <Text className="text-base text-gray-900">
        Two-factor authentication is now active on your account.
      </Text>
    </Layout>
  );
};

UpdateMfa.subject = (props) =>
  props.otp
    ? "Enable two-factor authentication"
    : "Two-factor authentication enabled";
UpdateMfa.message = (props) =>
  props.otp ? `Your 2FA setup code is ${props.otp.secret}.` : "2FA enabled.";
