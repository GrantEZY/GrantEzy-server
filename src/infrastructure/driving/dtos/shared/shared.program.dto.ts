import {PartialType, ApiProperty} from "@nestjs/swagger";
import {IsOptional, ValidateNested, IsEnum, IsUUID} from "class-validator";
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
