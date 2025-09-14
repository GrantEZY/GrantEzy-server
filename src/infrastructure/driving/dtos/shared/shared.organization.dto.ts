import {IsEnum, IsOptional, IsString, IsUUID} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";
import {OrganisationType} from "../../../../core/domain/constants/organization.constants";
export class CreateOrganizationDTO {
    @ApiProperty({
        description: "Name of the organization",
        example: "Helping Hands",
    })
    @IsString()
    name: string;

    @ApiProperty({
        description: "Type of the organization",
        example: "IIITS",
    })
    @IsEnum(OrganisationType)
    type: OrganisationType;
}

export class UpdateOrganizationDTO {
    @ApiProperty({
        description: "ID of the organization",
        example: "550e8400-e29b-41d4-a716-446655440000",
    })
    @IsString()
    @IsUUID()
    id: string;
    @ApiProperty({
        description: "Name of the organization",
        example: "Helping Hands",
    })
    @IsString()
    @IsOptional()
    name?: string;

    @ApiProperty({
        description: "Type of the organization",
        example: "IIITS",
    })
    @IsEnum(OrganisationType)
    @IsOptional()
    type?: OrganisationType;
}
