import {Injectable, Inject} from "@nestjs/common";
import {
    EmailServicePort,
    EMAIL_SERVICE_PORT,
} from "../../../../../ports/outputs/email/email.service.port";
import {
    EmailBody,
    EmailWorkerJobDTO,
} from "../../../../../infrastructure/driving/dtos/queue/email.dto";
import ApiError from "../../../../../shared/errors/api.error";
import {EmailNotifications} from "../../../constants/notification.constants";
import {EmailNotificationTemplateMapper} from "../../../constants/notification.constants";

@Injectable()
export class EmailQueueService {
    constructor(
        @Inject(EMAIL_SERVICE_PORT)
        private readonly emailRepository: EmailServicePort
    ) {}

    async sendMailService(emailData: EmailWorkerJobDTO): Promise<boolean> {
        try {
            const {type, data} = emailData;
            const {email} = data;

            const {subject, body} = this.subjectAndBodyBuilder(type, data);

            const isSuccess = await this.emailRepository.sendEmail(
                email,
                subject,
                body
            );

            return isSuccess;
        } catch (error) {
            this.handleError(error);
        }
    }

    subjectAndBodyBuilder(type: EmailNotifications, data: EmailBody) {
        const mapper = EmailNotificationTemplateMapper[type];

        const subject = mapper.subject;
        const body = mapper.body(data);

        return {subject, body};
    }

    handleError(error: unknown): never {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(500, "Internal Server Error", "Server Error");
    }
}
