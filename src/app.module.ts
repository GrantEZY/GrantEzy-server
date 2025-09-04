import {Module} from "@nestjs/common";
import {AppController} from "./app.controller";
import {AppService} from "./app.service";
import {DatabaseConnection} from "./internals/infrastructure/driven/database/connection";
import {CacheConnection} from "./internals/infrastructure/driven/cache/connection";
import {ConfigConnection} from "./internals/infrastructure/driven/env/connection";
@Module({
    imports: [ConfigConnection, DatabaseConnection, CacheConnection],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
    constructor() {
        console.log("AppModule initialized");
    }
}
