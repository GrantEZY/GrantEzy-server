import {Module} from "@nestjs/common";
import {CoApplicantController} from "../../../infrastructure/driving/http/api/v1/co.applicant.controller";
import {CoApplicantService} from "../../domain/services/co-applicant/co.applicant.service";
@Module({
    controllers: [CoApplicantController],
    providers: [CoApplicantService],
})
export class CoApplicantModule {}
