import {Transporter} from "nodemailer";

export interface EmailServicePort {
    sendEmail(to: string, subject: string, body: string): Promise<boolean>;
    createTransport(): Transporter;
}

export const EMAIL_SERVICE_PORT = Symbol("EmailServicePort");
