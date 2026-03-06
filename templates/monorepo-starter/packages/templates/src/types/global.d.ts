import type {
  Booking,
  FlightSegment,
  Hotel,
  Otp,
  Payment,
  VisaProduct,
} from "@workspace/contracts";

declare global {
  /********************
   * EMAIL
   ********************/

  interface EmailTemplateComponent {
    (props: EmailTemplateProps): React.ReactElement;
    subject: (props: EmailTemplateProps) => string;
    message: (props: EmailTemplateProps) => string;
  }

  interface EmailTemplateResult {
    subject: string;
    html: string;
    message: string;
  }

  interface EmailTemplateProps {
    user: SafeUser;
    otp?: Otp;
    identifier?: string;
    newIdentifier?: string;
    clientUrl?: string;
    message?: string;
  }
}

export {};
