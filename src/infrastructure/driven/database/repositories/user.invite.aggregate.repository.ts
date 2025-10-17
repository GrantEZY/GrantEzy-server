import {UserInviteAggregatePort} from "../../../../ports/outputs/repository/user.invite/user.invite.aggregate.port";
import {Inject, Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import ApiError from "../../../../shared/errors/api.error";
import {UserInvite} from "../../../../core/domain/aggregates/user.invite.aggregate";
import {
    InviteAs,
    InviteStatus,
} from "../../../../core/domain/constants/invite.constants";
import {VerificationTokenEntity} from "../../../../core/domain/entities/verification.entity";
import {
    PasswordHasherPort,
    PASSWORD_HASHER_PORT,
} from "../../../../ports/outputs/crypto/hash.port";
import {v4 as uuid} from "uuid";
import {slugify} from "../../../../shared/helpers/slug.generator";
@Injectable()
/**
 * This file contains the repo  structure for user invite aggregate
 */
export class UserInviteAggregateRepository implements UserInviteAggregatePort {
    constructor(
        @InjectRepository(UserInvite)
        private readonly userInviteRepository: Repository<UserInvite>,
        @InjectRepository(VerificationTokenEntity)
        private readonly verificationRepository: Repository<VerificationTokenEntity>,
        @Inject(PASSWORD_HASHER_PORT)
        private readonly cryptoRepository: PasswordHasherPort
    ) {}

    /**
     *
     * @param applicationId applicationId of the application for which invite has been made
     * @param emails invitedTeamMatesEmail
     */
    async addApplicationInvites(
        applicationId: string,
        emails: string[],
        as: InviteAs
    ): Promise<Record<string, string[]>> {
        try {
            const details: Record<string, string[]> = {};

            await Promise.all(
                emails.map(async (email) => {
                    const {token, hash} =
                        await this.cryptoRepository.generateToken();
                    const validTill = new Date(
                        Date.now() + 24 * 60 * 60 * 1000 * 7
                    );
                    const id = uuid(); // eslint-disable-line
                    const slug = slugify(id);
                    const verification = this.verificationRepository.create({
                        token: hash,
                        validTill,
                    });
                    const savedVerification =
                        await this.verificationRepository.save(verification);
                    const invite = this.userInviteRepository.create({
                        applicationId,
                        email,
                        inviteAs: as,
                        status: InviteStatus.SENT,
                        slug,
                        verificationId: savedVerification.id,
                    });
                    await this.userInviteRepository.save(invite);
                    details[email] = [token, slug];
                })
            );
            return details;
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(502, "Failed to invite users", "Database Error");
        }
    }

    async getUserInvite(
        slug: string,
        isHashRequired: boolean
    ): Promise<UserInvite | null> {
        try {
            let invite: UserInvite | null;
            if (isHashRequired) {
                invite = await this.userInviteRepository
                    .createQueryBuilder("invite")
                    .leftJoinAndSelect("invite.verification", "verification")
                    .addSelect("verification.token")
                    .where("invite.slug = :slug", {slug})
                    .getOne();
            } else {
                invite = await this.userInviteRepository.findOne({
                    where: {
                        slug,
                    },
                });
            }

            return invite;
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(
                502,
                "Failed to fetch invite users",
                "Database Error"
            );
        }
    }

    async getUserInviteForApplication(
        email: string,
        applicationId: string,
        as: InviteAs
    ): Promise<UserInvite | null> {
        try {
            const invite = await this.userInviteRepository.findOne({
                where: {
                    email,
                    applicationId,
                    inviteAs: as,
                },
            });

            return invite;
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(
                502,
                "Failed to fetch invited user for application",
                "Database Error"
            );
        }
    }

    async updateUserInviteStatus(
        invite: UserInvite,
        status: InviteStatus
    ): Promise<boolean> {
        try {
            invite.status = status;

            invite.verification.validatedAt = new Date();

            await this.userInviteRepository.save(invite);

            return true;
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(
                502,
                "Failed to update invite user status",
                "Database Error"
            );
        }
    }
}
