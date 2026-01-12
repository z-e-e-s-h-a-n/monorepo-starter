import { Injectable } from "@nestjs/common";
import type { TemplateProps } from "@templates/notification.templates";
import * as templates from "@templates/notification.templates";

@Injectable()
export class TemplateService {
  private readonly templateFactory: Record<
    NotificationPurpose,
    (data: TemplateProps) => TemplateReturn
  > = {
    signin: templates.signinTemplate,
    signup: templates.signupTemplate,
    verifyIdentifier: templates.verifyIdentifierTemplate,
    setPassword: templates.setPasswordTemplate,
    resetPassword: templates.resetPasswordTemplate,
    changeIdentifier: templates.changeIdentifierTemplate,
    verifyMfa: templates.verifyMfaTemplate,
    enableMfa: templates.enableMfaTemplate,
    disableMfa: templates.disableMfaTemplate,
  };

  resolveTemplate(
    purpose: NotificationPurpose,
    metadata: TemplateProps
  ): TemplateReturn {
    const templateFn = this.templateFactory[purpose];
    if (!templateFn) {
      throw new Error(`Undefined template purpose: ${purpose}`);
    }

    return templateFn(metadata);
  }
}
