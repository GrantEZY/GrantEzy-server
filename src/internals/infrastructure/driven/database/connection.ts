/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import {TypeOrmModule} from "@nestjs/typeorm";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {ConfigType} from "../../../config/env/app.types";

export const DatabaseConnection = TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService<ConfigType>) => {
        const typeormConfig = configService.get("database");
        return {
            isGlobal: true,
            type: typeormConfig?.type,
            host: typeormConfig.host,
            port: typeormConfig.port,
            username: typeormConfig.username,
            password: String(typeormConfig.password),
            database: typeormConfig.database,
            autoLoadEntities: true,
            entities: [
                "dist/**/*.entity{.ts,.js}",
                "dist/**/*.aggregate{.ts,.js}",
            ],
            synchronize: typeormConfig.synchronize,
            logging: false,
        };
    },
});
