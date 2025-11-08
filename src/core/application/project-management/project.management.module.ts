import {Module} from "@nestjs/common";
import {ProjectManagementController} from "../../../infrastructure/driving/http/api/v1/project.management.controller";
import {ProjectManagementService} from "../../domain/services/project-management/project.management.service";

@Module({
    controllers: [ProjectManagementController],
    providers: [ProjectManagementService],
})
export class ProjectManagementModule {}
