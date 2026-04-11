export type MailConfig = {
  /** When true, nodemailer uses JSON transport (no SMTP); use for local dev without Maildev. */
  disabled: boolean;
  port: number;
  host?: string;
  user?: string;
  password?: string;
  defaultEmail?: string;
  defaultName?: string;
  ignoreTLS: boolean;
  secure: boolean;
  requireTLS: boolean;
};
