import type * as Prisma from "../../../../server/prisma/generated/browser";
export type Otp = Prisma.Otp;

declare global {
  /********************
   * EMAIL
   ********************/

  export type EmailTemplateComponent<TPurpose extends NotificationPurpose> = {
    (props: EmailTemplateProps<TPurpose>): React.ReactElement;
    subject: (props: EmailTemplateProps<TPurpose>) => string;
    message: (props: EmailTemplateProps<TPurpose>) => string;
  };
  interface EmailTemplateResult {
    subject: string;
    html: string;
    message: string;
  }

  interface EmailTemplateBaseProps {
    user: SafeUser;
    otp?: Prisma.Otp;
    identifier: string;
    clientUrl?: string;
    message: string;
    contactMessage: Prisma.ContactMessage;
    newsletterSubscriber: Prisma.NewsletterSubscriber;
  }

  type EmailTemplateMap = {
    signUp: Pick<EmailTemplateBaseProps, "user">;

    signIn: Pick<EmailTemplateBaseProps, "user">;

    securityAlert: Pick<EmailTemplateBaseProps, "user" | "message">;

    verifyMfa: Pick<EmailTemplateBaseProps, "user" | "otp">;

    updateMfa: {
      action: "enable" | "disable" | "update";
    } & Pick<EmailTemplateBaseProps, "user" | "otp">;

    updatePassword: {
      action: "set" | "update" | "reset";
    } & Pick<
      EmailTemplateBaseProps,
      "user" | "otp" | "identifier" | "clientUrl"
    >;

    verifyIdentifier: Pick<
      EmailTemplateBaseProps,
      "user" | "otp" | "identifier" | "clientUrl"
    >;

    updateIdentifier: Pick<
      EmailTemplateBaseProps,
      "user" | "otp" | "identifier" | "clientUrl"
    > & {
      meta: {
        newIdentifier: string;
        oldIdentifier: string;
      };
    };

    userStatus: Pick<EmailTemplateBaseProps, "user" | "message">;

    newsletter: Pick<EmailTemplateBaseProps, "newsletterSubscriber">;

    contactMessage: Pick<EmailTemplateBaseProps, "contactMessage">;
  };

  type EmailTemplateProps<T extends NotificationPurpose> = {
    purpose: T;
  } & EmailTemplateMap[T];
}

export {};
