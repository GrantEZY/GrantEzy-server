/* eslint-disable @typescript-eslint/restrict-template-expressions */

import {
    CycleInviteDTO,
    EmailBody,
    InviteEmailDTO,
    ForgotPasswordEmailDTO,
    ProjectCreationDTO,
    CycleReviewEmailDTO,
    RemoveApplicantFromTeamMate,
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
          <td>${(values as InviteEmailDTO).email}</td>
        </tr>
        <tr>
          <td><strong>Password:</strong></td>
          <td>${(values as InviteEmailDTO).password}</td>
        </tr>
          <tr>
          <td><strong>Role:</strong></td>
          <td>${(values as InviteEmailDTO).role as string}</td>
        </tr>
      </table>

      <p>
        👉 <a href="${BASE_URL}" style="background: #4CAF50; color: white; padding: 10px 16px;
           text-decoration: none; border-radius: 5px; display: inline-block;">
           Visit GrantEzy
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
        You have been invited by <strong>${(values as unknown as CycleInviteDTO).invitedBy}</strong> to join the application
        <strong>${(values as unknown as CycleInviteDTO).applicationName}</strong> under the program
        <strong>${(values as unknown as CycleInviteDTO).programName}</strong>.
      </p>

      <table cellpadding="6" cellspacing="0" border="0"
             style="background: #f8f9fa; border: 1px solid #ddd; border-radius: 6px; margin: 16px 0;">
        <tr>
          <td><strong>Email:</strong></td>
          <td>${(values as unknown as CycleInviteDTO).email}</td>
        </tr>
        <tr>
          <td><strong>Role:</strong></td>
          <td>${(values as unknown as CycleInviteDTO).role}</td>
        </tr>
        <tr>
          <td><strong>Program:</strong></td>
          <td>${(values as unknown as CycleInviteDTO).programName}</td>
        </tr>
        <tr>
          <td><strong>Application:</strong></td>
          <td>${(values as unknown as CycleInviteDTO).applicationName}</td>
        </tr>
        <tr>
          <td><strong>Round:</strong></td>
          <td>${String((values as unknown as CycleInviteDTO).round.year)} - ${(values as unknown as CycleInviteDTO).round.type}</td>
        </tr>
      </table>

      <p>
        👉 <a href="${(values as unknown as CycleInviteDTO).inviteUrl}"
              style="background: #4CAF50; color: white; padding: 10px 16px;
                     text-decoration: none; border-radius: 5px; display: inline-block;">
            Accept Or Reject Invite
        </a>
      </p>

      <p style="margin-top: 20px;">
        Once logged in, you'll be able to access the cycle application and perform your role as
        <strong>${(values as unknown as CycleInviteDTO).role}</strong>.
      </p>

      <p>Best regards,<br/>The GrantEzy Team</p>
    </div>
  `,
};

export const ReviewerInviteEmailTemplate: EmailTemplateType = {
    subject: `You've been invited to review an application`,
    body: (values: EmailBody) => `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h2 style="color: #2c3e50;">Review Request for Grant Application 📝</h2>

      <p>Hello,</p>
      <p>
        <strong>${(values as unknown as CycleInviteDTO).invitedBy}</strong> has invited you to review the application
        <strong>${(values as unknown as CycleInviteDTO).applicationName}</strong> under the program
        <strong>${(values as unknown as CycleInviteDTO).programName}</strong>.
      </p>

      <p>
        As a reviewer, you will be able to evaluate the application based on specific criteria
        and provide your expert feedback to help with the selection process.
      </p>

      <table cellpadding="6" cellspacing="0" border="0"
             style="background: #f8f9fa; border: 1px solid #ddd; border-radius: 6px; margin: 16px 0;">
        <tr>
          <td><strong>Your Email:</strong></td>
          <td>${(values as unknown as CycleInviteDTO).email}</td>
        </tr>
        <tr>
          <td><strong>Role:</strong></td>
          <td>Reviewer</td>
        </tr>
        <tr>
          <td><strong>Program:</strong></td>
          <td>${(values as unknown as CycleInviteDTO).programName}</td>
        </tr>
        <tr>
          <td><strong>Application:</strong></td>
          <td>${(values as unknown as CycleInviteDTO).applicationName}</td>
        </tr>
        <tr>
          <td><strong>Round:</strong></td>
          <td>${String((values as unknown as CycleInviteDTO).round.year)} - ${(values as unknown as CycleInviteDTO).round.type}</td>
        </tr>
      </table>

      <p>
        👉 <a href="${(values as unknown as CycleInviteDTO).inviteUrl}"
              style="background: #2196F3; color: white; padding: 12px 24px;
                     text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
            Accept or Decline Review Request
        </a>
      </p>

      <p style="color: #666; font-size: 14px;">
        By accepting, you'll be able to access the application details and submit your review.
        If you decline, the program manager will be notified.
      </p>

      <p>Best regards,<br/>The GrantEzy Team</p>
    </div>
  `,
};

export const ForgotPasswordEmailTemplate: EmailTemplateType = {
    subject: `Reset your password for GrantEzy`,
    body: (values: EmailBody) => `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h2 style="color: #2c3e50;">Password Reset Request 🔒</h2>

      <p>Hello,</p>
      <p>
        We received a request to reset the password for your <strong>GrantEzy</strong> account associated with
        <strong>${(values as ForgotPasswordEmailDTO).email}</strong>.
      </p>

      <p style="margin: 16px 0;">
        Click the button below to reset your password. This link will expire in 30 minutes for security reasons.
      </p>

      <p>
        👉 <a href="${BASE_URL ?? "http://localhost"}/reset-password/${(values as ForgotPasswordEmailDTO).token}/${(values as ForgotPasswordEmailDTO).slug}"
              style="background: #4CAF50; color: white; padding: 10px 16px;
                     text-decoration: none; border-radius: 5px; display: inline-block;">
            Reset My Password
        </a>
      </p>

      <p style="margin-top: 20px;">
        If you did not request a password reset, you can safely ignore this email —
        your account will remain secure.
      </p>

      <p style="margin-top: 30px;">
        Best regards,<br/>
        <strong>The GrantEzy Team</strong>
      </p>

      <hr style="margin-top: 30px; border: none; border-top: 1px solid #eee;">
      <p style="font-size: 12px; color: #777;">
        If the button above doesn't work, copy and paste this link into your browser:
        <br/>
        <a href="${BASE_URL ?? "http://localhost"}/reset-password/${(values as ForgotPasswordEmailDTO).token}/${(values as ForgotPasswordEmailDTO).slug}" style="color: #4CAF50;">
          ${BASE_URL ?? "http://localhost"}/reset-password/${(values as ForgotPasswordEmailDTO).token}/${(values as ForgotPasswordEmailDTO).slug}
        </a>
      </p>
    </div>
  `,
};

export const ProjectCreatedFromApplicationEmailTemplate: EmailTemplateType = {
    subject: `Your project has been created on GrantEzy 🎉`,
    body: (values: EmailBody) => `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h2 style="color: #2c3e50;">Project Created Successfully 🚀</h2>

      <p>Hello,</p>

      <p>Hi ${(values as ProjectCreationDTO).userName},</p>

      <p>
        We’re excited to let you know that your application
        <strong>"${(values as ProjectCreationDTO).applicationName}"</strong> has been successfully converted into a project
        on <strong>GrantEzy</strong>.
      </p>

      <p>
        You can now track your project’s progress and manage its details from your dashboard.
      </p>

      <p style="margin-top: 24px;">
        Best regards,<br/>
        <strong>The GrantEzy Team</strong>
      </p>

      <hr style="margin-top: 30px; border: none; border-top: 1px solid #eee;">
      <p style="font-size: 12px; color: #777;">
        This is an automated message — please do not reply directly to this email.
      </p>
    </div>
  `,
};

export const CycleReviewCreatedEmailTemplate: EmailTemplateType = {
    subject: `A new Cycle Review has been created`,
    body: (values: EmailBody) => `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h2 style="color: #2c3e50;">New Cycle Review Created 🎯</h2>

      <p>Hi ${(values as CycleReviewEmailDTO).userName},</p>
      <p>
        A new cycle review titled <strong>${(values as CycleReviewEmailDTO).cycleReviewName}</strong>
        has been created. Please find the details below:
      </p>

      <table cellpadding="6" cellspacing="0" border="0" style="background: #f8f9fa; border: 1px solid #ddd; border-radius: 6px; margin: 16px 0;">
        <tr>
          <td><strong>Review Name:</strong></td>
          <td>${(values as CycleReviewEmailDTO).cycleReviewName}</td>
        </tr>
        <tr>
          <td><strong>Project/Application:</strong></td>
          <td>${(values as CycleReviewEmailDTO).applicationName}</td>
        </tr>
        <tr>
          <td><strong>Review Brief:</strong></td>
          <td>${(values as CycleReviewEmailDTO).reviewBrief}</td>
        </tr>
      </table>

      <p>
        👉 <a href="https://grantezy.com/dashboard" style="background: #007BFF; color: white; padding: 10px 16px;
           text-decoration: none; border-radius: 5px; display: inline-block;">
           View Review Details
        </a>
      </p>

      <p style="margin-top: 20px;">You’ll be notified about further updates related to this review.</p>

      <p>Best regards,<br/>The GrantEzy Team</p>
    </div>
  `,
};

export const ProjectAssessmentReviewerInviteEmailTemplate: EmailTemplateType = {
    subject: `You've been invited to evaluate a project`,
    body: (values: EmailBody) => `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h2 style="color: #2c3e50;">Project Evaluation Invitation 📝</h2>

      <p>Hello,</p>
      <p>
        <strong>${(values as unknown as CycleInviteDTO).invitedBy}</strong> has invited you to evaluate the project
        <strong>${(values as unknown as CycleInviteDTO).applicationName}</strong> under the program
        <strong>${(values as unknown as CycleInviteDTO).programName}</strong>.
      </p>

      <p>
        As an evaluator, you will review the project's documentation and assess it based on defined criteria
        to contribute your expert insights to the evaluation process.
      </p>

      <table cellpadding="6" cellspacing="0" border="0"
             style="background: #f8f9fa; border: 1px solid #ddd; border-radius: 6px; margin: 16px 0;">
        <tr>
          <td><strong>Your Email:</strong></td>
          <td>${(values as unknown as CycleInviteDTO).email}</td>
        </tr>
        <tr>
          <td><strong>Role:</strong></td>
          <td>Revi</td>
        </tr>
        <tr>
          <td><strong>Program:</strong></td>
          <td>${(values as unknown as CycleInviteDTO).programName}</td>
        </tr>
        <tr>
          <td><strong>Project:</strong></td>
          <td>${(values as unknown as CycleInviteDTO).applicationName}</td>
        </tr>
        <tr>
          <td><strong>Evaluation Cycle:</strong></td>
          <td>${String((values as unknown as CycleInviteDTO).round.year)} - ${(values as unknown as CycleInviteDTO).round.type}</td>
        </tr>
      </table>

      <p>
        👉 <a href="${(values as unknown as CycleInviteDTO).inviteUrl}"
              style="background: #2196F3; color: white; padding: 12px 24px;
                     text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
            Accept or Decline Evaluation Request
        </a>
      </p>

      <p style="color: #666; font-size: 14px;">
        By accepting, you'll gain access to all project details and will be able to submit your evaluation.
        If you decline, the project manager will be notified.
      </p>

      <p>Best regards,<br/>The GrantEzy Team</p>
    </div>
  `,
};

export const RemoveFromApplicationEmailTemplate: EmailTemplateType = {
    subject: `You have been removed from an application on GrantEzy`,
    body: (values: EmailBody) => `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h2 style="color: #c0392b;">Removed from Application</h2>

      <p>Hello,</p>

      <p>
        This is to inform you that you have been removed as a <strong>team member</strong>
        from the application <strong>${(values as RemoveApplicantFromTeamMate).applicationName}</strong>
        on <strong>GrantEzy</strong>.
      </p>



      <p>
        If you believe this was a mistake or need further clarification,
        please reach out to the applicant or contact our support team.
      </p>

      <p>
        👉 <a href="${BASE_URL}" style="background: #4CAF50; color: white; padding: 10px 16px;
           text-decoration: none; border-radius: 5px; display: inline-block;">
           Visit GrantEzy
        </a>
      </p>

      <p>Best regards,<br/>The GrantEzy Team</p>
    </div>
  `,
};

export const CoApplicantLeftApplicationEmailTemplate: EmailTemplateType = {
    subject: `A team member has left your application on GrantEzy`,
    body: (values: EmailBody) => `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h2 style="color: #2c3e50;">Team Member Update</h2>

      <p>Hello,</p>

      <p>
        This is to inform you that a <strong>team member</strong> has left your application
        <strong>${(values as RemoveApplicantFromTeamMate).applicationName}</strong>
        on <strong>GrantEzy</strong>.
      </p>

      <p>
        You can continue working on your application and invite another team member if required.
      </p>

      <p>
        👉 <a href="${BASE_URL}" style="background: #4CAF50; color: white; padding: 10px 16px;
           text-decoration: none; border-radius: 5px; display: inline-block;">
           Go to GrantEzy
        </a>
      </p>

      <p>Best regards,<br/>The GrantEzy Team</p>
    </div>
  `,
};
