import { Injectable } from "@nestjs/common";
import { createTransport, type Transporter } from "nodemailer";
import { EnvService } from "@modules/env/env.service";

@Injectable()
export class NodemailerService {
  private transporter: Transporter;

  constructor(private readonly env: EnvService) {
    this.transporter = createTransport({
      host: this.env.get("SMTP_HOST"),
      port: Number(this.env.get("SMTP_PORT")),
      secure: this.env.get("SMTP_PORT") === 465,
      auth: {
        user: this.env.get("SMTP_USER"),
        pass: this.env.get("SMTP_PASS"),
      },
    });
  }

  async sendMail(options: {
    from: string;
    to: string;
    subject: string;
    html: string;
  }) {
    try {
      const info = await this.transporter.sendMail(options);
      return info;
    } catch (error) {
      throw error;
    }
  }
}
