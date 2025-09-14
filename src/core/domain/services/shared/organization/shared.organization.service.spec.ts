import {TestingModule, Test} from "@nestjs/testing";
import {SharedOrganizationService} from "./shared.organization.service";
import {
    OrganizationEntityPort,
    ORGANIZATION_ENTITY_PORT,
} from "../../../../../ports/outputs/repository/organization/organization.entity.port";
import ApiError from "../../../../../shared/errors/api.error";
import {SAVED_ORGANIZATION} from "./shared.organization.mock.data";
import {createMock} from "@golevelup/ts-jest";
import {OrganisationType} from "../../../constants/organization.constants";

describe("SharedOrganizationService", () => {
    let service: SharedOrganizationService;
    let organizationEntityRepository: OrganizationEntityPort;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                SharedOrganizationService,
                {
                    provide: ORGANIZATION_ENTITY_PORT,
                    useValue: createMock<OrganizationEntityPort>(),
                },
            ],
        }).compile();

        service = module.get<SharedOrganizationService>(
            SharedOrganizationService
        );
        organizationEntityRepository = module.get<OrganizationEntityPort>(
            ORGANIZATION_ENTITY_PORT
        );
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
        expect(organizationEntityRepository).toBeDefined();
    });

    describe("createOrganization", () => {
        it("should create and return a new organization", async () => {
            (
                organizationEntityRepository.findByName as jest.Mock
            ).mockResolvedValue(null);
            (organizationEntityRepository.save as jest.Mock).mockResolvedValue(
                SAVED_ORGANIZATION
            );

            const result = await service.createOrganization({
                name: "New Org",
                type: OrganisationType.IIIT,
            });
            expect(result).toEqual(SAVED_ORGANIZATION);
        });

        it("should throw an error if organization with the same name exists", async () => {
            try {
                (
                    organizationEntityRepository.findByName as jest.Mock
                ).mockResolvedValue(SAVED_ORGANIZATION);

                await service.createOrganization({
                    name: "Test Organization",
                    type: OrganisationType.IIIT,
                });
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect((error as ApiError).status).toBe(400);
                expect((error as ApiError).message).toBe(
                    "Organization with this name already exists"
                );
            }
        });
    });

    describe("getOrganizationById", () => {
        it("should return an organization by ID", async () => {
            (
                organizationEntityRepository.findById as jest.Mock
            ).mockResolvedValue(SAVED_ORGANIZATION);

            const result = await service.getOrganizationById("org-123");
            expect(result).toEqual(SAVED_ORGANIZATION);
        });

        it("should throw an error if organization not found", async () => {
            try {
                (
                    organizationEntityRepository.findById as jest.Mock
                ).mockResolvedValue(null);

                await service.getOrganizationById("non-existent-id");
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect((error as ApiError).status).toBe(404);
                expect((error as ApiError).message).toBe(
                    "Organization not found"
                );
            }
        });
    });

    describe("getOrganizationByName", () => {
        it("should return an organization by name", async () => {
            (
                organizationEntityRepository.findByName as jest.Mock
            ).mockResolvedValue(SAVED_ORGANIZATION);

            const result =
                await service.getOrganizationByName("Test Organization");
            expect(result).toEqual(SAVED_ORGANIZATION);
        });

        it("should throw an error if organization not found", async () => {
            try {
                (
                    organizationEntityRepository.findByName as jest.Mock
                ).mockResolvedValue(null);

                await service.getOrganizationByName("Non Existent Org");
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect((error as ApiError).status).toBe(400);
                expect((error as ApiError).message).toBe(
                    "Organization not found"
                );
            }
        });
    });

    describe("getAllOrganizations", () => {
        it("should return all organizations", async () => {
            const organizations = [SAVED_ORGANIZATION];
            (
                organizationEntityRepository.getAllOrganizations as jest.Mock
            ).mockResolvedValue(organizations);

            const result = await service.getAllOrganizations();
            expect(result).toEqual(organizations);
        });

        it("should handle errors during retrieval", async () => {
            try {
                (
                    organizationEntityRepository.getAllOrganizations as jest.Mock
                ).mockImplementation(() => {
                    throw new ApiError(
                        502,
                        "Failed to get all organizations",
                        "Database Error"
                    );
                });

                await service.getAllOrganizations();
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect((error as ApiError).status).toBe(502);
                expect((error as ApiError).message).toBe(
                    "Failed to get all organizations"
                );
            }
        });
    });

    describe("Delete Organization", () => {
        it("should delete an organization by ID", async () => {
            (
                organizationEntityRepository.deleteOrganization as jest.Mock
            ).mockResolvedValue(true);

            const result = await service.deleteOrganization("org-123");
            expect(result).toBe(true);
        });

        it("should throw an error if organization not found", async () => {
            try {
                (
                    organizationEntityRepository.deleteOrganization as jest.Mock
                ).mockResolvedValue(false);

                await service.deleteOrganization("non-existent-id");
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect((error as ApiError).status).toBe(404);
                expect((error as ApiError).message).toBe(
                    "Organization not found"
                );
            }
        });
    });
});
