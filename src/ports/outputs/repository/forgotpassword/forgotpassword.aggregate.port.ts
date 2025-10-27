import {ForgotPasswordAggregate} from "../../../../core/domain/aggregates/forgotpassword.aggregate";

export interface ForgotPasswordAggregatePort {
    getEntityByEmail(email: string): Promise<ForgotPasswordAggregate | null>;

    createForgotPasswordForEmail(email: string): Promise<string>;

    deleteAEntity(email: string): Promise<boolean>;
}
