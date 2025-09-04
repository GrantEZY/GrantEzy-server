import {TypeOrmModuleOptions} from "@nestjs/typeorm";
import {AppConfigTypes} from "./app.config";
import {JwtInterface} from "./jwt.config";
import {RedisInterface} from "./cache.config";

export interface ConfigType {
    app: AppConfigTypes;
    typeorm: TypeOrmModuleOptions;
    jwt: JwtInterface;
    redis: RedisInterface;
}
