import type { EnvService } from "@modules/env/env.service";
import type { Otp, User } from "@generated/prisma";
import { appName } from "@constants/app";

const baseStyles = `
  font-family: Arial, sans-serif;
  color: #222;
  line-height: 1.6;
`;

const buttonStyles = `
  display:inline-block;
  padding:12px 20px;
  background-color:#007bff;
  color:#fff;
  text-decoration:none;
  border-radius:6px;
  font-weight:bold;
`;

export interface TemplateProps {
  user: User;
  otp?: Otp;
  identifier?: string;
  newIdentifier?: string;
  env?: EnvService;
  message?: string;
}

/** Sign up email */
export const signupTemplate = ({ user }: TemplateProps) => ({
  subject: `🎉 Welcome, ${user.displayName}!`,
  html: `
    <div style="${baseStyles}">
      <h1>Welcome to ${appName}, ${user.displayName}!</h1>
      <p>We’re glad to have you onboard. Explore and make the most of our platform.</p>
      <p>— The ${appName} Team</p>
    </div>
  `,
  text: `Welcome to ${appName}, ${user.displayName}! Enjoy exploring the platform.`,
});

/** Sign in email */
export const signinTemplate = ({ user }: TemplateProps) => ({
  subject: `🔐 You’ve signed in to ${appName}`,
  html: `
    <div style="${baseStyles}">
      <h2>Hi ${user.displayName},</h2>
      <p>You’ve successfully signed in to your account.</p>
      <p>If this wasn’t you, please <strong>reset your password</strong> immediately.</p>
      <p>— The ${appName} Team</p>
    </div>
  `,
  text: `Hi ${user.displayName}, you’ve logged in. If this wasn’t you, reset your password immediately.`,
});

/** Set password template (two-phase) */
export const setPasswordTemplate = ({
  user,
  otp,
  identifier,
  env,
}: TemplateProps) => {
  if (otp) {
    const link = `${env?.get("CLIENT_ENDPOINT")}/set-password?identifier=${identifier}&purpose=${otp.purpose}&secret=${otp.secret}&type=${otp.type}`;
    return {
      subject: `🔐 Complete Account Setup`,
      html: `
        <div style="${baseStyles}">
          <h2>Hello ${user.displayName},</h2>
          <p>Use the code below to set your password and complete your account setup:</p>
          <h3>${otp.secret}</h3>
          <a href="${link}" style="${buttonStyles}">Set Password</a>
          <p>If you didn’t request this, ignore this email.</p>
        </div>
      `,
      text: `Hi ${user.displayName}, your OTP is ${otp.secret}. Set your password here: ${link}`,
    };
  } else {
    return {
      subject: `✅ Password Set Successfully`,
      html: `
        <div style="${baseStyles}">
          <h2>Hello ${user.displayName},</h2>
          <p>Your password has been successfully set. You can now log in to your account.</p>
        </div>
      `,
      text: `Hi ${user.displayName}, your password has been set. You can now log in.`,
    };
  }
};

/** Reset password template (two-phase) */
export const resetPasswordTemplate = ({
  user,
  otp,
  identifier,
  env,
}: TemplateProps) => {
  if (otp) {
    const link = `${env?.get("CLIENT_ENDPOINT")}/reset-password?identifier=${identifier}&purpose=${otp.purpose}&secret=${otp.secret}&type=${otp.type}`;
    return {
      subject: `🔁 Reset Your Password`,
      html: `
        <div style="${baseStyles}">
          <h2>Hello ${user.displayName},</h2>
          <p>We received a request to reset your password for <strong>${identifier}</strong>. Use the code below:</p>
          <h3>${otp.secret}</h3>
          <a href="${link}" style="${buttonStyles}">Reset Password</a>
          <p>If you didn’t request this, ignore this email.</p>
        </div>
      `,
      text: `Hi ${user.displayName}, your OTP to reset password is ${otp.secret}. Reset here: ${link}`,
    };
  } else {
    return {
      subject: `✅ Password Reset Successfully`,
      html: `
        <div style="${baseStyles}">
          <h2>Hello ${user.displayName},</h2>
          <p>Your password has been successfully reset. You can now log in to your account.</p>
        </div>
      `,
      text: `Hi ${user.displayName}, your password has been reset. You can now log in.`,
    };
  }
};

/** Verify identifier template */
export const verifyIdentifierTemplate = ({
  user,
  otp,
  identifier,
  env,
}: TemplateProps) => {
  const link = `${env?.get("CLIENT_ENDPOINT")}/verify?identifier=${identifier}&purpose=${otp?.purpose}&secret=${otp?.secret}&type=${otp?.type}`;
  return {
    subject: `📧 Verify Your Account`,
    html: `
      <div style="${baseStyles}">
        <h2>Hello ${user.displayName},</h2>
        <p>Please verify your ${identifier?.includes("@") ? "email address" : "phone number"} to activate your account.</p>
        <p>Your verification code: <strong>${otp?.secret}</strong></p>
        <a href="${link}" style="${buttonStyles}">Verify Now</a>
      </div>
    `,
    text: `Hi ${user.displayName}, your OTP is ${otp?.secret}. Verify here: ${link}`,
  };
};

/** Change identifier template (two-phase) */
export const changeIdentifierTemplate = ({
  user,
  otp,
  identifier,
  newIdentifier,
  env,
}: TemplateProps) => {
  const identifierType = identifier?.includes("@")
    ? "email address"
    : "phone number";
  if (otp) {
    const link = `${env?.get("CLIENT_ENDPOINT")}/confirm-change?identifier=${identifier}&newIdentifier=${newIdentifier}&purpose=${otp.purpose}&secret=${otp.secret}&type=${otp.type}`;
    return {
      subject: `📨 Confirm ${identifierType} Change — ${appName}`,
      html: `
        <div style="${baseStyles}">
          <h2>Hello ${user.displayName},</h2>
          <p>We received a request to change your ${identifierType}.</p>
          <p>Previous ${identifierType}: <strong>${identifier}</strong></p>
          <p>New ${identifierType}: <strong>${newIdentifier}</strong></p>
          <a href="${link}" style="${buttonStyles}">Confirm Change</a>
          <p>If you didn’t request this, ignore this email and secure your account.</p>
        </div>
      `,
      text: `Hi ${user.displayName}, request to change ${identifierType} from ${identifier} to ${newIdentifier}. Confirm here: ${link}`,
    };
  } else {
    return {
      subject: `✅ ${identifierType} Changed Successfully — ${appName}`,
      html: `
        <div style="${baseStyles}">
          <h2>Hello ${user.displayName},</h2>
          <p>Your ${identifierType} has been successfully updated.</p>
          <p>Previous ${identifierType}: <strong>${identifier}</strong></p>
          <p>New ${identifierType}: <strong>${newIdentifier}</strong></p>
          <p>If this wasn’t you, update your credentials immediately.</p>
        </div>
      `,
      text: `Hi ${user.displayName}, your ${identifierType} was changed from ${identifier} to ${newIdentifier}.`,
    };
  }
};

/** MFA Templates */
export const verifyMfaTemplate = ({ user, otp }: TemplateProps) => ({
  subject: `📲 Your 2FA Code`,
  html: `
    <div style="${baseStyles}">
      <h2>Hello ${user.displayName},</h2>
      <p>Your two-factor authentication code is:</p>
      <h3>${otp?.secret}</h3>
      <p>This code expires shortly — do not share it.</p>
    </div>
  `,
  text: `Hi ${user.displayName}, your 2FA code is ${otp?.secret}.`,
});

export const enableMfaTemplate = ({ user, otp }: TemplateProps) => {
  if (otp) {
    return {
      subject: `🔑 Enable 2FA — OTP Required`,
      html: `
        <div style="${baseStyles}">
          <h2>Hello ${user.displayName},</h2>
          <p>Use this code to enable 2FA for your account:</p>
          <h3>${otp.secret}</h3>
          <p>It expires soon. Do not share this code.</p>
        </div>
      `,
      text: `Hi ${user.displayName}, use OTP ${otp.secret} to enable 2FA.`,
    };
  } else {
    return {
      subject: `✅ 2FA Enabled`,
      html: `
        <div style="${baseStyles}">
          <h2>Hello ${user.displayName},</h2>
          <p>Two-factor authentication has been enabled successfully. Your account is now more secure.</p>
        </div>
      `,
      text: `Hi ${user.displayName}, 2FA has been enabled.`,
    };
  }
};

export const disableMfaTemplate = ({ user, otp }: TemplateProps) => {
  if (otp) {
    return {
      subject: `🔑 Disable 2FA — OTP Required`,
      html: `
        <div style="${baseStyles}">
          <h2>Hello ${user.displayName},</h2>
          <p>Use this code to disable 2FA:</p>
          <h3>${otp.secret}</h3>
          <p>If this wasn’t you, secure your account immediately.</p>
        </div>
      `,
      text: `Hi ${user.displayName}, your OTP to disable 2FA is ${otp.secret}.`,
    };
  } else {
    return {
      subject: `⚠️ 2FA Disabled`,
      html: `
        <div style="${baseStyles}">
          <h2>Hello ${user.displayName},</h2>
          <p>Two-factor authentication has been disabled. If this wasn’t you, re-enable it immediately.</p>
        </div>
      `,
      text: `Hi ${user.displayName}, 2FA has been disabled.`,
    };
  }
};

/** Security alert template */
export const securityAlertTemplate = ({ user, message }: TemplateProps) => ({
  subject: `⚠️ Security Alert`,
  html: `
    <div style="${baseStyles}">
      <h2>Hello ${user.displayName},</h2>
      <p>${message}</p>
      <p>If you notice any suspicious activity, update your password immediately.</p>
    </div>
  `,
  text: `Hi ${user.displayName}, ${message}`,
});
