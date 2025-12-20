import {TestingModule, Test} from "@nestjs/testing";

import {
    CycleAggregatePort,
    CYCLE_AGGREGATE_PORT,
} from "../../../../ports/outputs/repository/cycle/cycle.aggregate.port";

import {ProgramManagerConfigManagementService} from "./pm.cfg.management.service";
import {createMock} from "@golevelup/ts-jest";
import {dummyCycle} from "./pm.service.mock.data";
import {CycleStatus} from "../../constants/status.constants";
import ApiError from "../../../../shared/errors/api.error";
describe("Program Manager Config Service", () => {
    let programManagerConfigService: ProgramManagerConfigManagementService;
    let cycleAggregaterepository: jest.Mocked<CycleAggregatePort>;

    beforeEach(async () => {
        const moduleReference: TestingModule = await Test.createTestingModule({
            providers: [
                ProgramManagerConfigManagementService,
                {
                    provide: CYCLE_AGGREGATE_PORT,
                    useValue: createMock<CycleAggregatePort>(),
                },
            ],
        }).compile();

        programManagerConfigService = moduleReference.get(
            ProgramManagerConfigManagementService
        );
        cycleAggregaterepository = moduleReference.get(
            CYCLE_AGGREGATE_PORT
        ) as jest.Mocked<CycleAggregatePort>;
    });

    it("to be Defined", async () => {
        expect(ProgramManagerConfigManagementService).toBeDefined();
    });

    describe("Modify Cycle Status", () => {
        it("Successful Modification of Cycle Status", async () => {
            cycleAggregaterepository.findById.mockResolvedValue(
                dummyCycle as any
            );

            cycleAggregaterepository.modifyCycleStatus.mockResolvedValue({
                ...dummyCycle,
                status: CycleStatus.OPEN,
            } as any);

            const result = await programManagerConfigService.modifyCycleStatus(
                {cycleId: "id"},
                CycleStatus.OPEN,
                "uuid"
            );

            expect(result).toEqual({
                status: 200,
                message: "Cycle status updated",
                res: {
                    id: dummyCycle.id,
                    status: CycleStatus.OPEN,
                },
            });
        });

        it("Cycle Not Found", async () => {
            try {
                cycleAggregaterepository.findById.mockResolvedValue(null);

                await programManagerConfigService.modifyCycleStatus(
                    {cycleId: "id"},
                    CycleStatus.OPEN,
                    "uuid"
                );
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect((error as ApiError).status).toBe(404);
                expect((error as ApiError).message).toBe("Cycle Not Found");
            }
        });

        it("Only Program Manager Accepted", async () => {
            try {
                cycleAggregaterepository.findById.mockResolvedValue(
                    dummyCycle as any
                );

                await programManagerConfigService.modifyCycleStatus(
                    {cycleId: "id"},
                    CycleStatus.OPEN,
                    "uuid1"
                );
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect((error as ApiError).status).toBe(403);
                expect((error as ApiError).message).toBe(
                    "Only Program Manager Can Modify the states"
                );
            }
        });
    });
});
