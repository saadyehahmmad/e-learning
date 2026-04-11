import { Injectable, Logger } from '@nestjs/common';
import fs from 'node:fs/promises';
import { ConfigService } from '@nestjs/config';
import nodemailer from 'nodemailer';
import Handlebars from 'handlebars';
import { AllConfigType } from '../config/config.type';

@Injectable()
export class MailerService {
  private readonly logger = new Logger(MailerService.name);
  private readonly transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService<AllConfigType>) {
    const disabled = configService.get('mail.disabled', { infer: true });
    if (disabled) {
      this.transporter = nodemailer.createTransport({
        jsonTransport: true,
      });
      this.logger.log(
        'MAIL_DISABLED=true: emails are not sent via SMTP (use for local dev without Maildev).',
      );
    } else {
      this.transporter = nodemailer.createTransport({
        host: configService.get('mail.host', { infer: true }),
        port: configService.get('mail.port', { infer: true }),
        ignoreTLS: configService.get('mail.ignoreTLS', { infer: true }),
        secure: configService.get('mail.secure', { infer: true }),
        requireTLS: configService.get('mail.requireTLS', { infer: true }),
        auth: {
          user: configService.get('mail.user', { infer: true }),
          pass: configService.get('mail.password', { infer: true }),
        },
      });
    }
  }

  async sendMail({
    templatePath,
    context,
    ...mailOptions
  }: nodemailer.SendMailOptions & {
    templatePath: string;
    context: Record<string, unknown>;
  }): Promise<void> {
    let html: string | undefined;
    if (templatePath) {
      const template = await fs.readFile(templatePath, 'utf-8');
      html = Handlebars.compile(template, {
        strict: true,
      })(context);
    }

    const info = await this.transporter.sendMail({
      ...mailOptions,
      from: mailOptions.from
        ? mailOptions.from
        : `"${this.configService.get('mail.defaultName', {
            infer: true,
          })}" <${this.configService.get('mail.defaultEmail', {
            infer: true,
          })}>`,
      html: mailOptions.html ? mailOptions.html : html,
    });

    if (this.configService.get('mail.disabled', { infer: true })) {
      this.logger.debug(
        `Mail payload (not sent over network): ${typeof info.message === 'string' ? info.message.slice(0, 500) : String(info.message)}`,
      );
    }
  }
}
