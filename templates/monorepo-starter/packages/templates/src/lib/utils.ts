import React from "react";
import { pretty, render } from "@react-email/render";
import { emailTemplateMap } from "./constants";

export const resolveEmailTemplate = async (
  purpose: NotificationPurpose,
  meta: EmailTemplateProps,
): Promise<EmailTemplateResult> => {
  const Template = emailTemplateMap[purpose];
  if (!Template) {
    throw new Error(`Undefined template purpose: ${purpose}`);
  }

  const subject = Template.subject(meta);
  const message = Template.message(meta);
  const html = await pretty(await render(React.createElement(Template, meta)));

  return { subject, html, message };
};
