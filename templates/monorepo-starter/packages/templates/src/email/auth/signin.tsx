import { Layout } from "../components/layout";
import { Header } from "../components/header";
import { Greeting } from "../components/greeting";
import { Text } from "@react-email/components";

export const Signin: EmailTemplateComponent = ({ user }) => (
  <Layout previewText="New sign-in detected">
    <Header title="New Sign-in Detected" />
    <Greeting name={user?.displayName} />
    <Text className="text-base text-gray-900">
      A sign-in to your travel account was detected.
    </Text>
    <Text className="text-base text-gray-900">
      If this wasn't you, please secure your account immediately.
    </Text>
  </Layout>
);
Signin.subject = () => "New sign-in detected";
Signin.message = () => "New sign-in detected.";
