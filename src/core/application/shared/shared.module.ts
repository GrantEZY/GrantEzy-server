import {Module} from "@nestjs/common";
import {UserSharedService} from "../../domain/services/shared/user/shared.user.service";
import {SharedOrganizationService} from "../../domain/services/shared/organization/shared.organization.service";
import {SharedProgramService} from "../../domain/services/shared/program/shared.program.service";
import {Global} from "@nestjs/common";
import {EmailQueueService} from "../../domain/services/queue/email/email.queue.service";
import {CycleInviteQueueService} from "../../domain/services/queue/cycle-invite/cycle.invite.queue.service";
import {SharedApplicationService} from "../../domain/services/shared/application/shared.application.service";
@Global()
@Module({
    providers: [
        UserSharedService,
        SharedOrganizationService,
        SharedProgramService,
        EmailQueueService,
        CycleInviteQueueService,
        SharedApplicationService,
    ],
    exports: [
        UserSharedService,
        SharedOrganizationService,
        SharedProgramService,
        EmailQueueService,
        CycleInviteQueueService,
        SharedApplicationService,
    ],
})
export class SharedModule {}
