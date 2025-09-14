import {ProgramAggregatePort} from "../../../../ports/outputs/repository/program/program.aggregate.port";
import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository, FindOptionsWhere} from "typeorm";
import {Program} from "../../../../core/domain/aggregates/program.aggregate";
import ApiError from "../../../../shared/errors/api.error";
import {
    CreateProgramDTO,
    UpdateProgramDTO,
} from "../../../driving/dtos/gcv.dto";
import {ProgramDetails} from "../../../../core/domain/value-objects/program.details.object";
import {Duration} from "../../../../core/domain/value-objects/duration.object";
import {Money} from "../../../../core/domain/value-objects/project.metrics.object";

@Injectable()
/**
 * Repository class for managing Program aggregate operations.
 * Implements the ProgramAggregatePort interface.
 */
export class ProgramAggregateRepository implements ProgramAggregatePort {
    constructor(
        @InjectRepository(Program)
        private readonly programRepository: Repository<Program>
    ) {}
    /**
     * Saves a program entity to the database.
     * @param program - The program entity to be saved or updated.
     * @returns The saved or updated program entity.
     * @throws ApiError if there is an issue during the save operation.
     */
    async save(
        program: CreateProgramDTO,
        organizationId: string
    ): Promise<Program> {
        try {
            const {details, status, minTRL, maxTRL, budget, duration} = program;
            const newProgram = this.programRepository.create({
                organizationId,
                details: new ProgramDetails(
                    details.name,
                    details.description,
                    details.category
                ),
                status,
                minTRL,
                maxTRL,
                budget: new Money(budget.amount, budget.currency),
                duration: new Duration(
                    duration.startDate,
                    duration.endDate ?? null
                ),
            });
            return await this.programRepository.save(newProgram);
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(502, "Failed to save program", "Database Error");
        }
    }

    /**
     * Finds a program entity by its unique identifier.
     * @param id - The unique identifier of the program to be retrieved.
     * @returns The program entity if found, otherwise null.
     */
    async findById(id: string): Promise<Program | null> {
        try {
            const program = await this.programRepository.findOne({
                where: {id},
            });
            return program ?? null;
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(502, "Failed to find program", "Database Error");
        }
    }

    /**
     * Deletes a program entity by its unique identifier.
     * @param id - The unique identifier of the program to be deleted.
     * @returns True if the deletion was successful, otherwise false.
     * @throws ApiError if there is an issue during the delete operation.
     */
    async deleteProgram(id: string): Promise<boolean> {
        try {
            const result = await this.programRepository.delete({id});
            if (result.affected) {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(
                502,
                "Failed to delete program",
                "Database Error"
            );
        }
    }

    /**
     * Get the programs based on filter
     * @param filterDetails - The filter for program
     * @param page pagination page
     * @param numberOfResults number of results for pagination
     * @returns programs[] if available or empty array
     * @throws ApiError if there is an issue during the delete operation.
     */
    async getPrograms(
        filterDetails:
            | FindOptionsWhere<Program>
            | FindOptionsWhere<Program>[]
            | undefined,
        page: number,
        numberOfResults: number
    ): Promise<{programs: Program[]; totalNumberOfPrograms: number}> {
        try {
            const programs = await this.programRepository.find({
                where: filterDetails,
                skip: (page - 1) * numberOfResults,
                take: numberOfResults,
                order: {
                    createdAt: "DESC",
                },
            });

            const totalNumberOfPrograms = await this.programRepository
                .createQueryBuilder("programs")
                .getCount();
            return {programs, totalNumberOfPrograms};
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(502, "Failed to get program", "Database Error");
        }
    }
    /**
     *
     * @param updateDetails DTO for updating the program details
     * @returns updated program
     * @throws ApiError , if error occured while updating
     */
    async updateProgram(updateDetails: UpdateProgramDTO): Promise<Program> {
        try {
            const {id, details, budget, minTRL, maxTRL, duration} =
                updateDetails;

            const program = await this.findById(id);
            if (!program) {
                throw new ApiError(400, "Program Not Found", "Conflict Error");
            }

            if (details) {
                program.details = new ProgramDetails(
                    details.name ?? program.details.name,
                    details.description ?? program.details.description,
                    details.category ?? program.details.category
                );
            }

            if (budget) {
                program.budget = new Money(
                    budget.amount ?? program.budget.amount,
                    budget.currency ?? program.budget.currency
                );
            }

            if (duration) {
                program.duration = new Duration(
                    duration.startDate ?? program.duration.startDate,
                    duration.endDate ?? program.duration.endDate
                );
            }

            if (minTRL) {
                program.minTRL = minTRL;
            }
            if (maxTRL) {
                program.maxTRL = maxTRL;
            }

            return await this.programRepository.save(program);
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(
                502,
                "Failed to update program",
                "Database Error"
            );
        }
    }

    /**
     *
     * @param managerId The userId of the manager to be linked with the program
     * @param programId The programId of the program
     * @returns true if succeeds
     */

    async addProgramManager(
        managerId: string,
        programId: string
    ): Promise<boolean> {
        try {
            const program = await this.findById(programId);
            if (!program) {
                throw new ApiError(404, "Program Not Found", "Conflict Error");
            }
            const isLinked = await this.getProgramByManagerId(managerId);
            if (isLinked) {
                throw new ApiError(
                    409,
                    "Manager already has a program ",
                    "Conflict Error"
                );
            }
            program.managerId = managerId;
            await this.programRepository.save(program);
            return true;
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(
                502,
                "Failed to update program",
                "Database Error"
            );
        }
    }
    /**
     *
     * @param managerId The userId of the manager to be linked with the program
     * @param programId The programId of the program
     * @returns true if succeeds
     */
    async updateProgramManager(
        managerId: string,
        programId: string
    ): Promise<boolean> {
        try {
            const program = await this.findById(programId);
            if (!program) {
                throw new ApiError(404, "Program Not Found", "Conflict Error");
            }
            if (program.managerId === managerId) {
                return true;
            }
            const isLinked = await this.getProgramByManagerId(managerId);
            if (isLinked) {
                throw new ApiError(
                    409,
                    "Manager already has a program ",
                    "Conflict Error"
                );
            }
            program.managerId = managerId;
            await this.programRepository.save(program);
            return true;
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(
                502,
                "Failed to update program",
                "Database Error"
            );
        }
    }

    /**
     *
     * @param managerId The userId of the manager
     * @returns The program if it exists or null if it doesn't
     */
    async getProgramByManagerId(managerId: string): Promise<Program | null> {
        try {
            const program = await this.programRepository.findOne({
                where: {
                    managerId,
                },
            });
            return program ?? null;
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(502, "Failed to find program", "Database Error");
        }
    }
}
