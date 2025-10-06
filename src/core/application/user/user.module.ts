import {Module} from "@nestjs/common";
import {UserController} from "../../../infrastructure/driving/http/api/v1/user.controller";
import {UserService} from "../../domain/services/user/user.service";
@Module({
    controllers: [UserController],
    providers: [UserService],
})
export class UserModule {}
