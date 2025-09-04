import {ConfigModule} from "@nestjs/config";
import {
    AppConfig,
    JwtConfig,
    CacheConfig,
    DatabaseConfig,
} from "../../../config/env";
import {environmentValidationSchema} from "../../../utils/environment.validation";

export const ConfigConnection = ConfigModule.forRoot({
    isGlobal: true,
    load: [AppConfig, JwtConfig, CacheConfig, DatabaseConfig],
    validationSchema: environmentValidationSchema,
});
