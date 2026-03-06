import { Layout } from "../components/layout";
import { Header } from "../components/header";
import { Greeting } from "../components/greeting";
import { Text } from "@react-email/components";
import { ActionBlock } from "../components/actionBlock";

export const ResetPassword: EmailTemplateComponent = ({
  user,
  otp,
  identifier,
  clientUrl,
}) => {
  if (otp) {
    const link = `${clientUrl}/auth/reset-password?identifier=${identifier}&purpose=${otp.purpose}&secret=${otp.secret}&type=${otp.type}`;
    return (
      <Layout previewText="Reset your password">
        <Header title="Reset Your Password" />
        <Greeting name={user?.displayName} />
        <Text className="text-base text-gray-900">
          Use the code below to reset your password.
        </Text>
        <ActionBlock link={link} label="Reset password" otp={otp} />
      </Layout>
    );
  }

  return (
    <Layout previewText="Password reset successful">
      <Header title="Password Reset Successful" />
      <Greeting name={user?.displayName} />
      <Text className="text-base text-gray-900">
        Your password has been updated.
      </Text>
    </Layout>
  );
};

ResetPassword.subject = (props) =>
  props.otp ? "Reset your password" : "Password reset successful";
ResetPassword.message = (props) =>
  props.otp ? `Reset code: ${props.otp.secret}` : "Password reset.";
