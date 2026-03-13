import nodemailer from 'nodemailer';

function getSmtpConfig() {
  const host = process.env['SMTP_HOST'];
  const port = process.env['SMTP_PORT'] ? Number(process.env['SMTP_PORT']) : undefined;
  const user = process.env['SMTP_USER'];
  const pass = process.env['SMTP_PASS'];
  const from = process.env['SMTP_FROM'];

  if (!host || !port || !from) return null;

  const auth = user && pass ? { user, pass } : undefined;

  return { host, port, from, auth };
}

export async function sendPasswordResetEmail(to: string, resetUrl: string): Promise<boolean> {
  const cfg = getSmtpConfig();
  if (!cfg) return false;

  const transporter = nodemailer.createTransport({
    host: cfg.host,
    port: cfg.port,
    secure: cfg.port === 465,
    auth: cfg.auth,
  });

  await transporter.sendMail({
    from: cfg.from,
    to,
    subject: 'Reset your Bundle Up password',
    text: `Use this link to reset your password (expires soon):\n\n${resetUrl}\n`,
  });

  return true;
}
