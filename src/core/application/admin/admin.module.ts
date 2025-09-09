import {Module} from "@nestjs/common";
import {AdminController} from "../../../infrastructure/driving/http/api/v1/admin.controller";
import {AdminService} from "../../domain/services/admin.service";
@Module({
    providers: [AdminService],
    controllers: [AdminController],
})
export class AdminModule {}
