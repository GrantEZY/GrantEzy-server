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
import {EMAIL_SERVICE_PORT} from "./email/email.service.port";
import {EmailService} from "../../infrastructure/driven/email/email.service";
import {OrganizationEntityRepository} from "../../infrastructure/driven/database/repositories/organization.entity.repository";
import {ORGANIZATION_ENTITY_PORT} from "./repository/organization/organization.entity.port";
import {Organization} from "../../core/domain/entities/organization.entity";
import {Cycle} from "../../core/domain/aggregates/cycle.aggregate";
import {CYCLE_AGGREGATE_PORT} from "./repository/cycle/cycle.aggregate.port";
import {CycleAggregateRepository} from "../../infrastructure/driven/database/repositories/cycle.aggregate.repository";
import {GrantApplication} from "../../core/domain/aggregates/grantapplication.aggregate";
import {GrantApplicationRepository} from "../../infrastructure/driven/database/repositories/grantapplication.aggregate.repository";
import {GRANT_APPLICATION_AGGREGATE_PORT} from "./repository/grantapplication/grantapplication.aggregate.port";
import {UserInvite} from "../../core/domain/aggregates/user.invite.aggregate";
import {USER_INVITE_AGGREGATE_PORT} from "./repository/user.invite/user.invite.aggregate.port";
import {UserInviteAggregateRepository} from "../../infrastructure/driven/database/repositories/user.invite.aggregate.repository";
import {Notification} from "../../core/domain/entities/notification.entity";
import {UserNotifications} from "../../core/domain/aggregates/usernotifications.aggregate";
import {VerificationTokenEntity} from "../../core/domain/entities/verification.entity";
import {Review} from "../../core/domain/aggregates/review.aggregate";
import {REVIEW_AGGREGATE_PORT} from "./repository/review/review.aggregate.port";
import {ReviewAggregateRepository} from "../../infrastructure/driven/database/repositories/review.aggregate.repository";
import {FORGOT_PASSWORD_PORT} from "./repository/forgotpassword/forgotpassword.aggregate.port";
import {ForgotPasswordAggregate} from "../../core/domain/aggregates/forgotpassword.aggregate";
import {ForgotPasswordAggregateRepository} from "../../infrastructure/driven/database/repositories/forgotpassword.aggregate.repository";
import {Project} from "../../core/domain/aggregates/project.aggregate";
import {PROJECT_AGGREGATE_PORT} from "./repository/project/project.aggregate.port";
import {ProjectAggregateRepository} from "../../infrastructure/driven/database/repositories/project.aggregate.repository";
import {CycleAssessmentAggregate} from "../../core/domain/aggregates/cycle.assessment.aggregate";
import {CycleAssessmentCriteriaAggregate} from "../../core/domain/aggregates/cycle.assessment.criteria.aggregate";
import {CycleAssessmentCriteriaAggregateRepository} from "../../infrastructure/driven/database/repositories/cycle.assessment.criteria.aggregate.repository";
import {CYCLE_ASSESSMENT_CRITERIA_AGGREGATE_PORT} from "./repository/cycleAssessmentCriteria/cycle.assessment.criteria.aggregate.port";
@Global()
@Module({
    imports: [
        ConfigModule,
        TypeOrmModule.forFeature([
            User,
            Person,
            Program,
            Organization,
            Cycle,
            GrantApplication,
            UserInvite,
            Notification,
            UserNotifications,
            VerificationTokenEntity,
            Review,
            ForgotPasswordAggregate,
            Project,
            CycleAssessmentAggregate,
            CycleAssessmentCriteriaAggregate,
        ]),
        JwtModule.register({}),
    ],
    providers: [
        {provide: USER_AGGREGATE_PORT, useClass: UserAggregateRepository},
        {provide: PASSWORD_HASHER_PORT, useClass: BcryptPasswordHasher},
        {provide: JWT_PORT, useClass: JwtRepository},
        {provide: CACHE_REPOSITORY_PORT, useClass: CacheRepository},
        {provide: PROGRAM_AGGREGATE_PORT, useClass: ProgramAggregateRepository},
        {provide: EMAIL_SERVICE_PORT, useClass: EmailService},
        {
            provide: ORGANIZATION_ENTITY_PORT,
            useClass: OrganizationEntityRepository,
        },
        {
            provide: REVIEW_AGGREGATE_PORT,
            useClass: ReviewAggregateRepository,
        },
        {
            provide: CYCLE_AGGREGATE_PORT,
            useClass: CycleAggregateRepository,
        },
        {
            provide: GRANT_APPLICATION_AGGREGATE_PORT,
            useClass: GrantApplicationRepository,
        },
        {
            provide: USER_INVITE_AGGREGATE_PORT,
            useClass: UserInviteAggregateRepository,
        },
        {
            provide: FORGOT_PASSWORD_PORT,
            useClass: ForgotPasswordAggregateRepository,
        },
        {
            provide: PROJECT_AGGREGATE_PORT,
            useClass: ProjectAggregateRepository,
        },
        {
            provide: CYCLE_ASSESSMENT_CRITERIA_AGGREGATE_PORT,
            useClass: CycleAssessmentCriteriaAggregateRepository,
        },
    ],
    exports: [
        USER_AGGREGATE_PORT,
        PASSWORD_HASHER_PORT,
        JWT_PORT,
        JwtModule,
        CYCLE_AGGREGATE_PORT,
        EMAIL_SERVICE_PORT,
        CACHE_REPOSITORY_PORT,
        USER_INVITE_AGGREGATE_PORT,
        PROGRAM_AGGREGATE_PORT,
        ORGANIZATION_ENTITY_PORT,
        GRANT_APPLICATION_AGGREGATE_PORT,
        REVIEW_AGGREGATE_PORT,
        FORGOT_PASSWORD_PORT,
        PROJECT_AGGREGATE_PORT,
    ],
})
export class OutputPortModule {}
