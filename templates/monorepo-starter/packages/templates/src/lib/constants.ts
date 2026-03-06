import * as emailTemplates from "@workspace/templates/email";

export const emailTemplateMap: Record<
  NotificationPurpose,
  EmailTemplateComponent
> = {
  authSignIn: emailTemplates.Signin,
  authSignUp: emailTemplates.Signup,

  accountSuspended: emailTemplates.AccountSuspended,
  accountReactivated: emailTemplates.AccountReactivated,

  authVerifyIdentifier: emailTemplates.VerifyIdentifier,
  authUpdateIdentifier: emailTemplates.UpdateIdentifier,

  authSetPassword: emailTemplates.SetPassword,
  authResetPassword: emailTemplates.ResetPassword,

  authVerifyMfa: emailTemplates.VerifyMfa,
  authUpdateMfa: emailTemplates.UpdateMfa,
  authDisableMfa: emailTemplates.DisableMfa,
};
