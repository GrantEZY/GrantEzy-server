import {PartialType, ApiProperty, ApiPropertyOptional} from "@nestjs/swagger";
import {
    IsOptional,
    ValidateNested,
    IsEnum,
    IsUUID,
    IsObject,
    IsInt,
    IsPositive,
    Min,
} from "class-validator";
import {Type} from "class-transformer";
import {
    ProgramDetailsDTO,
    DurationDTO,
    MoneyDTO,
    OrganizationDetails,
} from "../gcv.dto";
import {ProgramRoundDTO, TRLCriteriaDTO, ScoringCriteriaDTO} from "../pm.dto";
import {TRL} from "../../../../core/domain/constants/trl.constants";

export class UpdateProgramDetailsDTO extends PartialType(ProgramDetailsDTO) {}

export class UpdateDurationDTO extends PartialType(DurationDTO) {}

export class UpdateMoneyDTO extends PartialType(MoneyDTO) {}

export class UpdateProgramRoundDTO extends PartialType(ProgramRoundDTO) {}

export class UpdatedScoringCriteriaDTO extends PartialType(
    ScoringCriteriaDTO
) {}
export class UpdateOrganizationDetailsDTO extends PartialType(
    OrganizationDetails
) {}
export class UpdateProgramDTO {
    @ApiProperty({description: "UUID of the program need to updated"})
    @IsUUID()
    id: string;

    @ApiPropertyOptional({type: () => UpdateProgramDetailsDTO})
    @IsOptional()
    @ValidateNested()
    @Type(() => UpdateProgramDetailsDTO)
    details?: UpdateProgramDetailsDTO;

    @ApiPropertyOptional({type: () => UpdateDurationDTO})
    @IsOptional()
    @ValidateNested()
    @Type(() => UpdateDurationDTO)
    duration?: UpdateDurationDTO;

    @ApiPropertyOptional({type: () => UpdateMoneyDTO})
    @IsOptional()
    @ValidateNested()
    @Type(() => UpdateMoneyDTO)
    budget?: UpdateMoneyDTO;

    @ApiPropertyOptional({enum: Object.values(TRL), enumName: "TRL"})
    @IsOptional()
    @IsEnum(TRL)
    minTRL?: TRL;

    @ApiPropertyOptional({enum: Object.values(TRL), enumName: "TRL"})
    @IsOptional()
    @IsEnum(TRL)
    maxTRL?: TRL;
}

export class UpdateCycleDTO {
    @ApiProperty({description: "UUID of the cycle need to updated"})
    @IsUUID()
    id: string;

    @ApiPropertyOptional({type: () => UpdateDurationDTO})
    @IsOptional()
    @ValidateNested()
    @Type(() => UpdateDurationDTO)
    duration?: UpdateDurationDTO;

    @ApiPropertyOptional({type: () => UpdateMoneyDTO})
    @IsOptional()
    @ValidateNested()
    @Type(() => UpdateMoneyDTO)
    budget?: UpdateMoneyDTO;

    @ApiPropertyOptional({type: () => UpdateProgramRoundDTO})
    @IsOptional()
    @ValidateNested()
    @Type(() => UpdateProgramRoundDTO)
    round?: UpdateProgramRoundDTO;

    @ApiPropertyOptional({
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
    trlCriteria?: Record<TRL, TRLCriteriaDTO>;
}

export class ProgramFilterDto {
    @IsOptional()
    @IsObject()
    otherFilters?: Record<string, any>; // eslint-disable-line
}

export class GetAllProgramDTO {
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

    @ApiProperty({
        description: "Filter Details for pagination",
        example: {organizationName: "IIITS"},
    })
    @IsOptional()
    @ValidateNested()
    @Type(() => ProgramFilterDto)
    filter?: ProgramFilterDto;
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
