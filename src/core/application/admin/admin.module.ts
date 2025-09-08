import {Module} from "@nestjs/common";
import {AdminController} from "../../../infrastructure/driving/http/api/v1/admin.controller";
@Module({
    imports: [],
    providers: [],
    controllers: [AdminController],
})
export class AdminModule {}
