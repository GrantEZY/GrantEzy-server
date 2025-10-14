import {Module} from "@nestjs/common";
import {ReviewerController} from "../../../infrastructure/driving/http/api/v1/reviewer.controller";
import {ReviewerService} from "../../domain/services/reviewer/reviewer.service";
@Module({
    controllers: [ReviewerController],
    providers: [ReviewerService],
})
export class ReviewerModule {}
