import {ProgramAggregatePort} from "../../../../ports/outputs/repository/program/program.aggregate.port";
import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository, FindOptionsWhere} from "typeorm";
import {Program} from "../../../../core/domain/aggregates/program.aggregate";
import ApiError from "../../../../shared/errors/api.error";
import {CreateProgramDTO} from "../../../driving/dtos/gcv.dto";
import {ProgramDetails} from "../../../../core/domain/value-objects/program.details.object";
import {Duration} from "../../../../core/domain/value-objects/duration.object";
import {Money} from "../../../../core/domain/value-objects/project.metrics.object";
import {UpdateProgramDTO} from "../../../driving/dtos/shared/shared.program.dto";
import {ProgramStatus} from "../../../../core/domain/constants/status.constants";
import {v4 as uuid} from "uuid";
import {slugify} from "../../../../shared/helpers/slug.generator";
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
            const programStatus = ProgramStatus.IN_ACTIVE;
            const {details, minTRL, maxTRL, budget, duration} = program;
            const id = uuid(); // eslint-disable-line
            const slug = slugify(id);
            const newProgram = this.programRepository.create({
                organizationId,
                details: new ProgramDetails(
                    details.name,
                    details.description,
                    details.category
                ),
                slug,
                status: programStatus,
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
     *
     * @param name The name of the program to be fetchec
     * @returns program if found otherwise null
     */
    async findByName(
        name: string,
        organizationName: string
    ): Promise<Program | null> {
        try {
            const existingProgram = await this.programRepository
                .createQueryBuilder("program")
                .leftJoin("program.organization", "org")
                .where("program.details ->> 'name' = :programName", {
                    programName: name,
                })
                .andWhere("org.name = :orgName", {orgName: organizationName})
                .getOne();

            return existingProgram;
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
     * @param page the page number for pagination
     * @param numberOfResults number of results per page
     * @returns list of active programs
     * @throws ApiError if there is an issue during the delete operation.
     */
    async getActivePrograms(
        page: number,
        numberOfResults: number
    ): Promise<Program[]> {
        try {
            const programs = await this.programRepository.find({
                where: {
                    status: ProgramStatus.ACTIVE,
                },
                relations: ['cycles'],
                skip: (page - 1) * numberOfResults,
                take: numberOfResults,
                order: {
                    createdAt: "DESC",
                },
            });

            return programs;
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(502, "Failed to get program", "Database Error");
        }
    }

    /**
     *
     * @param slug the slug of the program
     * @returns program if found otherwise null
     * @throws ApiError , if error occured while fetching
     */
    async findByslug(slug: string): Promise<Program | null> {
        try {
            const program = await this.programRepository.findOne({
                where: {slug},
            });
            return program;
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(502, "Failed to find program", "Database Error");
        }
    }

    /**
     *
     * @param updateDetails DTO for updating the program details
     * @returns updated program
     * @throws ApiError , if error occured while updating
     */
    async updateProgram(
        updateDetails: UpdateProgramDTO,
        oldProgramDetails: Program
    ): Promise<Program> {
        try {
            const {details, budget, minTRL, maxTRL, duration} = updateDetails;

            const program = oldProgramDetails;

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
        program: Program
    ): Promise<boolean> {
        try {
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

    /**
     *
     * @param program the old program details
     * @param status status of the program which should be added
     * @returns true if success
     */
    async updateProgramStatus(
        program: Program,
        status: ProgramStatus
    ): Promise<boolean> {
        try {
            program.status = status;

            await this.programRepository.save(program);

            return true;
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(
                502,
                "Failed to update program status",
                "Database Error"
            );
        }
    }
}
