import {Injectable, Inject} from "@nestjs/common";
import {ForgotPasswordAggregatePort} from "../../../../ports/outputs/repository/forgotpassword/forgotpassword.aggregate.port";
import {ForgotPasswordAggregate} from "../../../../core/domain/aggregates/forgotpassword.aggregate";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {VerificationTokenEntity} from "../../../../core/domain/entities/verification.entity";
import ApiError from "../../../../shared/errors/api.error";
import {v4 as uuid} from "uuid";
import {slugify} from "../../../../shared/helpers/slug.generator";
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
        email: string,
        isHashRequired: boolean
    ): Promise<ForgotPasswordAggregate | null> {
        try {
            let entity: ForgotPasswordAggregate | null;
            if (isHashRequired) {
                entity = await this.forgotPasswordRepository
                    .createQueryBuilder("forgotPass")
                    .leftJoinAndSelect(
                        "forgotPass.verification",
                        "verification"
                    )
                    .addSelect("verification.token")
                    .where("forgotPass.email = :email", {email})
                    .getOne();
            } else {
                entity = await this.forgotPasswordRepository.findOne({
                    where: {
                        email,
                    },
                });
            }

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

    async updateToken(
        verification: VerificationTokenEntity
    ): Promise<{token: string; verification: VerificationTokenEntity}> {
        try {
            const {token, hash} = await this.cryptoRepository.generateToken();
            verification.token = hash;
            verification.validTill = new Date(Date.now() + 60 * 60 * 1000);

            const updatedVerification =
                await this.verificationTokenRepository.save(verification);

            return {token, verification: updatedVerification};
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(
                502,
                "Error in updating invite",
                "database error"
            );
        }
    }

    async getEntityBySlug(
        slug: string,
        isHashRequired: boolean
    ): Promise<ForgotPasswordAggregate | null> {
        try {
            let entity: ForgotPasswordAggregate | null;
            if (isHashRequired) {
                entity = await this.forgotPasswordRepository
                    .createQueryBuilder("forgotPass")
                    .leftJoinAndSelect(
                        "forgotPass.verification",
                        "verification"
                    )
                    .addSelect("verification.token")
                    .where("forgotPass.slug = :slug", {slug})
                    .getOne();
            } else {
                entity = await this.forgotPasswordRepository.findOne({
                    where: {
                        slug,
                    },
                });
            }

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

    async createForgotPasswordForEmail(
        email: string
    ): Promise<{token: string; slug: string}> {
        try {
            const {token, hash} = await this.cryptoRepository.generateToken();
            const validTill = new Date(Date.now() + 60 * 60 * 1000);

            const verification = this.verificationTokenRepository.create({
                token: hash,
                validTill,
            });

            const savedVerification =
                await this.verificationTokenRepository.save(verification);

            const id = uuid(); // eslint-disable-line
            const slug = slugify(id);

            const entity = this.forgotPasswordRepository.create({
                email,
                verification: savedVerification,
                slug,
            });

            await this.forgotPasswordRepository.save(entity);

            return {token, slug};
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

    async deleteAEntity(slug: string): Promise<boolean> {
        try {
            await this.forgotPasswordRepository.delete({
                slug,
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
