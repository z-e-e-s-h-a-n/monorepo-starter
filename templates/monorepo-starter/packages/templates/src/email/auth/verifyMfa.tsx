import { Layout } from "../components/layout";
import { Header } from "../components/header";
import { Greeting } from "../components/greeting";
import { Text } from "@react-email/components";
import { NumericCode } from "../components/numericCode";

export const VerifyMfa: EmailTemplateComponent = ({ user, otp }) => (
  <Layout previewText="Your security code">
    <Header title="Security Code" />
    <Greeting name={user?.displayName} />
    <Text className="text-base text-gray-900">
      Use the code below to complete your sign-in.
    </Text>
    {otp && <NumericCode code={otp.secret} />}
    <Text className="text-xs text-gray-500 text-center">
      This code expires in 15 minutes.
    </Text>
  </Layout>
);

VerifyMfa.subject = () => "Your security code";
VerifyMfa.message = (props) =>
  props.otp ? `Your security code is ${props.otp.secret}.` : "";
