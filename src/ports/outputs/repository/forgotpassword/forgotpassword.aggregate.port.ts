import {ForgotPasswordAggregate} from "../../../../core/domain/aggregates/forgotpassword.aggregate";
import {VerificationTokenEntity} from "../../../../core/domain/entities/verification.entity";

export interface ForgotPasswordAggregatePort {
    getEntityByEmail(
        email: string,
        isHashRequired: boolean
    ): Promise<ForgotPasswordAggregate | null>;

    getEntityBySlug(
        slug: string,
        isHashRequired: boolean
    ): Promise<ForgotPasswordAggregate | null>;

    updateToken(
        verification: VerificationTokenEntity
    ): Promise<{token: string; verification: VerificationTokenEntity}>;

    createForgotPasswordForEmail(
        email: string
    ): Promise<{token: string; slug: string}>;

    deleteAEntity(slug: string): Promise<boolean>;
}

export const FORGOT_PASSWORD_PORT = Symbol("ForgotPasswordAggregatePort");
