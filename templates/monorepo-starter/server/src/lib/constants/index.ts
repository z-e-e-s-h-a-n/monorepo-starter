/**
 * IMPORTANT = user must see this even if it costs money (SMS / WhatsApp)
 * Do NOT mark notifications important unless missing it causes
 * loss of access, money, or travel.
 */

export const NOTIFICATION_POLICY_MAP: Record<
  NotificationPurpose,
  { priority: NotificationPriority; push: boolean }
> = {
  // AUTH
  authSignUp: {
    priority: "normal",
    push: false,
  },
  authSignIn: {
    priority: "normal",
    push: false,
  },

  authSetPassword: {
    priority: "important",
    push: false,
  },
  authResetPassword: {
    priority: "important",
    push: false,
  },
  authVerifyIdentifier: {
    priority: "important",
    push: false,
  },
  authUpdateIdentifier: {
    priority: "important",
    push: false,
  },
  authUpdateMfa: {
    priority: "important",
    push: false,
  },
  authDisableMfa: {
    priority: "important",
    push: false,
  },
  authVerifyMfa: {
    priority: "important",
    push: false,
  },

  // ACCOUNT
  accountSuspended: {
    priority: "important",
    push: true,
  },
  accountReactivated: {
    priority: "important",
    push: true,
  },
};
