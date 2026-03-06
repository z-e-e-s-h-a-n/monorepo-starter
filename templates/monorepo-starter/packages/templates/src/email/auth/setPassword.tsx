import { Layout } from "../components/layout";
import { Header } from "../components/header";
import { Greeting } from "../components/greeting";
import { Text } from "@react-email/components";
import { appName } from "@workspace/shared/constants";
import { ActionBlock } from "../components/actionBlock";

export const SetPassword: EmailTemplateComponent = ({
  user,
  otp,
  identifier,
  clientUrl,
}) => {
  if (otp) {
    const link = `${clientUrl}/auth/set-password?identifier=${identifier}&purpose=${otp.purpose}&secret=${otp.secret}&type=${otp.type}`;
    return (
      <Layout previewText="Set your password">
        <Header title="Set Your Password" />
        <Greeting name={user?.displayName} />
        <Text className="text-base text-gray-900">
          Create a password to access your {appName.default} travel account.
        </Text>
        <ActionBlock link={link} label="Set password" otp={otp} />
      </Layout>
    );
  }

  return (
    <Layout previewText="Password set successfully">
      <Header title="Password Set Successfully" />
      <Greeting name={user?.displayName} />
      <Text className="text-base text-gray-900">
        Your password has been created successfully.
      </Text>
    </Layout>
  );
};

SetPassword.subject = (props) =>
  props.otp ? "Set your password" : "Password set successfully";
SetPassword.message = (props) =>
  props.otp ? `Your setup code is ${props.otp.secret}` : "Password set.";
