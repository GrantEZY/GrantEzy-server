import {Module} from "@nestjs/common";
import {ProgramManagerService} from "../../domain/services/program-manager/pm.service";
import {ProgramManagerConfigManagementService} from "../../domain/services/program-manager/pm.cfg.management.service";
import {ProgramManagerController} from "../../../infrastructure/driving/http/api/v1/pm.controller";
@Module({
    controllers: [ProgramManagerController],
    providers: [ProgramManagerService, ProgramManagerConfigManagementService],
})
export class ProgramManagerModule {}
