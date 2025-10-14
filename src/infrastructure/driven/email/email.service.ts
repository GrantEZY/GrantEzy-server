import {EmailServicePort} from "../../../ports/outputs/email/email.service.port";
import {Injectable} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import {ConfigType} from "../../../config/env/app.types";
import nodemailer from "nodemailer";
@Injectable()
/**
 * Email Service using Resend
 * Documentation: https://resend.com/docs
 */
export class EmailService implements EmailServicePort {
    private email: string;
    private appPassword: string;
    constructor(private readonly configService: ConfigService<ConfigType>) {
        this.email = this.configService.get("app").GOOGLE_EMAIL;
        this.appPassword = this.configService.get("app").GOOGLE_APP_PASSWORD;
    }
    async sendEmail(
        to: string,
        subject: string,
        body: string
    ): Promise<boolean> {
        try {
            const transporter = this.createTransport();

            await transporter.sendMail({
                from: this.email,
                to: to,
                subject: subject,
                html: body,
            });

            return true;
        } catch (error) {
            console.error("Error sending email:", error);
            return false;
        }
    }

    createTransport() {
        const transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false,
            auth: {
                user: this.email,
                pass: this.appPassword,
            },
        });

        return transporter;
    }
}
