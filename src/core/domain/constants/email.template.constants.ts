import {
    CycleInviteDTO,
    EmailBody,
    InviteEmailDTO,
} from "../../../infrastructure/driving/dtos/queue/queue.dto";

const BASE_URL = process.env.CLIENT_URL;
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
          <td>${(values as InviteEmailDTO).password}</td>
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

export const CycleInviteEmailTemplate: EmailTemplateType = {
    subject: `You’ve been invited to collaborate on a Cycle Application`,
    body: (values: EmailBody) => `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h2 style="color: #2c3e50;">Invitation to Cycle Application 🎉</h2>

      <p>Hello,</p>
      <p>
        You have been invited by <strong>${(values as CycleInviteDTO).invitedBy}</strong> to join the application
        <strong>${(values as CycleInviteDTO).applicationName}</strong> under the program
        <strong>${(values as CycleInviteDTO).programName}</strong>.
      </p>

      <table cellpadding="6" cellspacing="0" border="0"
             style="background: #f8f9fa; border: 1px solid #ddd; border-radius: 6px; margin: 16px 0;">
        <tr>
          <td><strong>Email:</strong></td>
          <td>${values.email}</td>
        </tr>
        <tr>
          <td><strong>Role:</strong></td>
          <td>${values.role}</td>
        </tr>
        <tr>
          <td><strong>Program:</strong></td>
          <td>${(values as CycleInviteDTO).programName}</td>
        </tr>
        <tr>
          <td><strong>Application:</strong></td>
          <td>${(values as CycleInviteDTO).applicationName}</td>
        </tr>
        <tr>
          <td><strong>Round:</strong></td>
          <td>${String((values as CycleInviteDTO).round.year)} - ${(values as CycleInviteDTO).round.type}</td>
        </tr>
      </table>

      <p>
        👉 <a href="${BASE_URL ?? "http://localhost"}/invite-accept-or-reject/${(values as CycleInviteDTO).token}"
              style="background: #4CAF50; color: white; padding: 10px 16px;
                     text-decoration: none; border-radius: 5px; display: inline-block;">
            Accept Or Reject Invite
        </a>
      </p>

      <p style="margin-top: 20px;">
        Once logged in, you’ll be able to access the cycle application and perform your role as
        <strong>${values.role}</strong>.
      </p>

      <p>Best regards,<br/>The GrantEzy Team</p>
    </div>
  `,
};
