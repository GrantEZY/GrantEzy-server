import {Module} from "@nestjs/common";
import {AppController} from "./app.controller";
import {AppService} from "./app.service";
import {DatabaseConnection} from "./internals/infrastructure/driven/database/connection";
import {CacheConnection} from "./internals/infrastructure/driven/cache/connection";
import {ConfigConnection} from "./internals/infrastructure/driven/env/connection";
import {AuthModule} from "./internals/core/application/auth/auth.module";
import {OutputPortModule} from "./internals/core/ports/outputs/output.port.module";
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
