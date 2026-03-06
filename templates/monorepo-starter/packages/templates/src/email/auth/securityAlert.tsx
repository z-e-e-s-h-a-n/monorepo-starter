import { Layout } from "../components/layout";
import { Header } from "../components/header";
import { Greeting } from "../components/greeting";
import { Text } from "@react-email/components";

export const SecurityAlert: EmailTemplateComponent = ({ user, message }) => (
  <Layout previewText="Security alert">
    <Header title="Security Alert" />
    <Greeting name={user?.displayName} />
    <table className="w-full bg-red-50 rounded-lg my-4">
      <tr>
        <td className="p-4">
          <Text className="m-0 text-red-800 font-semibold">{message}</Text>
        </td>
      </tr>
    </table>
  </Layout>
);

SecurityAlert.subject = () => "Security alert";
SecurityAlert.message = (props) => `Security alert: ${props.message}`;
