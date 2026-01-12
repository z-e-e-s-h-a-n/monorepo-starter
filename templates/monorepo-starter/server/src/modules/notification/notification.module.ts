import { Global, Module } from "@nestjs/common";
import { NotificationService } from "./notification.service";
import { TemplateModule } from "@modules/template/template.module";
import { NodemailerService } from "./nodemailer.service";

@Global()
@Module({
  imports: [TemplateModule],
  providers: [NotificationService, NodemailerService],
  exports: [NotificationService],
})
export class NotificationModule {}
