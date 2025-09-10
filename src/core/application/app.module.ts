import {Module} from "@nestjs/common";
import {AppController} from "../../infrastructure/driving/http/api/v1/app.controller";
import {AppService} from "../domain/services/app/app.service";
import {DatabaseConnection} from "../../infrastructure/driven/database/connection";
import {CacheConnection} from "../../infrastructure/driven/cache/connection";
import {ConfigConnection} from "../../infrastructure/driven/env/connection";
import {AuthModule} from "./auth/auth.module";
import {OutputPortModule} from "../../ports/outputs/output.port.module";
import {AdminModule} from "./admin/admin.module";
import {SharedModule} from "./shared/shared.module";
@Module({
    imports: [
        ConfigConnection,
        DatabaseConnection,
        CacheConnection,
        AuthModule,
        OutputPortModule,
        AdminModule,
        SharedModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
