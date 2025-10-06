import {TestingModule, Test} from "@nestjs/testing";
import {
    GrantApplicationAggregatePort,
    GRANT_APPLICATION_AGGREGATE_PORT,
} from "../../../../../ports/outputs/repository/grantapplication/grantapplication.aggregate.port";
import {
    PasswordHasherPort,
    PASSWORD_HASHER_PORT,
} from "../../../../../ports/outputs/crypto/hash.port";
import {
    UserInviteAggregatePort,
    USER_INVITE_AGGREGATE_PORT,
} from "../../../../../ports/outputs/repository/user.invite/user.invite.aggregate.port";
import {createMock} from "@golevelup/ts-jest";
import {SharedApplicationService} from "./shared.application.service";
import {
    dummyUserInvite,
    saved_Application,
} from "./shared.application.mock.data";
import ApiError from "../../../../../shared/errors/api.error";

describe("Shared Application Service", () => {
    let applicationAggregateRepository: jest.Mocked<GrantApplicationAggregatePort>;
    let hasherRepository: jest.Mocked<PasswordHasherPort>;
    let userInviteRepository: jest.Mocked<UserInviteAggregatePort>;
    let sharedApplicationService: jest.Mocked<SharedApplicationService>;

    beforeEach(async () => {
        const moduleReference: TestingModule = await Test.createTestingModule({
            providers: [
                SharedApplicationService,
                {
                    provide: GRANT_APPLICATION_AGGREGATE_PORT,
                    useValue: createMock<GrantApplicationAggregatePort>(),
                },
                {
                    provide: PASSWORD_HASHER_PORT,
                    useValue: createMock<PasswordHasherPort>(),
                },
                {
                    provide: USER_INVITE_AGGREGATE_PORT,
                    useValue: createMock<UserInviteAggregatePort>(),
                },
            ],
        }).compile();

        sharedApplicationService = moduleReference.get(
            SharedApplicationService
        );
        applicationAggregateRepository = moduleReference.get(
            GRANT_APPLICATION_AGGREGATE_PORT
        ) as jest.Mocked<GrantApplicationAggregatePort>;
        hasherRepository = moduleReference.get(
            PASSWORD_HASHER_PORT
        ) as jest.Mocked<PasswordHasherPort>;
        userInviteRepository = moduleReference.get(
            USER_INVITE_AGGREGATE_PORT
        ) as jest.Mocked<UserInviteAggregatePort>;
    });

    it("should be defined", () => {
        expect(sharedApplicationService).toBeDefined();
    });

    describe("get Token Details", () => {
        it("Successful Token fetch", async () => {
            hasherRepository.hash.mockResolvedValue("hash");

            userInviteRepository.getUserInvite.mockResolvedValue(
                dummyUserInvite as any
            );

            applicationAggregateRepository.findById.mockResolvedValue(
                saved_Application as any
            );

            const result =
                await sharedApplicationService.getTokenDetails("token");

            expect(result).toEqual({
                application: saved_Application,
                invite: dummyUserInvite,
            });
        });

        it("Invite Not Found", async () => {
            try {
                hasherRepository.hash.mockResolvedValue("hash");
                userInviteRepository.getUserInvite.mockResolvedValue(null);
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect((error as ApiError).status).toBe(404);
                expect((error as ApiError).message).toBe("Token Not Valid");
            }
        });

        it("Invite Not Valid", async () => {
            try {
                const invite = JSON.parse(JSON.stringify(dummyUserInvite));
                invite.status = "ACCEPTED";
                hasherRepository.hash.mockResolvedValue("hash");
                userInviteRepository.getUserInvite.mockResolvedValue(invite);
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect((error as ApiError).status).toBe(403);
                expect((error as ApiError).message).toBe("Invite Not Valid");
            }
        });

        it("Invite Got Expired", async () => {
            try {
                const invite = JSON.parse(JSON.stringify(dummyUserInvite));
                invite.verification.validTill = new Date(Date.now() - 1);
                hasherRepository.hash.mockResolvedValue("hash");
                userInviteRepository.getUserInvite.mockResolvedValue(invite);
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect((error as ApiError).status).toBe(400);
                expect((error as ApiError).message).toBe("Invite got expired");
            }
        });

        it("Application Not Found", async () => {
            try {
                hasherRepository.hash.mockResolvedValue("hash");

                userInviteRepository.getUserInvite.mockResolvedValue(
                    dummyUserInvite as any
                );

                applicationAggregateRepository.findById.mockResolvedValue(null);

                await sharedApplicationService.getTokenDetails("token");
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect((error as ApiError).status).toBe(404);
                expect((error as ApiError).message).toBe(
                    "Application Not Found"
                );
            }
        });
    });
});
