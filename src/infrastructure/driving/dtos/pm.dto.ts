/* eslint-disable @typescript-eslint/naming-convention */
import {
    IsUUID,
    IsObject,
    IsArray,
    IsString,
    IsDate,
    IsNumber,
    IsPositive,
    IsOptional,
    Min,
    IsInt,
    Max,
    ValidateNested,
} from "class-validator";
import {ApiProperty, ApiPropertyOptional} from "@nestjs/swagger";
import {Type} from "class-transformer";
import {TRL} from "../../../core/domain/constants/trl.constants";

// -------------------- DTOs --------------------

export class ProgramRoundDTO {
    @ApiProperty({
        example: 2025,
        description: "The year of the cycle round",
    })
    @IsNumber()
    year: number;

    @ApiProperty({
        example: "Spring",
        description: "The type/season of the cycle round",
    })
    @IsString()
    type: string;
}

export class DurationDTO {
    @ApiProperty({
        type: Date,
        example: "2025-01-01T00:00:00Z",
        description: "Start date of the cycle",
    })
    @IsDate()
    @Type(() => Date)
    startDate: Date;

    @ApiPropertyOptional({
        type: Date,
        example: "2025-12-31T23:59:59Z",
        description: "End date of the cycle (optional)",
    })
    @IsOptional()
    @IsDate()
    @Type(() => Date)
    endDate?: Date | null;
}

export class MoneyDTO {
    @ApiProperty({
        example: 1000000,
        description: "Total budget allocated for the cycle",
    })
    @IsNumber()
    @IsPositive()
    amount: number;

    @ApiProperty({
        example: "USD",
        description: "Currency of the budget",
    })
    @IsString()
    currency: string;
}

export class TRLCriteriaDTO {
    @ApiProperty({
        example: ["Define objectives", "Conduct initial research"],
        description: "List of requirements for this TRL level",
    })
    @IsArray()
    @IsString({each: true})
    requirements: string[];

    @ApiProperty({
        example: ["Whitepapers", "Research studies"],
        description: "Evidence needed to validate the TRL level",
    })
    @IsArray()
    @IsString({each: true})
    evidence: string[];

    @ApiProperty({
        example: ["Readiness score", "Impact potential"],
        description: "Metrics to measure at this TRL level",
    })
    @IsArray()
    @IsString({each: true})
    metrics: string[];
}

export class ScoringCriteriaDTO {
    @ApiProperty({
        example: 1,
        description: "Minimum possible score",
    })
    @IsNumber()
    @Min(0)
    minScore: number;

    @ApiProperty({
        example: 10,
        description: "Maximum possible score",
    })
    @IsNumber()
    @Min(1)
    maxScore: number;

    @ApiProperty({
        example: 0.25,
        description: "Weightage of this scoring criteria (0 to 1)",
    })
    @IsNumber()
    @Min(0)
    @Max(1)
    weightage: number;
}

export class ScoringSchemeDTO {
    @ApiProperty({
        type: ScoringCriteriaDTO,
        description: "Scoring criteria for technical evaluation",
        example: {
            minScore: 1,
            maxScore: 10,
            weightage: 0.3,
        },
    })
    @ValidateNested()
    @Type(() => ScoringCriteriaDTO)
    technical: ScoringCriteriaDTO;

    @ApiProperty({
        type: ScoringCriteriaDTO,
        description: "Scoring criteria for market evaluation",
        example: {
            minScore: 1,
            maxScore: 10,
            weightage: 0.2,
        },
    })
    @ValidateNested()
    @Type(() => ScoringCriteriaDTO)
    market: ScoringCriteriaDTO;

    @ApiProperty({
        type: ScoringCriteriaDTO,
        description: "Scoring criteria for financial evaluation",
        example: {
            minScore: 1,
            maxScore: 10,
            weightage: 0.2,
        },
    })
    @ValidateNested()
    @Type(() => ScoringCriteriaDTO)
    financial: ScoringCriteriaDTO;

    @ApiProperty({
        type: ScoringCriteriaDTO,
        description: "Scoring criteria for team evaluation",
        example: {
            minScore: 1,
            maxScore: 10,
            weightage: 0.15,
        },
    })
    @ValidateNested()
    @Type(() => ScoringCriteriaDTO)
    team: ScoringCriteriaDTO;

    @ApiProperty({
        type: ScoringCriteriaDTO,
        description: "Scoring criteria for innovation evaluation",
        example: {
            minScore: 1,
            maxScore: 10,
            weightage: 0.15,
        },
    })
    @ValidateNested()
    @Type(() => ScoringCriteriaDTO)
    innovation: ScoringCriteriaDTO;
}

// -------------------- Main DTO --------------------

export class CreateCycleDTO {
    @ApiProperty({
        description: "UUID of the associated program",
        example: "4b7d1f33-0f2e-4b7a-91e3-5f58f3c9d4ab",
    })
    @IsUUID()
    programId: string;

    @ApiProperty({
        description: "Round info of the cycle",
        type: ProgramRoundDTO,
        example: {
            year: 2025,
            type: "Fall",
        },
    })
    @ValidateNested()
    @Type(() => ProgramRoundDTO)
    round: ProgramRoundDTO;

    @ApiProperty({
        description: "Budget information",
        type: MoneyDTO,
        example: {
            amount: 500000,
            currency: "INR",
        },
    })
    @ValidateNested()
    @Type(() => MoneyDTO)
    budget: MoneyDTO;

    @ApiProperty({
        description: "Duration of the cycle",
        type: DurationDTO,
        example: {
            startDate: "2025-01-01T00:00:00Z",
            endDate: "2025-12-31T23:59:59Z",
        },
    })
    @ValidateNested()
    @Type(() => DurationDTO)
    duration: DurationDTO;

    @ApiProperty({
        description: "TRL Criteria mapped to each TRL",
        type: Object,
        example: {
            TRL_1: {
                requirements: ["Understand basic concepts"],
                evidence: ["Initial research document"],
                metrics: ["Basic readiness score"],
            },
            TRL_2: {
                requirements: ["Proof of concept created"],
                evidence: ["Prototype"],
                metrics: ["Performance metric"],
            },
        },
    })
    @IsObject()
    trlCriteria: Record<TRL, TRLCriteriaDTO>;

    @ApiProperty({
        description: "Scoring scheme for applications",
        type: ScoringSchemeDTO,
        example: {
            technical: {minScore: 1, maxScore: 10, weightage: 0.3},
            market: {minScore: 1, maxScore: 10, weightage: 0.2},
            financial: {minScore: 1, maxScore: 10, weightage: 0.2},
            team: {minScore: 1, maxScore: 10, weightage: 0.15},
            innovation: {minScore: 1, maxScore: 10, weightage: 0.15},
        },
    })
    @ValidateNested()
    @Type(() => ScoringSchemeDTO)
    scoringScheme: ScoringSchemeDTO;
}

export class DeleteCycleDTO {
    @ApiProperty({
        description: "UUID of the associated cycle",
        example: "4b7d1f33-0f2e-4b7a-91e3-5f58f3c9d4ab",
    })
    @IsUUID()
    cycleId: string;
}

export class GetProgramCyclesDTO {
    @ApiProperty({
        description: "UUID of the associated program",
        example: "4b7d1f33-0f2e-4b7a-91e3-5f58f3c9d4ab",
    })
    @IsUUID()
    programId: string;

    @IsInt()
    @IsPositive()
    @Type(() => Number)
    @ApiProperty({
        description: "Page Number for pagination",
        example: 1,
    })
    page: number;

    @ApiProperty({
        description: "Number Of Results per page for pagination",
        example: 1,
    })
    @IsInt()
    @Min(1)
    @Type(() => Number)
    numberOfResults: number;
}

export class GetCycleDetailsDTO {
    @ApiProperty({
        description: "Cycle Slug",
    })
    cycleSlug: string;
}

export class GetApplicationDetailsDTO {
    @ApiProperty({
        description: "Cycle Slug",
        example: "34ruibrjgq94hq83t4p3498",
    })
    cycleSlug: string;

    @ApiProperty({
        description: "Application Slug",
        example: "q3u4th938th3p48hoi9",
    })
    applicationSlug: string;
}
