import {TestingModule, Test} from "@nestjs/testing";
import {ApplicantService} from "./applicant.service";
import {
    GrantApplicationAggregatePort,
    GRANT_APPLICATION_AGGREGATE_PORT,
} from "../../../../ports/outputs/repository/grantapplication/grantapplication.aggregate.port";
import {
    CycleAggregatePort,
    CYCLE_AGGREGATE_PORT,
} from "../../../../ports/outputs/repository/cycle/cycle.aggregate.port";
import {createMock} from "@golevelup/ts-jest";
import {
    applicationsArray,
    cycleData,
    dummyApplicantData,
    saved_Application,
} from "./applicant.service.mock.data";
import ApiError from "../../../../shared/errors/api.error";
describe("Applicant ", () => {
    let applicationService: ApplicantService;
    let applicationAggregateRepository: jest.Mocked<GrantApplicationAggregatePort>;
    let cycleAggregateRepository: jest.Mocked<CycleAggregatePort>;
    beforeEach(async () => {
        const moduleReference: TestingModule = await Test.createTestingModule({
            providers: [
                ApplicantService,
                {
                    provide: GRANT_APPLICATION_AGGREGATE_PORT,
                    useValue: createMock<GrantApplicationAggregatePort>(),
                },
                {
                    provide: CYCLE_AGGREGATE_PORT,
                    useValue: createMock<CycleAggregatePort>(),
                },
            ],
        }).compile();

        applicationService = moduleReference.get(ApplicantService);
        applicationAggregateRepository = moduleReference.get(
            GRANT_APPLICATION_AGGREGATE_PORT
        ) as jest.Mocked<GrantApplicationAggregatePort>;
        cycleAggregateRepository = moduleReference.get(
            CYCLE_AGGREGATE_PORT
        ) as jest.Mocked<CycleAggregatePort>;
    });

    it("to be Defined", () => {
        expect(applicationService).toBeDefined();
    });

    describe("Create Application", () => {
        it("Successful creation of application", async () => {
            cycleAggregateRepository.findCycleByslug.mockResolvedValue(
                cycleData as any
            );

            applicationAggregateRepository.findUserCycleApplication.mockResolvedValue(
                null
            );

            applicationAggregateRepository.save.mockResolvedValue(
                saved_Application as any
            );

            const result = await applicationService.createApplication(
                "userid",
                dummyApplicantData
            );

            expect(result).toEqual({
                status: 201,
                message: "Application Registered Successfully",
                res: {
                    application: saved_Application,
                },
            });
        });

        it("Cycle Not Found", async () => {
            try {
                cycleAggregateRepository.findCycleByslug.mockResolvedValue(
                    null
                );

                await applicationService.createApplication(
                    "userid",
                    dummyApplicantData
                );
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect((error as ApiError).status).toBe(400);
                expect((error as ApiError).message).toBe(
                    "Program Cycle Not Found"
                );
            }
        });

        it("User Already  already has a application", async () => {
            try {
                cycleAggregateRepository.findCycleByslug.mockResolvedValue(
                    cycleData as any
                );

                applicationAggregateRepository.findUserCycleApplication.mockResolvedValue(
                    saved_Application as any
                );

                await applicationService.createApplication(
                    "userid",
                    dummyApplicantData
                );
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect((error as ApiError).status).toBe(409);
                expect((error as ApiError).message).toBe(
                    "User Already have a application registered"
                );
            }
        });
    });

    describe("Get User Applications", () => {
        it("Get User Applications", async () => {
            applicationAggregateRepository.getUserApplications.mockResolvedValueOnce(
                applicationsArray as any
            );

            const result =
                await applicationService.getUserApplications("user-id");

            expect(result).toEqual({
                status: 200,
                message: "User Applications",
                res: {
                    applications: applicationsArray,
                },
            });
        });
    });
});
