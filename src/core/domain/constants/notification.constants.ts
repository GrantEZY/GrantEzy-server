import {
    EmailTemplateType,
    InviteUserEmailTemplate,
} from "./email.template.constants";

export enum EmailNotifications {
    VERIFY_EMAIL = "Verify your email",
    RESET_PASSWORD = "Reset your password",
    WELCOME = "Welcome to GrantEzy!",
    PASSWORD_CHANGED = "Your password has been changed",
    PROGRAM_ENROLLMENT = "You've been enrolled in a new program",
    PROGRAM_COMPLETION = "Congratulations on completing your program!",
    REVIEW_REQUEST = "We value your review",
    NEWSLETTER = "Latest updates from GrantEzy",
    ACCOUNT_DELETION = "Your account has been deleted",
    SUPPORT_RESPONSE = "Response from GrantEzy Support",
    INVITE_USER = "You have been invited",
}

export enum NotificationChannel {
    EMAIL = "EMAIL",
    SMS = "SMS",
    INTERNAL = "INTERNAL",
}

export enum NotificationType {
    INFO = "INFO",
    WARNING = "WARNING",
    ERROR = "ERROR",
    SUCCESS = "SUCCESS",
}

export enum NotificationStatus {
    CREATED = "CREATED",
    SENT = "SENT",
    READ = "READ",
}

export const EmailNotificationTemplateMapper: Record<
    string,
    EmailTemplateType
> = {
    [EmailNotifications.INVITE_USER]: InviteUserEmailTemplate,
};
