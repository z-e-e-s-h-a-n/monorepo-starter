import React from "react";
import { pretty, render } from "@react-email/render";
import { emailTemplateMap } from "./constants";

export const resolveEmailTemplate = async <T extends NotificationPurpose>(
  props: EmailTemplateProps<T>,
): Promise<EmailTemplateResult> => {
  const Template = emailTemplateMap[props.purpose];
  if (!Template) {
    throw new Error(`Undefined template purpose: ${props.purpose}`);
  }

  const subject = Template.subject(props);
  const message = Template.message(props);
  const html = await pretty(await render(React.createElement(Template, props)));

  return { subject, html, message };
};
