import {Module} from "@nestjs/common";
import {AuthController} from "../../../infrastructure/driving/http/api/v1/auth.controller";
import {AuthUseCase} from "./auth.use-case";
@Module({
    controllers: [AuthController],
    providers: [AuthUseCase],
})
export class AuthModule {}
