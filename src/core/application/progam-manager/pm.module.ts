import {Module} from "@nestjs/common";
import {ProgramManagerService} from "../../domain/services/program-manager/pm.service";
import {ProgramManagerController} from "../../../infrastructure/driving/http/api/v1/pm.controller";
@Module({
    controllers: [ProgramManagerController],
    providers: [ProgramManagerService],
})
export class ProgramManagerModule {}
