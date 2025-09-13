export interface EmailServicePort {
    sendEmail(to: string, subject: string, body: string): Promise<boolean>;
}

export const EMAIL_SERVICE_PORT = Symbol("EmailServicePort");
