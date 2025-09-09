import {Controller, Get} from "@nestjs/common";
import {AppService} from "../../../../../core/domain/services/app.service";

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get("/health")
    getHello(): string {
        return this.appService.getHello();
    }
}
