import {Resend} from "resend";
import {EmailServicePort} from "../../../ports/outputs/email/email.service.port";
import {Injectable} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import {ConfigType} from "../../../config/env/app.types";
@Injectable()
/**
 * Email Service using Resend
 * Documentation: https://resend.com/docs
 */
export class EmailService implements EmailServicePort {
    private resend: Resend;

    constructor(private readonly configService: ConfigService<ConfigType>) {
        const apiKey = this.configService.get("app").RESEND_API;
        this.resend = new Resend(apiKey as string);
    }
    async sendEmail(
        to: string,
        subject: string,
        body: string
    ): Promise<boolean> {
        try {
            // eslint-disable-next-line
            const {data: _data, error} = await this.resend.emails.send({
                from: "<your-email@example.com>",
                to,
                subject,
                html: body,
            });
            if (error) {
                console.error("Error sending email:", error);
                return false;
            }
            return true;
        } catch (error) {
            console.error("Error sending email:", error);
            return false;
        }
    }
}
