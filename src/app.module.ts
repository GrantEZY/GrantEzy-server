import {Module} from "@nestjs/common";
import {AppController} from "./app.controller";
import {AppService} from "./app.service";
import {DatabaseConnection} from "./infrastructure/driven/database/connection";
import {CacheConnection} from "./infrastructure/driven/cache/connection";
import {ConfigConnection} from "./infrastructure/driven/env/connection";
import {AuthModule} from "./core/application/auth/auth.module";
import {OutputPortModule} from "./ports/outputs/output.port.module";
@Module({
    imports: [
        ConfigConnection,
        DatabaseConnection,
        CacheConnection,
        AuthModule,
        OutputPortModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
