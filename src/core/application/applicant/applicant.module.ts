import {Module} from "@nestjs/common";
import {ApplicantController} from "../../../infrastructure/driving/http/api/v1/applicant.controller";
import {ApplicantService} from "../../domain/services/applicant/applicant.service";
import {ApplicantCfgService} from "../../domain/services/applicant/applicant.cfg.service";
@Module({
    controllers: [ApplicantController],
    providers: [ApplicantService, ApplicantCfgService],
})
export class ApplicantModule {}
