import {Test} from "@nestjs/testing";
import {ExecutionContext} from "@nestjs/common";
import {RoleGuard} from "./role.guard";
import {UserRoles} from "../../../core/domain/constants/userRoles.constants";
import {Reflector} from "@nestjs/core";
import {createMock} from "@golevelup/ts-jest";
import ApiError from "../../errors/api.error";

describe("Role Guard", () => {
    let roleGuard: RoleGuard;
    let reflector: jest.Mocked<Reflector>;
    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [
                RoleGuard,
                {provide: Reflector, useValue: createMock<Reflector>()},
            ],
        }).compile();

        roleGuard = moduleRef.get<RoleGuard>(RoleGuard);
        reflector = moduleRef.get<Reflector>(
            Reflector
        ) as jest.Mocked<Reflector>;
    });

    it("to be Defined", async () => {
        expect(roleGuard).toBeDefined();
    });

    it("Allow a Particular Role", async () => {
        const executionContext = {
            switchToHttp: () => ({
                getRequest: () => ({
                    user: {
                        userData: {
                            payload: {
                                role: UserRoles.ADMIN,
                            },
                        },
                    },
                }),
            }),
            getHandler: () => {},
            getClass: () => {},
        } as any as ExecutionContext;

        reflector.getAllAndOverride.mockReturnValue(false);

        reflector.getAllAndOverride.mockReturnValue(false);

        reflector.getAllAndOverride.mockReturnValue([UserRoles.ADMIN]);

        expect(roleGuard.canActivate(executionContext)).toBe(true);
    });

    it("Block a Not Allowed Roles", async () => {
        try {
            const executionContext = {
                switchToHttp: () => ({
                    getRequest: () => ({
                        user: {
                            userData: {
                                payload: {
                                    role: UserRoles.APPLICANT,
                                },
                            },
                        },
                    }),
                }),
                getHandler: () => {},
                getClass: () => {},
            } as any as ExecutionContext;

            reflector.getAllAndOverride.mockReturnValue(false);

            reflector.getAllAndOverride.mockReturnValue(false);

            reflector.getAllAndOverride.mockReturnValue([UserRoles.ADMIN]);
            roleGuard.canActivate(executionContext);
        } catch (error) {
            expect(error).toBeInstanceOf(ApiError);
            expect((error as ApiError).status).toBe(403);
            expect((error as ApiError).message).toBe(
                "User Not Allowed To perform the action"
            );
        }
    });

    it("Allow Public Routes", async () => {
        const executionContext = {
            switchToHttp: () => ({
                getRequest: () => ({
                    user: {
                        userData: {
                            payload: {
                                role: UserRoles.APPLICANT,
                            },
                        },
                    },
                }),
            }),
            getHandler: () => {},
            getClass: () => {},
        } as any as ExecutionContext;

        reflector.getAllAndOverride.mockReturnValue(true);

        reflector.getAllAndOverride.mockReturnValue(false);

        expect(roleGuard.canActivate(executionContext)).toBe(true);
    });

    it("Allow if Required Roles are not given", async () => {
        const executionContext = {
            switchToHttp: () => ({
                getRequest: () => ({
                    user: {
                        userData: {
                            payload: {
                                role: UserRoles.ADMIN,
                            },
                        },
                    },
                }),
            }),
            getHandler: () => {},
            getClass: () => {},
        } as any as ExecutionContext;

        reflector.getAllAndOverride.mockReturnValue(false);

        reflector.getAllAndOverride.mockReturnValue(false);

        reflector.getAllAndOverride.mockReturnValue([]);

        expect(roleGuard.canActivate(executionContext)).toBe(true);
    });
});
