import {Module} from "@nestjs/common";
import {GCVService} from "../../domain/services/gcv/gcv.service";
import {GCVController} from "../../../infrastructure/driving/http/api/v1/gcv.controller";
@Module({
    providers: [GCVService],
    controllers: [GCVController],
})
export class GCVModule {}
