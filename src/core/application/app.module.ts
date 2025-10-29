import {Module} from "@nestjs/common";
import {AppController} from "../../infrastructure/driving/http/api/v1/app.controller";
import {AppService} from "../domain/services/app/app.service";
import {DatabaseConnection} from "../../infrastructure/driven/database/connection";
import {CacheConnection} from "../../infrastructure/driven/cache/connection";
import {ConfigConnection} from "../../infrastructure/driven/env/connection";
import {AuthModule} from "./auth/auth.module";
import {UserModule} from "./user/user.module";
import {OutputPortModule} from "../../ports/outputs/output.port.module";
import {AdminModule} from "./admin/admin.module";
import {SharedModule} from "./shared/shared.module";
import {GCVModule} from "./gcv/gcv.module";
import {ApplicantModule} from "./applicant/applicant.module";
import {PublicModule} from "./public/public.module";
import {ProgramManagerModule} from "./progam-manager/pm.module";
import {QueueConnection} from "../../infrastructure/driven/queue/connection";
import {CoApplicantModule} from "./co-applicant/co.applicant.module";
import {ReviewerModule} from "./reviewer/reviewer.module";
import {ProjectManagementModule} from "./project-management/project.management.module";
@Module({
    imports: [
        ConfigConnection,
        DatabaseConnection,
        CacheConnection,
        QueueConnection,
        SharedModule,
        OutputPortModule,
        UserModule,
        AuthModule,
        AdminModule,
        GCVModule,
        ProgramManagerModule,
        ApplicantModule,
        CoApplicantModule,
        ReviewerModule,
        ProjectManagementModule,
        PublicModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
