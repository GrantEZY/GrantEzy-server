import {Cycle} from "../../../../core/domain/aggregates/cycle.aggregate";
import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {CycleAggregatePort} from "../../../../ports/outputs/repository/cycle/cycle.aggregate.port";
import ApiError from "../../../../shared/errors/api.error";
import {CreateCycleDTO} from "../../../driving/dtos/pm.dto";
import {CycleStatus} from "../../../../core/domain/constants/status.constants";
import {v4 as uuid} from "uuid";
import {slugify} from "../../../../shared/helpers/slug.generator";
import {ScoringScheme} from "../../../../core/domain/value-objects/scoringscheme.object";
import {Duration} from "../../../../core/domain/value-objects/duration.object";
import {Money} from "../../../../core/domain/value-objects/project.metrics.object";
import {ProgramRound} from "../../../../core/domain/value-objects/program.round.object";
import {TRL} from "../../../../core/domain/constants/trl.constants";
import {TRLCriteria} from "../../../../core/domain/value-objects/trlcriteria.object";
import {UpdateCycleDTO} from "../../../driving/dtos/shared/shared.program.dto";
@Injectable()
/**
 * Repository class for managing Cycle aggregate operations.
 * Implements the CycleAggregatePort interface.
 */
export class CycleAggregateRepository implements CycleAggregatePort {
    constructor(
        @InjectRepository(Cycle)
        private readonly cycleRepository: Repository<Cycle>
    ) {}
    /**
     *
     * @param createCycle Details of the cycle to be registered by the pm
     * @returns cycle if it successful
     */
    async save(createCycle: CreateCycleDTO): Promise<Cycle> {
        try {
            const {
                duration,
                budget,
                round,
                trlCriteria,
                scoringScheme,
                programId,
            } = createCycle;
            const id = uuid(); // eslint-disable-line
            const slug = slugify(id);
            const {technical, market, innovation, financial, team} =
                scoringScheme;

            // declaration fof cycle scoring schema
            const cycleScoringScheme = new ScoringScheme(
                technical,
                market,
                financial,
                team,
                innovation
            );

            // duration of the cycle object
            const cycleDuration = new Duration(
                duration.startDate,
                duration.endDate ?? null
            );

            const programRound = new ProgramRound(round.year, round.type); // program round object
            const cycleBudget = new Money(budget.amount, budget.currency); // budget Allocated for the cycle

            // trl criteria definition for the cycle created
            const cycletrlCriteria: Record<TRL, TRLCriteria> = {} as Record<
                TRL,
                TRLCriteria
            >;

            Object.keys(trlCriteria).forEach((key) => {
                const k = key as TRL;
                const value = trlCriteria[k];
                const criteria = new TRLCriteria(
                    value.requirements,
                    value.evidence,
                    value.metrics
                );
                cycletrlCriteria[k] = criteria;
            });
            const newCycle = this.cycleRepository.create({
                programId,
                slug,
                round: programRound,
                status: CycleStatus.OPEN,
                budget: cycleBudget,
                duration: cycleDuration,
                scoringScheme: cycleScoringScheme,
                trlCriteria: cycletrlCriteria,
            });

            return await this.cycleRepository.save(newCycle);
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(
                502,
                "Create Cycle Database Error",
                "Database Error"
            );
        }
    }

    /**
     *
     * @param id Unique Identifier of the cycle
     * @returns cycle if present , otherwise null
     */
    async findById(id: string): Promise<Cycle | null> {
        try {
            const cycle = await this.cycleRepository.findOne({
                where: {id},
                relations: ["program"],
            });

            return cycle;
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(
                502,
                "Find Cycle Database Error",
                "Database Error"
            );
        }
    }

    async getProgramActiveCycle(programId: string): Promise<Cycle[]> {
        try {
            const cycle = await this.cycleRepository.find({
                where: {
                    programId,
                    status: CycleStatus.OPEN,
                },
            });

            return cycle;
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(
                502,
                "Find Cycle Database Error",
                "Database Error"
            );
        }
    }

    /**
     *
     * @param slug slug of the cycle to be found
     * @returns cycle if present , otherwise null
     */
    async findCycleByslug(slug: string): Promise<Cycle | null> {
        try {
            return await this.cycleRepository.findOne({
                where: {
                    slug,
                },
            });
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(
                502,
                "Find Cycle Database Error",
                "Database Error"
            );
        }
    }

    async getProgramCycleWithRound(
        programId: string,
        round: ProgramRound
    ): Promise<Cycle | null> {
        try {
            const {year, type} = round;

            const query = this.cycleRepository
                .createQueryBuilder("cycle")
                .where("cycle.programId = :programId", {programId})
                .andWhere("cycle.round ->> 'year' = :year", {
                    year: year.toString(),
                })
                .andWhere("cycle.round ->> 'type' = :type", {type});

            return await query.getOne();
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(
                502,
                "Find Cycle Database Error",
                "Database Error"
            );
        }
    }

    /**
     *
     * @param programId programId of the program for which cycles to be fetched
     * @param page page for pagination
     * @param numberOfResults numberOfResults
     * @returns cycles[] and numberOfResults
     */
    async findProgramCycles(
        programId: string,
        page: number,
        numberOfResults: number
    ): Promise<{cycles: Cycle[]; totalNumberOfCycles: number}> {
        try {
            const cycles = await this.cycleRepository.find({
                where: {
                    programId,
                },
                skip: (page - 1) * numberOfResults,
                take: numberOfResults,
                order: {
                    createdAt: "DESC",
                },
            });
            const totalNumberOfCycles = await this.cycleRepository
                .createQueryBuilder("cycles")
                .getCount();
            return {cycles, totalNumberOfCycles};
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(
                502,
                "Find Cycle Database Error",
                "Database Error"
            );
        }
    }

    /**
     *
     * @param oldCycle prev details of the previous cycle
     * @param updateDetails the details to be updated
     * @returns If success returns updatedCycle
     */
    async updateCycle(
        oldCycle: Cycle,
        updateDetails: UpdateCycleDTO
    ): Promise<Cycle> {
        try {
            const {trlCriteria, duration, round} = updateDetails;

            if (duration) {
                oldCycle.duration = new Duration(
                    duration.startDate ?? oldCycle.duration.startDate,
                    duration.endDate ?? oldCycle.duration.endDate
                );
            }
            if (round) {
                oldCycle.round = new ProgramRound(
                    round.year ?? oldCycle.round.year,
                    round.type ?? oldCycle.round.type
                );
            }

            if (trlCriteria) {
                Object.keys(trlCriteria).forEach((key) => {
                    const k = key as TRL;
                    const value = trlCriteria[k];
                    const criteria = new TRLCriteria(
                        value.requirements,
                        value.evidence,
                        value.metrics
                    );
                    oldCycle.trlCriteria[k] = criteria;
                });
            }

            const cycle: Cycle = await this.cycleRepository.save(oldCycle);

            return cycle;
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(
                502,
                "Update Cycle Database Error",
                "Database Error"
            );
        }
    }

    /**
     *
     * @param id id of the cycle to be deleted
     * @returns true if successful otherwise false
     */
    async deleteCycle(id: string): Promise<boolean> {
        try {
            const result = await this.cycleRepository.delete({
                id,
            });

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
                "Delete Cycle Database Error",
                "Database Error"
            );
        }
    }

    /**
     *
     * @param slug cycle slug with Cycle
     * @returns Cycle if present
     */
    async getCycleDetailsWithApplications(slug: string): Promise<Cycle | null> {
        try {
            return await this.cycleRepository.findOne({
                where: {
                    slug,
                },
                relations: ["applications"],
            });
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(
                502,
                "Find Cycle Database Error",
                "Database Error"
            );
        }
    }
}
