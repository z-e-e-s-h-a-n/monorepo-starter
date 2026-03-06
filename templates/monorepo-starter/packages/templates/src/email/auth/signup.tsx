import { Layout } from "../components/layout";
import { Header } from "../components/header";
import { Greeting } from "../components/greeting";
import { Text } from "@react-email/components";
import { appName } from "@workspace/shared/constants";

export const Signup: EmailTemplateComponent = ({ user }) => (
  <Layout previewText={`Welcome to ${appName.default}`}>
    <Header
      title={`Welcome to ${appName.default}`}
      subtitle="Your travel account is ready"
    />
    <Greeting name={user?.displayName} />
    <Text className="text-base text-gray-900">
      Your travel agency account has been successfully created.
    </Text>
    <Text className="text-base text-gray-900">
      You can now sign in and start planning your next adventure.
    </Text>
  </Layout>
);

Signup.subject = () => `Welcome to ${appName.default}`;
Signup.message = () => `Welcome to ${appName.default}. Your account is ready.`;
