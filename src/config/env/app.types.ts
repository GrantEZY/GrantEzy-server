import {TypeOrmModuleOptions as DatabaseOptions} from "@nestjs/typeorm";
import {AppConfigTypes} from "./app.config";
import {JwtInterface} from "./jwt.config";
import {CacheInterface} from "./cache.config";

export interface ConfigType {
    app: AppConfigTypes;
    database: DatabaseOptions;
    jwt: JwtInterface;
    cache: CacheInterface;
}
