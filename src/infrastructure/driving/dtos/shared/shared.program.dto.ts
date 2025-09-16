import {PartialType, ApiProperty} from "@nestjs/swagger";
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
import {TRL} from "../../../../core/domain/constants/trl.constants";

export class UpdateProgramDetailsDTO extends PartialType(ProgramDetailsDTO) {}

export class UpdateDurationDTO extends PartialType(DurationDTO) {}

export class UpdateMoneyDTO extends PartialType(MoneyDTO) {}

export class UpdateOrganizationDetailsDTO extends PartialType(
    OrganizationDetails
) {}
export class UpdateProgramDTO {
    @ApiProperty({description: "UUID of the program need to updated"})
    @IsUUID()
    id: string;

    @IsOptional()
    @ValidateNested()
    @Type(() => UpdateProgramDetailsDTO)
    details?: UpdateProgramDetailsDTO;

    @IsOptional()
    @ValidateNested()
    @Type(() => UpdateDurationDTO)
    duration?: UpdateDurationDTO;

    @IsOptional()
    @ValidateNested()
    @Type(() => UpdateMoneyDTO)
    budget?: UpdateMoneyDTO;

    @ApiProperty({enum: TRL})
    @IsOptional()
    @IsEnum(TRL)
    minTRL: TRL;

    @ApiProperty({enum: TRL})
    @IsOptional()
    @IsEnum(TRL)
    maxTRL: TRL;
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
