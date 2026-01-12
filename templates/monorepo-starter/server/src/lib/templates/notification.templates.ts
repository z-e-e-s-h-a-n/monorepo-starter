import type { Otp } from "@generated/prisma";
import { appName } from "@constants/app";

/* ======================================================
   Base styles
====================================================== */

const baseStyles = `
  margin:0;
  padding:0;
  background:#f9fafb;
  font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif;
  color:#111827;
`;

const containerStyles = `
  max-width:600px;
  margin:0 auto;
  background:#ffffff;
  border-radius:10px;
  padding:32px;
`;

const headerStyles = `
  font-size:22px;
  font-weight:700;
  margin-bottom:8px;
`;

const textStyles = `
  font-size:15px;
  line-height:1.6;
  margin:12px 0;
`;

const mutedTextStyles = `
  font-size:13px;
  color:#6b7280;
`;

const buttonStyles = `
  display:inline-block;
  padding:12px 22px;
  background:#2563eb;
  color:#ffffff;
  text-decoration:none;
  border-radius:8px;
  font-weight:600;
`;

const codeStyles = `
  font-size:20px;
  font-weight:700;
  letter-spacing:4px;
  background:#f3f4f6;
  padding:12px 20px;
  border-radius:8px;
  display:inline-block;
  font-family:monospace;
`;

/* ======================================================
   Layout helpers
====================================================== */

const EmailLayout = (content: string) => `
<div style="${baseStyles}">
  <div style="${containerStyles}">
    ${content}
    ${EmailFooter()}
  </div>
</div>
`;

const EmailHeader = (title: string, subtitle?: string) => `
<div style="margin-bottom:24px;">
  <h1 style="${headerStyles}">${title}</h1>
  ${subtitle ? `<p style="${mutedTextStyles}">${subtitle}</p>` : ""}
</div>
`;

const EmailFooter = () => `
<hr style="margin:32px 0;border:none;border-top:1px solid #e5e7eb;" />
<p style="${mutedTextStyles}">
  Sent by <strong>${appName}</strong><br/>
  If you didn’t request this, you can safely ignore this message.
</p>
<p style="${mutedTextStyles}">
  © ${new Date().getFullYear()} ${appName}
</p>
`;

const Greeting = (name: string) => `
<p style="${textStyles}">Hello <strong>${name}</strong>,</p>
`;

const ActionBlock = (link: string, label: string, secret?: string) =>
  secret
    ? `
<table width="100%" style="margin:24px 0;">
<tr>
<td><div style="${codeStyles}">${secret}</div></td>
<td style="padding-left:16px;">
  <a href="${link}" style="${buttonStyles}">${label}</a>
</td>
</tr>
</table>`
    : `
<div style="margin:24px 0;text-align:center;">
  <a href="${link}" style="${buttonStyles}">${label}</a>
</div>`;

/* ======================================================
   Types
====================================================== */

export interface TemplateProps {
  user: Optional<UserResponse, "roles">;
  otp?: Otp;
  identifier?: string;
  newIdentifier?: string;
  clientUrl?: Nullable<string>;
  message?: string;
}

/* ======================================================
   Signup
====================================================== */

export const signupTemplate = ({ user }: TemplateProps) => ({
  subject: `Welcome to ${appName}`,
  html: EmailLayout(`
    ${EmailHeader("Welcome 👋", "Your account is ready")}
    ${Greeting(user.displayName)}
    <p style="${textStyles}">
      Your account has been created successfully.
    </p>
    <p style="${textStyles}">
      You can now sign in and continue.
    </p>
  `),
  text: `Welcome to ${appName}. Your account is ready.`,
});

/* ======================================================
   Sign-in notification
====================================================== */

export const signinTemplate = ({ user }: TemplateProps) => ({
  subject: `New sign-in detected`,
  html: EmailLayout(`
    ${EmailHeader("New sign-in 🔐")}
    ${Greeting(user.displayName)}
    <p style="${textStyles}">
      A sign-in to your account was just detected.
    </p>
    <p style="${textStyles}">
      If this wasn’t you, please secure your account.
    </p>
  `),
  text: `A new sign-in was detected on your account.`,
});

/* ======================================================
   Set password (two-phase)
====================================================== */

export const setPasswordTemplate = ({
  user,
  otp,
  identifier,
  clientUrl,
}: TemplateProps) =>
  otp
    ? {
        subject: `Set your password`,
        html: EmailLayout(`
          ${EmailHeader("Set your password 🔑")}
          ${Greeting(user.displayName)}
          <p style="${textStyles}">
            Complete your setup by creating a password.
          </p>
          ${ActionBlock(
            `${clientUrl}/set-password?identifier=${identifier}&purpose=${otp.purpose}&secret=${otp.secret}&type=${otp.type}`,
            "Set password",
            otp.secret
          )}
          <p style="${mutedTextStyles}">This code expires soon.</p>
        `),
        text: `Your setup code is ${otp.secret}.`,
      }
    : {
        subject: `Password set successfully`,
        html: EmailLayout(`
          ${EmailHeader("Password updated ✅")}
          ${Greeting(user.displayName)}
          <p style="${textStyles}">
            Your password has been set successfully.
          </p>
        `),
        text: `Your password has been set.`,
      };

/* ======================================================
   Reset password (two-phase)
====================================================== */

export const resetPasswordTemplate = ({
  user,
  otp,
  identifier,
  clientUrl,
}: TemplateProps) =>
  otp
    ? {
        subject: `Reset your password`,
        html: EmailLayout(`
          ${EmailHeader("Reset password 🔄")}
          ${Greeting(user.displayName)}
          <p style="${textStyles}">
            Use the code below to reset your password.
          </p>
          ${ActionBlock(
            `${clientUrl}/reset-password?identifier=${identifier}&purpose=${otp.purpose}&secret=${otp.secret}&type=${otp.type}`,
            "Reset password",
            otp.secret
          )}
          <p style="${mutedTextStyles}">Code expires shortly.</p>
        `),
        text: `Your reset code is ${otp.secret}.`,
      }
    : {
        subject: `Password reset successful`,
        html: EmailLayout(`
          ${EmailHeader("Password updated ✅")}
          ${Greeting(user.displayName)}
          <p style="${textStyles}">
            Your password has been reset successfully.
          </p>
        `),
        text: `Password reset successful.`,
      };

/* ======================================================
   Verify identifier
====================================================== */

export const verifyIdentifierTemplate = ({
  user,
  otp,
  identifier,
  clientUrl,
}: TemplateProps) => {
  const type = identifier?.includes("@") ? "contact detail" : "contact detail";
  const link = `${clientUrl}/verify?identifier=${identifier}&purpose=${otp?.purpose}&secret=${otp?.secret}&type=${otp?.type}`;

  return {
    subject: `Verify your account`,
    html: EmailLayout(`
      ${EmailHeader("Verification required")}
      ${Greeting(user.displayName)}
      <p style="${textStyles}">
        Please verify your ${type} to continue.
      </p>
      ${otp ? ActionBlock(link, "Verify", otp.secret) : ""}
    `),
    text: `Your verification code is ${otp?.secret}.`,
  };
};

/* ======================================================
   Change identifier (two-phase)
====================================================== */

export const changeIdentifierTemplate = ({
  user,
  otp,
  identifier,
  newIdentifier,
  clientUrl,
}: TemplateProps) =>
  otp
    ? {
        subject: `Confirm change request`,
        html: EmailLayout(`
          ${EmailHeader("Confirm change 🔄")}
          ${Greeting(user.displayName)}
          <p style="${textStyles}">
            A request was made to update your contact information.
          </p>
          ${ActionBlock(
            `${clientUrl}/confirm-change?identifier=${identifier}&newIdentifier=${newIdentifier}&purpose=${otp.purpose}&secret=${otp.secret}&type=${otp.type}`,
            "Confirm change",
            otp.secret
          )}
        `),
        text: `Confirm the requested change.`,
      }
    : {
        subject: `Update successful`,
        html: EmailLayout(`
          ${EmailHeader("Update completed ✅")}
          ${Greeting(user.displayName)}
          <p style="${textStyles}">
            Your contact information has been updated.
          </p>
        `),
        text: `Your information was updated successfully.`,
      };

/* ======================================================
   MFA
====================================================== */

export const verifyMfaTemplate = ({ user, otp }: TemplateProps) => ({
  subject: `Your verification code`,
  html: EmailLayout(`
    ${EmailHeader("Verification code 🔐")}
    ${Greeting(user.displayName)}
    <div style="text-align:center;margin:24px 0;">
      <div style="${codeStyles}">${otp?.secret}</div>
      <p style="${mutedTextStyles}">Expires shortly</p>
    </div>
  `),
  text: `Your code is ${otp?.secret}.`,
});

export const enableMfaTemplate = ({ user, otp }: TemplateProps) =>
  otp
    ? {
        subject: `Enable additional security`,
        html: EmailLayout(`
          ${EmailHeader("Enable security 🔒")}
          ${Greeting(user.displayName)}
          <div style="text-align:center;margin:24px 0;">
            <div style="${codeStyles}">${otp.secret}</div>
          </div>
        `),
        text: `Your setup code is ${otp.secret}.`,
      }
    : {
        subject: `Security enabled`,
        html: EmailLayout(`
          ${EmailHeader("Security enabled ✅")}
          ${Greeting(user.displayName)}
          <p style="${textStyles}">
            Additional security has been enabled for your account.
          </p>
        `),
        text: `Security enabled.`,
      };

export const disableMfaTemplate = ({ user, otp }: TemplateProps) =>
  otp
    ? {
        subject: `Disable additional security`,
        html: EmailLayout(`
          ${EmailHeader("Disable security ⚠️")}
          ${Greeting(user.displayName)}
          <div style="text-align:center;margin:24px 0;">
            <div style="${codeStyles}">${otp.secret}</div>
          </div>
        `),
        text: `Your disable code is ${otp.secret}.`,
      }
    : {
        subject: `Security disabled`,
        html: EmailLayout(`
          ${EmailHeader("Security disabled ⚠️")}
          ${Greeting(user.displayName)}
          <p style="${textStyles}">
            Additional security has been disabled.
          </p>
        `),
        text: `Security disabled.`,
      };

/* ======================================================
   Security alert
====================================================== */

export const securityAlertTemplate = ({ user, message }: TemplateProps) => ({
  subject: `Security alert`,
  html: EmailLayout(`
    ${EmailHeader("Security alert 🚨")}
    ${Greeting(user.displayName)}
    <div style="background:#fef2f2;padding:16px;border-radius:8px;">
      <p style="margin:0;font-weight:600;">${message}</p>
    </div>
  `),
  text: `Security alert: ${message}`,
});
