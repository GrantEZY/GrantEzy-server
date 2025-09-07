import {Module, Global} from "@nestjs/common";

import {UserAggregateRepository} from "../../../infrastructure/driven/database/repositories/user.aggregate.repository";
import {USER_AGGREGATE_PORT} from "./repository/user/user.aggregate.port";
import {PASSWORD_HASHER_PORT} from "./crypto/hash.port";
import {BcryptPasswordHasher} from "../../../infrastructure/driven/crypto/hash.repository";
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "../../domain/aggregates/user.aggregate";
import {Person} from "../../domain/entities/person.entity";
@Global()
@Module({
    imports: [TypeOrmModule.forFeature([User, Person])],
    providers: [
        {provide: USER_AGGREGATE_PORT, useClass: UserAggregateRepository},
        {provide: PASSWORD_HASHER_PORT, useClass: BcryptPasswordHasher},
    ],
    exports: [USER_AGGREGATE_PORT, PASSWORD_HASHER_PORT],
})
export class OutputPortModule {}
