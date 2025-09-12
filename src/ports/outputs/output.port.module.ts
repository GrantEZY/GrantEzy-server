import {Module, Global} from "@nestjs/common";

import {UserAggregateRepository} from "../../infrastructure/driven/database/repositories/user.aggregate.repository";
import {USER_AGGREGATE_PORT} from "./repository/user/user.aggregate.port";
import {PASSWORD_HASHER_PORT} from "./crypto/hash.port";
import {BcryptPasswordHasher} from "../../infrastructure/driven/crypto/hash.repository";
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "../../core/domain/aggregates/user.aggregate";
import {Person} from "../../core/domain/entities/person.entity";
import {JWT_PORT} from "./crypto/jwt.port";
import {JwtRepository} from "../../infrastructure/driven/crypto/jwt.repository";
import {JwtModule} from "@nestjs/jwt";
import {CACHE_REPOSITORY_PORT} from "./cache/cache.repository.port";
import {CacheRepository} from "../../infrastructure/driven/cache/cache.repository";
import {ConfigModule} from "@nestjs/config";
import {PROGRAM_AGGREGATE_PORT} from "./repository/program/program.aggregate.port";
import {ProgramAggregateRepository} from "../../infrastructure/driven/database/repositories/program.aggregate.repository";
import {Program} from "../../core/domain/aggregates/program.aggregate";
@Global()
@Module({
    imports: [
        TypeOrmModule.forFeature([User, Person, Program]),
        JwtModule.register({}),
        ConfigModule,
    ],
    providers: [
        {provide: USER_AGGREGATE_PORT, useClass: UserAggregateRepository},
        {provide: PASSWORD_HASHER_PORT, useClass: BcryptPasswordHasher},
        {provide: JWT_PORT, useClass: JwtRepository},
        {provide: CACHE_REPOSITORY_PORT, useClass: CacheRepository},
        {provide: PROGRAM_AGGREGATE_PORT, useClass: ProgramAggregateRepository},
    ],
    exports: [USER_AGGREGATE_PORT, PASSWORD_HASHER_PORT, JWT_PORT, JwtModule],
})
export class OutputPortModule {}
