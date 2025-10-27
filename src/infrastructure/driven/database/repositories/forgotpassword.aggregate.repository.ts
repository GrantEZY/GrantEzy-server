import {Injectable, Inject} from "@nestjs/common";
import {ForgotPasswordAggregatePort} from "../../../../ports/outputs/repository/forgotpassword/forgotpassword.aggregate.port";
import {ForgotPasswordAggregate} from "../../../../core/domain/aggregates/forgotpassword.aggregate";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {VerificationTokenEntity} from "../../../../core/domain/entities/verification.entity";
import ApiError from "../../../../shared/errors/api.error";
import {
    PasswordHasherPort,
    PASSWORD_HASHER_PORT,
} from "../../../../ports/outputs/crypto/hash.port";
@Injectable()
export class ForgotPasswordAggregateRepository
    implements ForgotPasswordAggregatePort
{
    constructor(
        @InjectRepository(ForgotPasswordAggregate)
        private readonly forgotPasswordRepository: Repository<ForgotPasswordAggregate>,

        @InjectRepository(VerificationTokenEntity)
        private readonly verificationTokenRepository: Repository<VerificationTokenEntity>,
        @Inject(PASSWORD_HASHER_PORT)
        private readonly cryptoRepository: PasswordHasherPort
    ) {}

    async getEntityByEmail(
        email: string
    ): Promise<ForgotPasswordAggregate | null> {
        try {
            const entity = await this.forgotPasswordRepository.findOne({
                where: {
                    email,
                },
            });

            return entity;
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(
                502,
                "Error in fetching invite",
                "database error"
            );
        }
    }

    async createForgotPasswordForEmail(email: string): Promise<string> {
        try {
            const {token, hash} = await this.cryptoRepository.generateToken();
            const validTill = new Date(Date.now() + 60 * 60 * 1000);

            const verification = this.verificationTokenRepository.create({
                token: hash,
                validTill,
            });

            const savedVerification =
                await this.verificationTokenRepository.save(verification);

            const entity = this.forgotPasswordRepository.create({
                email,
                verification: savedVerification,
            });

            await this.forgotPasswordRepository.save(entity);

            return token;
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(
                502,
                "Error in creating entity",
                "database error"
            );
        }
    }

    async deleteAEntity(email: string): Promise<boolean> {
        try {
            await this.forgotPasswordRepository.delete({
                email,
            });

            return true;
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }

            throw new ApiError(
                502,
                "Error in deleting entity",
                "database error"
            );
        }
    }
}
