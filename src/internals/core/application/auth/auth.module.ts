import {Module} from "@nestjs/common";
import {AuthUseCase} from "./auth.use-case";
import {AuthController} from "../../../infrastructure/driving/http/api/v1/auth.controller";
@Module({
    controllers: [AuthController],
    providers: [AuthUseCase],
})
export class AuthModule {}
