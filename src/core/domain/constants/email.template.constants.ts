import {EmailBody} from "../../../infrastructure/driving/dtos/queue/email.dto";

export interface EmailTemplateType {
    subject: string;
    body: (values: EmailBody) => string;
}

export const InviteUserEmailTemplate: EmailTemplateType = {
    subject: `You have been invited  to GrantEzy`,
    body: (values: EmailBody) => `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h2 style="color: #2c3e50;">You've been invited to GrantEzy 🎉</h2>

      <p>Hello,</p>
      <p>You have been invited to join <strong>GrantEzy</strong>! Below are your login credentials:</p>

      <table cellpadding="6" cellspacing="0" border="0" style="background: #f8f9fa; border: 1px solid #ddd; border-radius: 6px; margin: 16px 0;">
        <tr>
          <td><strong>Email:</strong></td>
          <td>${values.email}</td>
        </tr>
        <tr>
          <td><strong>Password:</strong></td>
          <td>${values.password}</td>
        </tr>
          <tr>
          <td><strong>Email:</strong></td>
          <td>${values.role as string}</td>
        </tr>
      </table>

      <p>
        👉 <a href="https://grantezy.com/login" style="background: #4CAF50; color: white; padding: 10px 16px;
           text-decoration: none; border-radius: 5px; display: inline-block;">
           Log in to GrantEzy
        </a>
      </p>

      <p style="margin-top: 20px;">For security reasons, please change your password after your first login.</p>

      <p>Best regards,<br/>The GrantEzy Team</p>
    </div>
  `,
};
