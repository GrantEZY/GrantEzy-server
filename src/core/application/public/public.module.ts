import {Module} from "@nestjs/common";
import {PublicController} from "../../../infrastructure/driving/http/api/v1/public.controller";
import {PublicService} from "../../domain/services/public/public.service";
@Module({
    controllers: [PublicController],
    providers: [PublicService],
})
export class PublicModule {}
